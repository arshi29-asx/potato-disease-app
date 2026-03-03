from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
from io import BytesIO

# create app
app = FastAPI()

# Allow React frontend to connect
origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# load model
MODEL = tf.keras.models.load_model("potato_model.keras")

# class names
CLASS_NAMES = [
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___Healthy"
]

# image size
IMAGE_SIZE = 256


# convert image to numpy
def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).resize((IMAGE_SIZE, IMAGE_SIZE))
    image = np.array(image)
    return image


# test route
@app.get("/ping")
async def ping():
    return "Hello I am alive"


# prediction route
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())

    img_batch = np.expand_dims(image, 0)

    predictions = MODEL.predict(img_batch)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])

    return {
        "class": predicted_class,
        "confidence": float(confidence)
    }