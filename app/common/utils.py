from flask import request
from flask_restful import abort
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