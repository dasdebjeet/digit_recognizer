import numpy as np
import cv2
import base64


def load_base64_img():
    with open('img.txt') as f:
        return f.read()

def get_cv2_image_from_base64_string(b64str):
    encoded_data = b64str.split(',')[1]
    nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img


n_img = get_cv2_image_from_base64_string(load_base64_img())
print(n_img.shape)