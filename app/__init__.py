from flask import Flask, send_file, request
from flask_restful import Api, abort
from mongoengine import connect, connection
from gridfs import GridFS, NoFile
import bson
from io import BytesIO
from app.resources import *
from app.models import BoxModel

connect('boxquest')
img_fs = GridFS(connection.get_db(), collection="images")

main = Flask('BoxQuest')
api  = Api(main)

@main.route('/img/<oid_str>')
def get_image(oid_str):
    not_found = {'message': 'Invalid image ID'}

    try: oid = bson.ObjectId(oid_str)
    except bson.errors.InvalidId: return not_found
    if not img_fs.exists(oid): return not_found

    img = img_fs.get(oid)    
    img_bin = img.read()

    return send_file(
        BytesIO(img_bin),
        mimetype='image/jpeg'
    )

@main.route('/get_id')
def get_id():
    if 'key' not in request.args: abort(400, message='Missing query param: key.')
    box = BoxModel.objects(key=request.args.get('key')).first()
    if not box: abort(400, message='Invalid key.')

    return {
        'id': box.id
    }


api.add_resource(InteractBox, '/box/<box_id>')
api.add_resource(CreateEntry, '/box/<box_id>/entry', '/box/<box_id>/entry/')
api.add_resource(ViewEntry, '/box/<box_id>/entry/<int:entry_id>')
api.add_resource(ViewEntries, '/box/<box_id>/entries')
api.add_resource(CreateReport, '/box/<box_id>/report')
api.add_resource(ViewInfo, '/stats')
api.add_resource(PublicBoxes, '/box/public')