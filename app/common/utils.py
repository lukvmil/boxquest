from flask import request
from flask_restful import abort
from PIL import Image, ExifTags
from io import BytesIO
import random
import requests

def validate_json():
    data = request.get_json(force=True, silent=True)
    if not data: abort(400, message='Invalid JSON body.')
    return data

def obfuscate(coord, place=3):
    return [
        round(i, place - 1) + 
        random.randint(0, 9) / 10 ** place 
        for i in coord
    ]

def get_loc_str(coord):
    api_url = "https://nominatim.openstreetmap.org/reverse"

    resp = requests.get(api_url, params={
        "lat": coord[0],
        "lon": coord[1],
        "zoom": 10,
        "format": "json"
    })

    data = resp.json()
    addr = data['address']

    loc_str = f"{list(addr.values())[0]}, {addr['state']}"
    return loc_str

def apply_rotation(image):
    img = Image.open(image)
    exif_data = img.getexif()
    orientation = exif_data.get(274)

    if orientation == 3: 
        img = img.transpose(Image.Transpose.ROTATE_180)
        print("rotated 180")
    elif orientation == 6: 
        img = img.transpose(Image.Transpose.ROTATE_270)
        print("rotated 270")
    elif orientation == 8: 
        img = img.transpose(Image.Transpose.ROTATE_90)
        print("rotated 90")

    img_bytes = BytesIO()
    img.save(img_bytes, "JPEG")
    return img_bytes