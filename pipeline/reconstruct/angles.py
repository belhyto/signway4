import numpy as np
 
# Hand joint indices (MediaPipe convention)
FINGER_CHAINS = {
    'thumb':  [0, 1, 2, 3, 4],
    'index':  [0, 5, 6, 7, 8],
    'middle': [0, 9, 10, 11, 12],
    'ring':   [0, 13, 14, 15, 16],
    'pinky':  [0, 17, 18, 19, 20],
}
 
def compute_bone_rotation(p_parent, p_child, p_grandchild):
    """Return (flex_deg, spread_deg) for one joint."""
    v1 = p_child     - p_parent
    v2 = p_grandchild - p_child
    v1 /= (np.linalg.norm(v1) + 1e-8)
    v2 /= (np.linalg.norm(v2) + 1e-8)
    cos_a = np.clip(np.dot(v1, v2), -1, 1)
    flex = np.degrees(np.arccos(cos_a))
    cross = np.cross(v1, v2)
    spread = np.degrees(np.arctan2(cross[0], cross[2]))
    return flex, spread
 
def extract_hand_angles(hand_kps: np.ndarray) -> dict:
    """hand_kps: (21, 3) array of 3D positions."""
    angles = {}
    for finger, chain in FINGER_CHAINS.items():
        finger_angles = []
        for i in range(len(chain) - 2):
            pp = hand_kps[chain[i]]
            pc = hand_kps[chain[i+1]]
            pg = hand_kps[chain[i+2]]
            finger_angles.append(compute_bone_rotation(pp, pc, pg))
        angles[finger] = finger_angles
    return angles
