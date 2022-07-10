from flask import Flask
from flask_restful import Api
from app.resources.box import ViewBox
from app.resources.entry import CreateEntry, ViewEntry

main = Flask('BoxQuest')
api  = Api(main)

api.add_resource(ViewBox, '/box/<box_id>')
api.add_resource(CreateEntry, '/box/<box_id>/entry', '/box/<box_id>/entry/')
api.add_resource(ViewEntry, '/box/<box_id>/entry/<entry_id>')