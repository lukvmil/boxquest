from mongoengine import Document
from mongoengine.fields import *
from app.models.entry import EntryModel

class BoxModel(Document):
    pub_id  = StringField(primary_key=True)
    key     = StringField()
    active  = BooleanField(default=False)
    public  = BooleanField()
    quest   = StringField()
    guide   = StringField()
    entries = ListField(ReferenceField(EntryModel))

