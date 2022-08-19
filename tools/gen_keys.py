import secrets
import json

keys = []
count = 100

for i in range(count):
    k = secrets.token_urlsafe(24)
    keys.append(k)

with open('keys.json', 'w') as f:
    json.dump(keys, f, indent=4)