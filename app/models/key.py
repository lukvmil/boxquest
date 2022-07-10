from mongoengine import Document
from mongoengine.fields import (
    IntField,
    ReferenceField,
)
from app.models.box import BoxModel

class KeyModel(Document):
    id = IntField(primary_key=True)
    box = ReferenceField(BoxModel)