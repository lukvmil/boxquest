from flask import request
from flask_restful import Resource, abort
from app.models import ReportModel

class CreateReport(Resource):
    def post(self, box_id):
        print(box_id)
        _type = request.form['type']
        reason = request.form['reason']
        entry_id = request.form.get('entry_id')

        report = ReportModel(type=_type, reason=reason, box_id=box_id, entry_id=entry_id)

        report.save()

        return {'success': True}