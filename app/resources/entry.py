from flask import request
from flask_restful import Resource, abort
from datetime import datetime
from io import BytesIO
import json
from app.common import utils
from app.models import EntryModel, BoxModel

class CreateEntry(Resource):
    def post(self, box_id):
        raw_image = request.files['file']
        geoloc = json.loads(request.form['geoloc'])
        message = request.form['message']
        box_key = request.form['box_key']

        box = BoxModel.objects(pub_id=box_id).first()
        if box.key != box_key: return {'success': False}

        location = [geoloc['latitude'], geoloc['longitude']]
        location_str = utils.get_loc_str(location)
        timestamp = datetime.fromtimestamp(int(geoloc['timestamp']) / 1000)
        image = utils.apply_rotation(raw_image)

        entry = EntryModel(timestamp=timestamp, location=location, 
            location_str=location_str, message=message, image=image)

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

        if not box: abort(404, message='Box not found.')

        for e in box.entries:
            if not type(e) is EntryModel: continue
            e = json.loads(e.to_json())
            entries.append({
                'timestamp': e['timestamp']['$date'],
                'location': e['location'],
                'location_str': e['location_str'],
                'message': e['message'],
                'image': e['image']['$oid']
            })
        
        return entries