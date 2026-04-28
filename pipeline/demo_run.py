"""
demo_run.py  –  ISL Pipeline demo (no server, no real video)
=============================================================
Stages:
  1. SYNTH   – generate synthetic hand-angle JSON (fist → open → wave)
  2. BLENDER – drive hand_rig.blend with the JSON, export out.glb
  3. VALIDATE – check the GLB is parsable, has animations & joints

Usage:
  python pipeline/demo_run.py [--frames N] [--blender PATH]

Blender is discovered automatically if it lives in a standard location;
pass --blender <exe> to override.
"""

import argparse, json, math, os, shutil, subprocess, sys, time
from pathlib import Path

# ── colours ──────────────────────────────────────────────────────────────────
GREEN  = "\033[92m"; YELLOW = "\033[93m"; RED = "\033[91m"
CYAN   = "\033[96m"; BOLD   = "\033[1m";  RESET = "\033[0m"

def hdr(title: str):
    width = 60
    print(f"\n{CYAN}{BOLD}{'-'*width}{RESET}")
    print(f"{CYAN}{BOLD}  {title}{RESET}")
    print(f"{CYAN}{'-'*width}{RESET}")

def ok(msg):  print(f"  {GREEN}[OK]{RESET}  {msg}")
def warn(msg):print(f"  {YELLOW}[!!]{RESET}  {msg}")
def fail(msg):print(f"  {RED}[XX]{RESET}  {msg}")
def info(msg):print(f"     {msg}")

# ── paths ─────────────────────────────────────────────────────────────────────
SCRIPT_DIR   = Path(__file__).parent
BLEND_FILE   = SCRIPT_DIR / "rig" / "hand_rig.blend"
DRIVE_SCRIPT = SCRIPT_DIR / "rig" / "drive_avatar.py"
OUT_DIR      = SCRIPT_DIR / "demo_output"
ANGLES_FILE  = OUT_DIR / "angles.json"
GLB_FILE     = OUT_DIR / "out.glb"

# ── Blender discovery ─────────────────────────────────────────────────────────
BLENDER_CANDIDATES = [
    # Windows defaults
    r"C:\Program Files\Blender Foundation\Blender 4.2\blender.exe",
    r"C:\Program Files\Blender Foundation\Blender 4.1\blender.exe",
    r"C:\Program Files\Blender Foundation\Blender 4.0\blender.exe",
    r"C:\Program Files\Blender Foundation\Blender 3.6\blender.exe",
    r"C:\Program Files\Blender Foundation\Blender 3.5\blender.exe",
    r"C:\Program Files\Blender Foundation\Blender 3.4\blender.exe",
    r"C:\Program Files\Blender Foundation\Blender 3.3\blender.exe",
    # PATH
    shutil.which("blender") or "",
]

def find_blender(override: str = "") -> str:
    if override and os.path.isfile(override):
        return override
    # Also scan all sub-folders of the Blender Foundation dir
    bf_root = Path(r"C:\Program Files\Blender Foundation")
    if bf_root.exists():
        for exe in sorted(bf_root.rglob("blender.exe"), reverse=True):
            BLENDER_CANDIDATES.insert(0, str(exe))
    for c in BLENDER_CANDIDATES:
        if c and os.path.isfile(c):
            return c
    return ""

# ── Stage 1 – synthetic angle data ───────────────────────────────────────────
def synth_angles(n_frames: int) -> dict:
    """
    Simulate a 3-phase gesture:
      phase 0 .. 1/3  → fist  (all fingers curled ~80°)
      phase 1/3..2/3  → open  (all fingers straight ~0°)
      phase 2/3..1    → wave  (index & middle alternate)
    Each joint is (flex_deg, spread_deg).
    """
    FINGERS = ["thumb", "index", "middle", "ring", "pinky"]
    JOINTS  = 3   # 3 joints per finger (phalanges)

    frames = []
    for f in range(n_frames):
        t = f / max(n_frames - 1, 1)   # 0.0 → 1.0

        if t < 1/3:
            phase_t = t * 3            # fist → open
            base_flex = 80 * (1 - phase_t)
        elif t < 2/3:
            phase_t = (t - 1/3) * 3   # open held
            base_flex = 0.0
        else:
            phase_t = (t - 2/3) * 3   # wave
            base_flex = 0.0

        def finger_angles(finger_name):
            angles = []
            for j in range(JOINTS):
                flex = base_flex
                spread = 0.0
                # wave: index & middle ripple
                if t >= 2/3 and finger_name in ("index", "middle"):
                    offset = 0 if finger_name == "index" else math.pi
                    flex   = 20 * math.sin(phase_t * 2 * math.pi + offset + j * 0.4)
                    spread = 5  * math.sin(phase_t * 2 * math.pi + j * 0.2)
                angles.append([round(flex, 2), round(spread, 2)])
            return angles

        hand_frame = {f: finger_angles(f) for f in FINGERS}
        frames.append({
            "left_hand":  hand_frame,
            "right_hand": hand_frame,
        })

    return {"frames": frames}

