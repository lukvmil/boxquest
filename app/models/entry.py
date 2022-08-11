from mongoengine import Document
from mongoengine.fields import (
    IntField,
    StringField,
    DateTimeField,
    GeoPointField,
    ImageField
)

class EntryModel(Document):
    timestamp    = DateTimeField()
    location     = GeoPointField()
    location_str = StringField()
    message      = StringField()
    image        = ImageField()