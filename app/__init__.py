from flask import Flask, send_file, request
from flask_restful import Api, abort
from mongoengine import connect
from io import BytesIO
from app.resources.box import ViewBox
from app.resources.entry import CreateEntry, ViewEntry
from app.models import BoxModel

connect('boxquest')

main = Flask('BoxQuest')
api  = Api(main)

@main.route('/img/<int:bid>-<int:eid>.jpg')
def get_image(bid, eid):
    image_binary = EntryModel.objects(id=bid).first().image.read()

    return send_file(
        BytesIO(image_binary),
        mimetype='image/jpeg'
    )

@main.route('/get_id')
def get_id():
    if 'key' not in request.args: abort(400)

    return {
        'pub_id': BoxModel.objects(key=request.args.get('key')).first().pub_id.hex
    }


api.add_resource(ViewBox, '/box/<box_id>')
api.add_resource(CreateEntry, '/box/<box_id>/entry', '/box/<box_id>/entry/')
api.add_resource(ViewEntry, '/box/<box_id>/entry/<entry_id>')
api.add_resource()