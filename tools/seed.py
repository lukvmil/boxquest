from secrets import token_hex
from app.models import BoxModel
import json
import random
import base64

base58_chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

with open('keys.json', 'r') as f:
    keys = json.load(f)

def create_box(key):
    key_bytes = base64.urlsafe_b64decode(key)
    key_int = int.from_bytes(key_bytes, 'little')
    random.seed(key_int)
    pub_id = ''.join(random.choices(base58_chars, k=8))
    box = BoxModel(
        pub_id=pub_id,
        key=key
    )
    # box.save()
    return box

count = 0
for i, k in enumerate(keys):
    box = create_box(k)
    print(f'{round(i/len(keys) * 100, 1)}% {box.key} -> {box.pub_id}')
    

