import bpy
import os

# Change to the directory where the GLB is located
os.chdir(r'C:\Users\Roshni\Downloads\Signway4')

# Import the GLB
bpy.ops.import_scene.gltf(filepath='public/hand_animation.glb')

# Check actions
print(f"Number of actions: {len(bpy.data.actions)}")
for action in bpy.data.actions:
    print(f"Action: {action.name}")
    print(f"  Frame range: {action.frame_range[0]} to {action.frame_range[1]}")
    # Also check the fcurves to see what they are animating
    for fcurve in action.fcurves:
        print(f"    FCurve: {fcurve.data_path} index {fcurve.array_index}")

# Also list objects and see if they have animation data
print("\nObjects with animation data:")
for obj in bpy.data.objects:
    if obj.animation_data and obj.animation_data.action:
        print(f"  {obj.name}: action {obj.animation_data.action.name}")