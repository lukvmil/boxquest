from flask import request
from flask_restful import abort

def validate_json():
    data = request.get_json(force=True, silent=True)
    if not data: abort(400, message='Invalid JSON body.')
    return data