from mongoengine import Document
from mongoengine.fields import *

class ReportModel(Document):
    type     = StringField()
    box_id   = StringField()
    entry_id = StringField()
    reason   = StringField()