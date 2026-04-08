import mediapipe as mp
import numpy as np, cv2
 
holistic = mp.solutions.holistic.Holistic(
    static_image_mode=False,
    model_complexity=2,          # highest accuracy
    min_detection_confidence=0.6,
    min_tracking_confidence=0.5
)
 
def extract_keypoints(frame_bgr) -> dict:
    rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    res = holistic.process(rgb)
    def lm_to_array(lm_list):
        if lm_list is None:
            return np.zeros((len(lm_list.landmark), 3)) if lm_list else None
        return np.array([[l.x, l.y, l.z] for l in lm_list.landmark])
    return {
        'pose':       lm_to_array(res.pose_landmarks),
        'left_hand':  lm_to_array(res.left_hand_landmarks),
        'right_hand': lm_to_array(res.right_hand_landmarks),
        'face':       lm_to_array(res.face_landmarks),
    }
 
def process_video(video_path: str) -> list[dict]:
    cap = cv2.VideoCapture(video_path)
    frames = []
    while cap.isOpened():
        ok, frame = cap.read()
        if not ok: break
        frames.append(extract_keypoints(frame))
    cap.release()
    return frames
