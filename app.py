from flask import Flask, request, render_template, url_for
from flask_cors import CORS
import requests
import xmltodict, json

app = Flask(__name__, static_url_path='')
CORS(app)


OPEN_SECRETS_KEY = "40411c191fd58f5709214a9184c9ca1d";

@app.route("/")
def index():
    return app.send_static_file('index.html')

@app.route("/state/<state>")
def getLegislators(state):
	url = "http://www.opensecrets.org/api/?method=getLegislators&id=" + state + "&apikey=" + OPEN_SECRETS_KEY + "&output=json"
	r = requests.get(url)

	# o = xmltodict.parse(r.text)['response']['legislator']
	# return json.dumps(o) # '{"e": {"a": ["text", "text"]}}'
	return r.text

@app.route("/id/<state>")
def candidContrib(cid, cycle):
	url = "https://www.opensecrets.org/api/?method=candContrib&cid" + cid + "cycle=2018&apikey=" + OPEN_SECRETS_KEY+ "&output=json"
	return json.dumps(requests.get(url))
