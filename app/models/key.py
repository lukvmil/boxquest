from mongoengine import Document
from mongoengine.fields import (
    IntField,
    ReferenceField,
)
from app.models.box import BoxModel

class KeyModel(Document):
    _id = IntField(required=True)
    box = ReferenceField(BoxModel)

    def _init__(self, _id):
        self._id = _id