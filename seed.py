from secrets import token_hex
from app.models import BoxModel
from base58 import b58encode
import json

with open('keys.json', 'r') as f:
    keys = json.load(f)

def create_box(key):
    pub_id_hex = token_hex(8)
    pub_id = b58encode(bytes.fromhex(pub_id_hex))
    box = BoxModel(
        pub_id=pub_id,
        key=key
    )
    box.save()
    print(f'{box.key} -> {box.pub_id}')

for k in keys:
    # print(k)
    create_box(k)