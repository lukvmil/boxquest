from flask import request
from flask_restful import Resource, abort
import json
from app.models import BoxModel, EntryModel

class ViewInfo(Resource):
    def get(self):
        num_active_boxes = len(BoxModel.objects(active=True))
        num_entries = len(EntryModel.objects())

        return {
            'active_quests': num_active_boxes,
            'entries': num_entries
        }

class PublicBoxes(Resource):
    def get(self):
        public_boxes = BoxModel.objects(active=True, public=True)
        return [box.id for box in public_boxes]

