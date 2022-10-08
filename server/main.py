import cv2
import base64


def load_base64_img():
    with open('img.txt') as f:
        return f.read()