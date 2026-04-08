import cv2, boto3
from fastapi import UploadFile, HTTPException
 
def validate_video(path: str) -> dict:
    cap = cv2.VideoCapture(path)
    fps   = cap.get(cv2.CAP_PROP_FPS)
    w     = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h     = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total / fps
    cap.release()
 
    if min(w, h) < 720:
        raise HTTPException(400, 'Resolution too low')
    if not (1 <= duration <= 15):
        raise HTTPException(400, 'Duration out of range')
    return {'fps': fps, 'width': w, 'height': h, 'duration': duration}
 
def upload_to_r2(local_path: str, job_id: str) -> str:
    s3 = boto3.client('s3', endpoint_url=R2_ENDPOINT)
    key = f'raw/{job_id}/input.mp4'
    s3.upload_file(local_path, R2_BUCKET, key)
    return f'{CDN_BASE}/{key}'