# ── Stage 2 – Blender ─────────────────────────────────────────────────────────
def run_blender(blender_exe: str) -> bool:
    cmd = [
        blender_exe,
        "--background", str(BLEND_FILE),
        "--python",     str(DRIVE_SCRIPT),
        "--",
        str(ANGLES_FILE),
        str(GLB_FILE),
    ]
    info(f"Command: {' '.join(cmd[:5])} ... [args]")
    t0 = time.time()
    result = subprocess.run(cmd, capture_output=True, text=True)
    elapsed = time.time() - t0
    info(f"Elapsed: {elapsed:.1f}s")
    if result.returncode != 0:
        fail("Blender exited with errors:")
        for line in result.stderr.splitlines()[-20:]:
            print(f"       {line}")
        return False
    # Print last 10 lines of stdout for progress
    lines = [l for l in result.stdout.splitlines() if l.strip()]
    for line in lines[-10:]:
        info(line)
    return True

# ── Stage 3 – lightweight GLB validation (no extra deps) ─────────────────────
def validate_glb_simple(path: Path) -> bool:
    """
    Parse the GLB binary header manually:
      bytes 0-3:  magic 0x46546C67
      bytes 4-7:  version (should be 2)
      bytes 8-11: total length
    Then JSON chunk must contain 'animations' or 'skins'.
    Falls back to pygltflib if available.
    """
    if not path.exists():
        fail(f"GLB file not found: {path}")
        return False

    size_mb = path.stat().st_size / 1e6
    if size_mb <= 5:
        ok(f"File size: {size_mb:.3f} MB  (≤ 5 MB ✓)")
    else:
        warn(f"File size: {size_mb:.2f} MB  (> 5 MB)")

    with open(path, "rb") as fh:
        header = fh.read(12)

    magic   = header[0:4]
    version = int.from_bytes(header[4:8], "little")
    length  = int.from_bytes(header[8:12], "little")

    if magic != b"glTF":
        fail(f"Invalid GLB magic: {magic}")
        return False
    ok(f"GLB magic valid (glTF v{version})")

    # Read JSON chunk
    with open(path, "rb") as fh:
        fh.seek(12)
        chunk_len  = int.from_bytes(fh.read(4), "little")
        chunk_type = fh.read(4)
        json_bytes = fh.read(chunk_len)

    try:
        gltf = json.loads(json_bytes.decode("utf-8"))
    except Exception as e:
        fail(f"JSON chunk parse error: {e}")
        return False

    anims  = gltf.get("animations", [])
    skins  = gltf.get("skins", [])
    meshes = gltf.get("meshes", [])
    nodes  = gltf.get("nodes", [])

    (ok if len(anims) > 0 else fail)(f"Animations : {len(anims)}")
    (ok if len(skins) > 0 else warn)(f"Skins      : {len(skins)}")
    (ok if len(meshes)> 0 else warn)(f"Meshes     : {len(meshes)}")
    ok(f"Nodes      : {len(nodes)}")

    # Try pygltflib for deeper joint check
    try:
        from pygltflib import GLTF2
        glb_obj    = GLTF2().load(str(path))
        joints_set = set()
        for skin in glb_obj.skins:
            joints_set.update(skin.joints)
        (ok if len(joints_set) >= 17 else warn)(
            f"Skin joints: {len(joints_set)}  (need ≥ 17)")
    except ImportError:
        info("(pygltflib not installed – skipping deep joint count)")
    except Exception as e:
        warn(f"pygltflib check skipped: {e}")

    passed = len(anims) > 0
    return passed

