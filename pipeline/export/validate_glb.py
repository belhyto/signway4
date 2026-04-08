import subprocess, json, os
from pygltflib import GLTF2
 
def validate_glb(path: str) -> dict:
    results = {'path': path, 'passed': [], 'failed': []}
 
    # 1. File size
    size_mb = os.path.getsize(path) / 1e6
    (results['passed'] if size_mb <= 5 else results['failed']).append(
        f'File size: {size_mb:.2f} MB')
 
    # 2. Parse GLB
    glb = GLTF2().load(path)
 
    # 3. Animation present
    has_anim = len(glb.animations) > 0
    (results['passed'] if has_anim else results['failed']).append(
        f'Animations: {len(glb.animations)}')
 
    # 4. Skeleton bones
    skin_joints = set()
    for skin in glb.skins:
        skin_joints.update(skin.joints)
    (results['passed'] if len(skin_joints) >= 17 else results['failed']).append(
        f'Skin joints: {len(skin_joints)}')
 
    # 5. Run gltf-validator
    result = subprocess.run(
        ['gltf-validator', path, '--format', 'json'],
        capture_output=True, text=True)
    report = json.loads(result.stdout)
    errors = report.get('issues', {}).get('numErrors', 0)
    (results['passed'] if errors == 0 else results['failed']).append(
        f'glTF spec errors: {errors}')
 
    results['ok'] = len(results['failed']) == 0
    return results
