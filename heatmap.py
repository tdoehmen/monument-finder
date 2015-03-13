from flask import Flask, render_template, url_for, request, jsonify
from SPARQLWrapper import SPARQLWrapper, RDF, JSON
import requests
import json
import time
import sys
import codecs
sys.stdout = codecs.getwriter('utf8')(sys.stdout)
sys.stderr = codecs.getwriter('utf8')(sys.stderr)

app = Flask(__name__)


@app.route('/')
def first_page():
    app.logger.debug('You arrived at ' + url_for('first_page'))
    return render_template('index.html')

@app.route('/query_flickr',methods=['GET'])
def query_flickr():
    # Get the message from the GET request, if nothing is found, set a default message.
    location = request.args.get('location', '')
    monument = request.args.get('monument', '')
    print(location)
    print(monument)
    
    r = requests.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=19e4b91e258067acc16b6d4425edc417&text='+str(monument)+'&woe_id='+str(location)+'&has_geo=1&extras=geo&per_page=500&page=1&format=json&nojsoncallback=1')
    pages = r.json()['photos']['pages']
    print(pages);
    
    super_photodict = []
    for page in range(1, 15):
        r = requests.get('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=19e4b91e258067acc16b6d4425edc417&text='+str(monument)+'&woe_id='+str(location)+'&has_geo=1&extras=geo&per_page=500&page='+str(page)+'&format=json&nojsoncallback=1')
        photodict = r.json()['photos']['photo']
        super_photodict += photodict

    return json.dumps(super_photodict)
    
if __name__ == '__main__':
    app.debug = True
    app.run()
