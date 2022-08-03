from flask_restful import Resource
from app.models import BoxModel

class ViewBox(Resource):
    def get(self, box_id):
        box = BoxModel.objects(pub_id=box_id).first()
        if not box: return 404

        

        return "here is some text"