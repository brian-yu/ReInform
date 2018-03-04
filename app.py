from flask import Flask, request, render_template, url_for
# from flask_cors import CORS
import requests
import xmltodict, json
from collections import OrderedDict
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re

app = Flask(__name__)
# CORS(app)


OPEN_SECRETS_KEY = "d1fd1a1f1860a50a0f4e67c04b4f2db1";

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0


@app.route("/state/<state>")
def getLegislators(state):
	url = "http://www.opensecrets.org/api/?method=getLegislators&id=" + state + "&apikey=" + OPEN_SECRETS_KEY + "&output=json"
	r = requests.get(url)

	# o = xmltodict.parse(r.text)['response']['legislator']
	# return json.dumps(o) # '{"e": {"a": ["text", "text"]}}'
	return r.text

#function to get the candidate funding accross four years
@app.route("/contrib/<cid>")
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
	link = dict()
	for key in ans:
		link["https://en.wikipedia.org/wiki/"+key] = ans[key]	
	answer = json.dumps(link)
	return answer

#function to get the candidate funding accross four years
@app.route("/views/<name>")
def candidViews(name):
    name = name.replace('-',' ')
    response = get_politician_views(name)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'POST')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response


@app.route("/id/<cid>")
def getLegislatorFromId(cid):
	url = "http://www.opensecrets.org/api/?method=getLegislators&id=" + cid + "&apikey=" + OPEN_SECRETS_KEY + "&output=json"
	r = requests.get(url)

	# o = xmltodict.parse(r.text)['response']['legislator']
	# return json.dumps(o) # '{"e": {"a": ["text", "text"]}}'
	return r.text


@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)


#################################################CANDIDATE VIEW FUNCTIONS##############################################################
def simple_get(url):
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None

    except RequestException as e:
        log_error('Error during requests to {0} : {1}'.format(url, str(e)))
        return None

def is_good_response(resp):
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200 
            and content_type is not None 
            and content_type.find('html') > -1)

def log_error(e):
    print(e)

def get_politician_html(name):
    name = name.replace(" ", "_")
    return simple_get("http://www.ontheissues.org/" + name + ".htm")

def get_politician_views(name):
    raw_html = get_politician_html(name)
    if raw_html is not None:
        html = BeautifulSoup(raw_html, 'html.parser')
        issueNames = html.findAll("font", {"size" : "5"})
        issueViews = html.findAll("ul")
        preJSON = []
        for i in range(0, len(issueNames)):
            views = str(issueViews[i])
            views = views.replace('<li>','').replace('</li>','').replace('<ul>','').replace('</ul>','').replace('\r','').replace('    ','')
            views = re.sub(r' \([^()]*\)', '', views)
            views = views.split('\n')[1:-1]
            issueElement = {}
            issuePos = issueNames[i].text.find(" on ")+4
            issueElement['issueName'] = issueNames[i].text[issuePos:-1]
            issueElement['views'] = views
            preJSON.append(issueElement)
        json_data = json.dumps(preJSON)
    return json_data