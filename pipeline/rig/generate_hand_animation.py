import bpy, math, json, sys
import os

# Fixed paths for demo
angles_path = os.path.join(os.path.dirname(__file__), 'angles.json')
out_path = os.path.join(os.path.dirname(__file__), 'hand_animation.glb')

with open(angles_path) as f:
    data = json.load(f)   # { 'frames': [ {hand_angles, pose_angles}, ... ] }

BONE_MAP_L = {
    'thumb':  ['thumb.L.001',   'thumb.L.002',   'thumb.L.003'],
    'index':  ['pointer.L.001', 'pointer.L.002', 'pointer.L.003'],
    'middle': ['middle.L.004',  'middle.L.005',  'middle.L.006'],
    'ring':   ['ring.L.007',    'ring.L.008',    'ring.L.009'],
    'pinky':  ['pinky.L.010',   'pinky.L.011',   'pinky.L.012'],
}

BONE_MAP_R = {
    'thumb':  ['thumb.R.001',   'thumb.R.002',   'thumb.R.003'],
    'index':  ['pointer.R.001', 'pointer.R.002', 'pointer.R.003'],
    'middle': ['middle.R.004',  'middle.R.005',  'middle.R.006'],
    'ring':   ['ring.R.007',    'ring.R.008',    'ring.R.009'],
    'pinky':  ['pinky.R.010',   'pinky.R.011',   'pinky.R.012'],
}

rig_l = bpy.data.objects.get('Armature L')
rig_r = bpy.data.objects.get('Armature R')

scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end   = len(data['frames'])

def apply_hand_data(rig, hand_data, bone_map, frame_idx):
    if not rig or not hand_data: return
    for finger, bones in bone_map.items():
        if finger not in hand_data: continue
        angles = hand_data[finger]
        for joint_i, bone_name in enumerate(bones):
            if joint_i >= len(angles): break
            flex_deg, spread_deg = angles[joint_i]
            if bone_name not in rig.pose.bones: continue
            pb = rig.pose.bones[bone_name]
            pb.rotation_mode = 'XYZ'
            pb.rotation_euler[0] = math.radians(flex_deg)
            pb.rotation_euler[1] = math.radians(spread_deg)
            pb.keyframe_insert('rotation_euler', frame=frame_idx)

for frame_idx, frame_data in enumerate(data['frames'], start=1):
    scene.frame_set(frame_idx)
    apply_hand_data(rig_l, frame_data.get('left_hand'),  BONE_MAP_L, frame_idx)
    apply_hand_data(rig_r, frame_data.get('right_hand'), BONE_MAP_R, frame_idx)

bpy.ops.object.mode_set(mode='OBJECT')

# Export as GLB
bpy.ops.export_scene.gltf(
    filepath=out_path,
    export_format='GLB',
    export_animations=True,
    export_skins=True,
    export_morph=True,
    export_cameras=False,
    export_lights=False,
)
print(f'Exported: {out_path}')