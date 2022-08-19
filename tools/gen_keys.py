import secrets
import json
import sys

keys = []
count = int(sys.argv[1])

for i in range(count):
    k = secrets.token_urlsafe(24)
    keys.append(k)

with open('keys.json', 'w') as f:
    json.dump(keys, f, indent=4)