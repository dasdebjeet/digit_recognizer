from keras.models import load_model
import numpy as np

import base64
import cv2

__model = None

# load model
def loadModel():
    global __model
    if __model is None:
        print("loading saved artifacts...start")
        __model = load_model("./artifacts/saved_model.h5")
    print("loading saved artifacts...done")


# load the  base64 img from file
def load_base64_img():
    with open('img.txt') as f:
        return f.read()


# convert the base64 image/ image path --> transparent image to white background ---> to array using cv2
def get_cv2_image_from_base64_string(b64str, img_path):
    if img_path:
        img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)
    else:
        encoded_data = b64str.split(',')[1]
        nparr = np.frombuffer(base64.b64decode(encoded_data), np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_UNCHANGED)  # load the image with alpha channel

    ## transparent to white bg
    alpha_channel = img[:, :, 3]
    _, mask = cv2.threshold(alpha_channel, 254, 255, cv2.THRESH_BINARY)  # binarize mask
    color = img[:, :, : 3]
    new_img = cv2.bitwise_not(cv2.bitwise_not(color, mask=mask))
    return new_img


# resizing the image into 28x28 pixels
def get_img_reshape_by_cv2(img_data):
    image = img_data
    grey = cv2.cvtColor(image.copy(), cv2.COLOR_BGR2GRAY)  # convert to gray
    ret, thresh = cv2.threshold(grey.copy(), 75, 255, cv2.THRESH_BINARY_INV)
    contours, _ = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)

    preprocessed_digits = []
    for c in contours:
        x, y, w, h = cv2.boundingRect(c)

        # Creating a rectangle around the digit in the original image (for displaying the digits fetched via contours)
        roi = cv2.rectangle(image, (x, y), (x + w, y + h), color=(0, 255, 0), thickness=1)

        # Cropping out the digit from the image corresponding to the current contours in the for loop
        digit = thresh[y:y + h, x:x + w]

        # Resizing that digit to (18, 18)
        resized_digit = cv2.resize(digit, (500, 500))
        # resized_digit = cv2.resize(resized_digit, (500,500))
        resized_digit = cv2.resize(resized_digit, (400, 400))
        resized_digit = cv2.resize(resized_digit, (300, 300))
        resized_digit = cv2.resize(resized_digit, (200, 200))
        resized_digit = cv2.resize(resized_digit, (100, 100))

        resized_digit = cv2.resize(resized_digit, (50, 50))
        resized_digit = cv2.resize(resized_digit, (40, 40))
        resized_digit = cv2.resize(resized_digit, (25, 25))
        resized_digit = cv2.resize(resized_digit, (18, 18))  ##### <------

        # Padding the digit with 5 pixels of black color (zeros) in each side to finally produce the image of (28, 28)
        padded_digit = np.pad(resized_digit, ((5, 5), (5, 5)), "constant", constant_values=0)

        # plt.imshow(padded_digit)

        # Adding the preprocessed digit to the list of preprocessed digits
        preprocessed_digits.append(padded_digit)

    # plt.imshow(padded_digit, cmap="gray")
    # plt.show()

    # print(preprocessed_digits)
    inp = np.array(preprocessed_digits)
    return inp

def classify_image(img_url):
    n_img = get_cv2_image_from_base64_string(img_url, None)
    crop_img = get_img_reshape_by_cv2(n_img)

    num_pred = []
    for i in range(len(crop_img)):
        if len(crop_img) > 1:
                pred = __model.predict(crop_img[i].reshape(1,28,28))
        else:
            pred = __model.predict(crop_img)
        num_pred.append(np.argmax(pred))
    print(num_pred)
    return num_pred


if __name__ == '__main__':
    loadModel()


