from mongoengine import Document
from mongoengine.fields import (
    UUIDField,
    StringField,
    ReferenceField,
    ListField
)
from app.models.entry import EntryModel

class BoxModel(Document):
    pub_id  = StringField(primary_key=True)
    key     = StringField()
    entries = ListField(ReferenceField(EntryModel))

