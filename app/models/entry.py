from mongoengine import Document
from mongoengine.fields import (
    IntField,
    StringField,
    DateTimeField,
    GeoPointField,
    ImageField
)

class EntryModel(Document):
    timestamp   = DateTimeField()
    location    = GeoPointField()
    message     = StringField()
    image       = ImageField()