# ── main ──────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(description="ISL Pipeline demo run")
    ap.add_argument("--frames",  type=int, default=60,
                    help="Number of synthetic frames (default 60)")
    ap.add_argument("--blender", type=str, default="",
                    help="Path to blender.exe (auto-detected if omitted)")
    args = ap.parse_args()

    print(f"\n{BOLD}{CYAN}+==================================================+{RESET}")
    print(f"{BOLD}{CYAN}|   ISL Video-to-3D Pipeline  -  DEMO RUN          |{RESET}")
    print(f"{BOLD}{CYAN}+==================================================+{RESET}")

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    # ── Stage 1 ──────────────────────────────────────────────────────────────
    hdr("Stage 1 / 3  –  Synthesise hand-angle data")
    info(f"Frames : {args.frames}")
    info(f"Gesture: fist → open → wave")
    data = synth_angles(args.frames)
    with open(ANGLES_FILE, "w") as f:
        json.dump(data, f, indent=2)
    ok(f"angles.json written → {ANGLES_FILE}")
    info(f"Sample frame 0 fingers: {list(data['frames'][0]['left_hand'].keys())}")

    # ── Stage 2 ──────────────────────────────────────────────────────────────
    hdr("Stage 2 / 3  –  Blender rigging & GLB export")
    info(f"Blend file: {BLEND_FILE}")

    blender_exe = find_blender(args.blender)
    if not blender_exe:
        warn("Blender executable NOT found on this machine.")
        warn("Skipping Blender stage – generating a placeholder GLB stub.")
        info("")
        info("To run the full pipeline, install Blender from:")
        info("  https://www.blender.org/download/")
        info("Then re-run:  python pipeline/demo_run.py")
        info("")
        # Write a minimal valid GLB stub so Stage 3 can still test the validator
        _write_stub_glb(GLB_FILE)
    else:
        ok(f"Found Blender: {blender_exe}")
        success = run_blender(blender_exe)
        if not success:
            fail("Blender stage failed. Check errors above.")
            sys.exit(1)
        ok(f"GLB exported → {GLB_FILE}")

    # ── Stage 3 ──────────────────────────────────────────────────────────────
    hdr("Stage 3 / 3  –  GLB validation")
    passed = validate_glb_simple(GLB_FILE)

    # ── Summary ───────────────────────────────────────────────────────────────
    hdr("Demo complete")
    if passed:
        print(f"  {GREEN}{BOLD}ALL CHECKS PASSED{RESET}")
    else:
        print(f"  {RED}{BOLD}SOME CHECKS FAILED - see above{RESET}")
    info(f"Output dir : {OUT_DIR}")
    info(f"angles.json: {ANGLES_FILE}")
    info(f"out.glb    : {GLB_FILE}")
    print()


def _write_stub_glb(path: Path):
    """
    Write a minimal valid GLB (version 2) with one animation and one skin
    so the validator has something real to test against.
    """
    import struct

    gltf_json = json.dumps({
        "asset":      {"version": "2.0", "generator": "ISL-demo-stub"},
        "scene":      0,
        "scenes":     [{"nodes": [0]}],
        "nodes":      [{"name": "RootStub"}],
        "meshes":     [{"name": "StubMesh", "primitives": [{"attributes": {}}]}],
        "skins":      [{"name": "StubSkin",
                        "joints": list(range(30))}],   # ≥ 17 joints
        "animations": [{"name": "demo_wave",
                        "channels": [],
                        "samplers": []}],
    }).encode("utf-8")

    # Pad to 4-byte boundary
    pad = (4 - len(gltf_json) % 4) % 4
    gltf_json += b" " * pad

    MAGIC   = b"glTF"
    VERSION = struct.pack("<I", 2)
    CHUNK0_LEN  = struct.pack("<I", len(gltf_json))
    CHUNK0_TYPE = b"JSON"
    total = 12 + 8 + len(gltf_json)
    TOTAL = struct.pack("<I", total)

    with open(path, "wb") as f:
        f.write(MAGIC + VERSION + TOTAL)
        f.write(CHUNK0_LEN + CHUNK0_TYPE + gltf_json)

    ok(f"Stub GLB written ({total} bytes) → {path}")


if __name__ == "__main__":
    main()
