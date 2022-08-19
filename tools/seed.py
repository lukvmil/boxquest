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
    return box

count = 0
for i, k in enumerate(keys):
    box = create_box(k)
    if len(keys) < 1000:
        print(f'{box.key} -> {box.pub_id}')
    else:
        if (i % (len(keys) // 100) == 0):
            print(str(count) + "% " + str(i) + "/" + str(len(keys)))
            count += 1

