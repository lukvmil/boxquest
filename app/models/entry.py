from mongoengine import Document
from mongoengine.fields import *

class EntryModel(Document):
    timestamp    = DateTimeField()
    location     = GeoPointField()
    location_str = StringField()
    message      = StringField()
    image        = ImageField()