from flask import Flask, request
from werkzeug.datastructures import FileStorage
import json
import pdb

app = Flask(__name__)

@app.route('/')
def main():
    return open('static/test.html', 'r').read()

@app.post('/submit')
def submit():
    location = json.loads(request.form['location'])
    request.files['file'].save(str(location['timestamp']) + '.jpg')
    return {'success': True}


app.run(debug=True)