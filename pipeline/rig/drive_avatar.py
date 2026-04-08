# Run as: blender --background avatar/hand_rig.blend \
#                  --python pipeline/rig/drive_avatar.py -- angles.json out.glb
 
import bpy, math, json, sys
 
argv  = sys.argv[sys.argv.index('--') + 1:]
angles_path, out_path = argv[0], argv[1]
 
with open(angles_path) as f:
    data = json.load(f)   # { 'frames': [ {hand_angles, pose_angles}, ... ] }
 
rig = bpy.data.objects['Hand_Rig']
scene = bpy.context.scene
scene.frame_start = 1
scene.frame_end   = len(data['frames'])
 
BONE_MAP = {
    # Maps our angle keys to rig bone names
    ('index',  0): 'Index_Knuckle',
    ('index',  1): 'Index_Mid',
    ('index',  2): 'Index_Tip',
    ('middle', 0): 'Middle_Knuckle',
    ('middle', 1): 'Middle_Mid',
    ('middle', 2): 'Middle_Tip',
    ('ring',   0): 'Ring_Knuckle',
    ('ring',   1): 'Ring_Mid',
    ('ring',   2): 'Ring_Tip',
    ('pinky',  0): 'Pinky_Knuckle',
    ('pinky',  1): 'Pinky_Mid',
    ('pinky',  2): 'Pinky_Tip',
    ('thumb',  0): 'Thumb_Base',
    ('thumb',  1): 'Thumb_Knuckle',
}
 
bpy.context.view_layer.objects.active = rig
bpy.ops.object.mode_set(mode='POSE')
 
for frame_idx, frame_data in enumerate(data['frames'], start=1):
    scene.frame_set(frame_idx)
    hand_angles = frame_data.get('right_hand', {})
    for (finger, joint_i), bone_name in BONE_MAP.items():
        if finger not in hand_angles: continue
        joints = hand_angles[finger]
        if joint_i >= len(joints): continue
        flex_deg, spread_deg = joints[joint_i]
        pb = rig.pose.bones[bone_name]
        pb.rotation_mode = 'XYZ'
        pb.rotation_euler[0] = math.radians(flex_deg)
        pb.rotation_euler[1] = math.radians(spread_deg)
        pb.keyframe_insert('rotation_euler', frame=frame_idx)
 
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
