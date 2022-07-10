from mongoengine import Document
from mongoengine.fields import (
    IntField,
    ReferenceField,
    ListField
)
from app.models.entry import EntryModel

class BoxModel(Document):
    id = IntField(primary_key=True)
    entries = ListField(ReferenceField(EntryModel))

