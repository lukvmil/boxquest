from mongoengine import Document
from mongoengine.fields import *

class EmailModel(Document):
    email = EmailField()