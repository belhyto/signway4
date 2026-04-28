import bpy
import os

# Import the GLB
bpy.ops.import_scene.gltf(filepath='public/hand_animation.glb')

# Check actions
print(f"Number of actions: {len(bpy.data.actions)}")
for action in bpy.data.actions:
    print(f"Action: {action.name}")
    print(f"  Frame range: {action.frame_range[0]} to {action.frame_range[1]}")
    print(f"  Duration: {action.frame_range[1] - action.frame_range[0] + 1} frames")