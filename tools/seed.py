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
    return box, pub_id_hex

count = 0
for i, k in enumerate(keys):
    box, hex_id = create_box(k)
    print(f'{round(i/len(keys) * 100, 1)}% {box.key} -> {hex_id} -> {box.pub_id}')
    

