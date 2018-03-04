from flask import Flask, request, render_template, url_for
# from flask_cors import CORS
import requests
import xmltodict, json
from collections import OrderedDict

app = Flask(__name__)
# CORS(app)


OPEN_SECRETS_KEY = "40411c191fd58f5709214a9184c9ca1d";

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route("/state/<state>")
def getLegislators(state):
	url = "http://www.opensecrets.org/api/?method=getLegislators&id=" + state + "&apikey=" + OPEN_SECRETS_KEY + "&output=json"
	r = requests.get(url)

	# o = xmltodict.parse(r.text)['response']['legislator']
	# return json.dumps(o) # '{"e": {"a": ["text", "text"]}}'
	return r.text

#function to get the candidate funding accross four years
@app.route("/id/<cid>")
def candidContrib(cid):
#get our url data across the four seperate years
	url2012 = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2012&apikey=" + OPEN_SECRETS_KEY+ "&output=xml"
	url2014 = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2014&apikey=" + OPEN_SECRETS_KEY+ "&output=xml"
	url2016 = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2016&apikey=" + OPEN_SECRETS_KEY+ "&output=xml"
	url2018 = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2018&apikey=" + OPEN_SECRETS_KEY+ "&output=xml"
#get our url requests
	r1 = requests.get(url2012)
	r2 = requests.get(url2014)
	r3 = requests.get(url2016)
	r4 = requests.get(url2018)

#Create our dictionaries by parsing the xml
	o1 = xmltodict.parse(r1.text)['response']
	o2 = xmltodict.parse(r2.text)['response']
	o3 = xmltodict.parse(r3.text)['response']
	o4 = xmltodict.parse(r4.text)['response']

	# o1 = json.dumps(o1)


	import pprint

	pp = pprint.PrettyPrinter(indent=4)

	funding = dict()
	length = len(o1['contributors'])
	for x in range(0, length):
		funding[str(o1['contributors']['contributor'][x]['@org_name'])] = int(o1['contributors']['contributor'][x]['@total'])
	length2 = len(o2['contributors'])

	for x in range(0, length2):
		if o2['contributors']["contributor"][x]['@org_name'] in funding.keys():
			funding[str(o2['contributors']['contributor'][x]['@org_name'])] = funding.get(o2['contributors']["contributor"][x]['@org_name']) + int(o2['contributors']['contributor'][x]['@total'])
		else:
			funding[str(o2['contributors']['contributor'][x]['@org_name'])] = int(o1['contributors']['contributor'][x]['@total'])
	length3 = len(o3['contributors'])
	for x in range(0, length3):
		if o3['contributors']["contributor"][x]['@org_name'] in funding.keys():
			funding[str(o3['contributors']['contributor'][x]['@org_name'])] = funding.get(o3['contributors']["contributor"][x]['@org_name']) + int(o3['contributors']['contributor'][x]['@total'])
		else:
			funding[str(o3['contributors']['contributor'][x]['@org_name'])] = int(o3['contributors']['contributor'][x]['@total'])
	length4 = len(o4['contributors'])
	for x in range(0, length3):
		if o4['contributors']["contributor"][x]['@org_name'] in funding.keys():
			funding[str(o4['contributors']['contributor'][x]['@org_name'])] = funding.get(o4['contributors']["contributor"][x]['@org_name']) + int(o4['contributors']['contributor'][x]['@total'])
		else:
			funding[str(o4['contributors']['contributor'][x]['@org_name'])] = int(o4['contributors']['contributor'][x]['@total'])
	
	#funding = sorted(funding.values())
	ans = dict()
	for x in range(0, 5):
		max = 0
		for key in funding:
			if funding[key] > max:
				max = funding[key]
				check = key
		ans[check] = max
		del funding[check]
		
	answer = json.dumps(ans)
	return answer


@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)