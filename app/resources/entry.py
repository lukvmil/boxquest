from flask import request
from flask_restful import Resource
from datetime import datetime
import json
from app.common import utils
from app.models import EntryModel, BoxModel

class CreateEntry(Resource):
    def post(self, box_id):
        print("yo")
        image = request.files['file']
        geoloc = json.loads(request.form['geoloc'])
        message = request.form['message']
        box_key = request.form['box_key']

        print(image)
        print(geoloc)
        print(message)
        print(box_key)

        entry = EntryModel(
            timestamp = datetime.fromtimestamp(int(geoloc['timestamp']) / 1000),
            location = (geoloc['latitude'], geoloc['longitude']),
            message = message,
            image = image
        )
        entry.save()

        box = BoxModel.objects(pub_id=box_id).first()
        box.entries.append(entry)
        box.save()

        return {'success': True}
        

        

class ViewEntry(Resource):
    def get():
        ...