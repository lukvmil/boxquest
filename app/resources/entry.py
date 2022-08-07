from flask import request
from flask_restful import Resource, abort
from datetime import datetime
import json
from app.common import utils
from app.models import EntryModel, BoxModel

class CreateEntry(Resource):
    def post(self, box_id):
        image = request.files['file']
        geoloc = json.loads(request.form['geoloc'])
        message = request.form['message']
        box_key = request.form['box_key']

        box = BoxModel.objects(pub_id=box_id).first()
        if box.key != box_key: return {'success': False}

        entry = EntryModel(
            timestamp = datetime.fromtimestamp(int(geoloc['timestamp']) / 1000),
            location = (geoloc['latitude'], geoloc['longitude']),
            message = message,
            image = image
        )
        entry.save()

        box.entries.append(entry)
        box.save()

        return {'success': True}
        

class ViewEntry(Resource):
    def get(self, box_id, entry_id):
        box = BoxModel.objects(pub_id=box_id).first()
        entry = box.entries[entry_id]

        return json.loads(entry.to_json())


class ViewEntries(Resource):
    def get(self, box_id):
        box = BoxModel.objects(pub_id=box_id).first()
        entries = []

        for e in box.entries:
            e = json.loads(e.to_json())
            entries.append({
                'timestamp': e['timestamp']['$date'],
                'location': e['location'],
                'message': e['message'],
                'image': e['image']['$oid']
            })
        
        return entries