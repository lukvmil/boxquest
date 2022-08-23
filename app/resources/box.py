from flask import request
from flask_restful import Resource, abort
import json
from app.models import BoxModel

class InteractBox(Resource):
    def get(self, box_id):
        box = BoxModel.objects(pub_id=box_id).first()
        if not box: abort(404, message='Box not found.')

        if box.active:
            return {
                'id': box.id,
                'active': box.active,
                'public': box.public,
                'quest': box.quest,
                'guide': box.guide
            }
        else:
            return {
                'id': box.id,
                'active': False
            }
    
    def post(self, box_id):
        public = True if request.form['public'] == 'true' else False
        quest = request.form['quest']
        guide = request.form['guide']
        box_key = request.form['box_key']

        box = BoxModel.objects(pub_id=box_id).first()
        if not box: abort(404, message='Box not found.')
        if box.key != box_key: abort(403, message='Invalid key.')
        if box.active: abort(409, message='Box has already been activated.')

        box.public = public
        box.quest = quest
        box.guide = guide
        box.active = True

        box.save()

        return {'success': True}