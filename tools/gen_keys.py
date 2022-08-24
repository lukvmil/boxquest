import secrets
import json
import sys
from os.path import exists

keys = []
count = int(sys.argv[1])

if exists('keys.json'):
    print('A key file has already been generated, are you sure you want to overwrite it?')
    if input('> ') == 'y':
        for i in range(count):
            k = secrets.token_urlsafe(24)
            keys.append(k)

        with open('keys.json', 'w') as f:
            json.dump(keys, f, indent=4)
    
    else:
        print("Failed, exiting")