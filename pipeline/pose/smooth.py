from scipy.signal import savgol_filter
import numpy as np
 
def smooth_sequence(frames: list[dict], window=9, poly=3) -> list[dict]:
    # Stack each landmark group into (T, N, 3) arrays
    keys = ['pose', 'left_hand', 'right_hand']
    for key in keys:
        seq = np.array([f[key] for f in frames if f[key] is not None])
        if seq.shape[0] < window: continue
        # Apply filter along time axis for each coord independently
        smoothed = savgol_filter(seq, window_length=window,
                                 polyorder=poly, axis=0)
        # Write back
        valid_i = 0
        for f in frames:
            if f[key] is not None:
                f[key] = smoothed[valid_i]; valid_i += 1
    return frames
