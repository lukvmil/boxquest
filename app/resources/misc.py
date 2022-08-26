from flask import request
from flask_restful import Resource, abort
import json
from datetime import datetime
from app.models import BoxModel, EntryModel, EmailModel
from mongoengine.errors import ValidationError

class ViewInfo(Resource):
    def get(self):
        num_active_boxes = len(BoxModel.objects(active=True))
        num_entries = len(EntryModel.objects())

        return {
            'active_quests': num_active_boxes,
            'entries': num_entries
        }

class PublicBoxes(Resource):
    # top 5 python one liner below
    def get(self): return [{'id': box.id, 'active': box.active, 'public': box.public, 'quest': box.quest, 'guide': box.guide, 'entry_count': len(box.entries)} for box in sorted(list(BoxModel.objects(active=True, public=True)), key=lambda b: b.entries[-1].timestamp if b.entries else datetime.min, reverse=True)]


class SubmitEmail(Resource):
    def post(self):
        email = request.form['email']
        email_response = EmailModel(email=email)
        try:
            email_response.save()
        except ValidationError:
            abort(400, success=False)

        return {'success': True}