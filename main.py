from flask import Flask, request, render_template, url_for, jsonify
import requests
import xmltodict, json
from collections import OrderedDict
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from random import randint
import re
import pickle

############################################### CONFIG ###############################################

app = Flask(__name__)
# CORS(app)

KEYS = ["1be2eb6f066a3890a06795c7e26af9ff", "c2a05d472f97d739f609febc55da71d8", "9888eab3ea2196c55f9408a2454e911b", "b7b4a651e7cbdd0e043020347099bba5", "e4d1df811c89a97cace751f38fdc3aa9", "a7073f1b6d5b25609c24c882ad879441"]

def getKey():
    key = KEYS[randint(0, len(KEYS)-1)]
    print(key)
    return key

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

############################################### ROUTES ###############################################

@app.route('/')
def root():
  return app.send_static_file('index.html')

@app.route('/<path:path>')
def static_proxy(path):
  # send_static_file will guess the correct MIME type
  return app.send_static_file(path)

congressmenByState = pickle.load( open( "./python-helpers/scrape/state/propublica/congressmenbystate.p", "rb" ) )

@app.route("/state/<state>")
def getLegislators(state):
    state = state.upper()
    # url = "http://www.opensecrets.org/api/?method=getLegislators&id=" + state + "&apikey=" + getKey() + "&output=json"
    # r = requests.get(url)

    # o = xmltodict.parse(r.text)['response']['legislator']
    # return json.dumps(o) # '{"e": {"a": ["text", "text"]}}'
    # return r.text
    return jsonify(congressmenByState[state])

dataByCongressmen = pickle.load( open("./python-helpers/scrape/congressmen/congressmen.p", "rb") )

@app.route("/congressman/<bid>")
def funding(bid):
    # url = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2018&apikey=" + getKey()+ "&output=json"
    # r = requests.get(url)
    # return r.text
    return jsonify(dataByCongressmen[bid])

@app.route("/views/<name>")
def candidViews(name):
    name = name.replace('-',' ')
    response = get_politician_views(name)
    return response

@app.route("/id/<cid>")
def getLegislatorFromId(cid):
    url = "http://www.opensecrets.org/api/?method=getLegislators&id=" + cid + "&apikey=" + getKey() + "&output=json"
    r = requests.get(url)

    # o = xmltodict.parse(r.text)['response']['legislator']
    # return json.dumps(o) # '{"e": {"a": ["text", "text"]}}'
    return r.text

@app.route("/bills/<bid>")
def bigbills(bid):
    headers = {
    'X-API-Key': 'WmcCMKjGFtJmQyQuEvkVxvV666hs75JFky5bJqJG',
    }
    response = requests.get('https://api.propublica.org/congress/v1/members/'+bid+'/bills/introduced.json', headers=headers)
    return response.text

################################################# CANDIDATE VIEW FUNCTIONS ##############################################################
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
    else:
        return json.dumps([{'issueName': 'No relevant views', 'issueViews': []}])


################################################# CANDIDATE FUNDING #############################################################

#function to get the candidate funding accross four years
'''
@app.route("/contrib/<cid>")
def candidContrib(cid):
#get our url data across the four seperate years
    url2012 = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2012&apikey=" + getKey()+ "&output=xml"
    url2014 = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2014&apikey=" + getKey()+ "&output=xml"
    url2016 = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2016&apikey=" + getKey()+ "&output=xml"
    url2018 = "https://www.opensecrets.org/api/?method=candContrib&cid=" + cid + "&cycle=2018&apikey=" + getKey()+ "&output=xml"
#get our url requests
    funding = dict()
    r1 = requests.get(url2012)
    if r1.status_code != 404:


        r2 = requests.get(url2014)
        r3 = requests.get(url2016)
        r4 = requests.get(url2018)

        o1 = xmltodict.parse(r1.text)['response']
        o2 = xmltodict.parse(r2.text)['response']
        o3 = xmltodict.parse(r3.text)['response']
        o4 = xmltodict.parse(r4.text)['response']

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
        funding = dict()
        length = len(o4['contributors'])
        for x in range(0, length):
            funding[str(o1['contributors']['contributor'][x]['@org_name'])] = int(o1['contributors']['contributor'][x]['@total'])

        answer = json.dumps(funding)
        return answer           

    r2 = requests.get(url2014)
    if r2.status_code != 404:
        r3 = requests.get(url2016)
        r4 = requests.get(url2018)

        o2 = xmltodict.parse(r2.text)['response']
        o3 = xmltodict.parse(r3.text)['response']
        o4 = xmltodict.parse(r4.text)['response']

        length2 = len(o2['contributors'])
        for x in range(0, length2):
            funding[str(o2['contributors']['contributor'][x]['@org_name'])] = int(o2['contributors']["contributor"][x]['@total'])
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
        funding = dict()
        length = len(o4['contributors'])
        for x in range(0, length):
            funding[str(o4['contributors']['contributor'][x]['@org_name'])] = int(o4['contributors']['contributor'][x]['@total'])

        answer = json.dumps(funding)
        return answer       
        
    r3 = requests.get(url2016)
    if r3.status_code != 404:
        r4 = requests.get(url2018)

        o3 = xmltodict.parse(r3.text)['response']
        o4 = xmltodict.parse(r4.text)['response']

        length3 = len(o3['contributors'])
        for x in range(0, length3):
            funding[str(o3['contributors']['contributor'][x]['@org_name'])] = int(o3['contributors']["contributor"][x]['@total'])
        length4 = len(o4['contributors'])
        for x in range(0, length3):
            if o4['contributors']["contributor"][x]['@org_name'] in funding.keys():
                funding[str(o4['contributors']['contributor'][x]['@org_name'])] = funding.get(o4['contributors']["contributor"][x]['@org_name']) + int(o4['contributors']['contributor'][x]['@total'])
            else:
                funding[str(o4['contributors']['contributor'][x]['@org_name'])] = int(o4['contributors']['contributor'][x]['@total'])
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
        funding = dict()
        length = len(o4['contributors'])
        for x in range(0, length):
            funding[str(o4['contributors']['contributor'][x]['@org_name'])] = int(o4['contributors']['contributor'][x]['@total'])

        answer = json.dumps(funding)
        return answer       
    r4 = requests.get(url2018)
    if r4.status_code != 404:
        o4 = xmltodict.parse(r4.text)['response']

        length4 = len(o4['contributors'])
        for x in range(0, length3):
            funding[str(o4['contributors']['contributor'][x]['@org_name'])] = int(o4['contributors']["contributor"][x]['@total'])
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
        funding = dict()
        length = len(o4['contributors'])
        for x in range(0, length):
            funding[str(o4['contributors']['contributor'][x]['@org_name'])] = int(o4['contributors']['contributor'][x]['@total'])

        answer = json.dumps(funding)
        return answer   
    else:
        return 'error'

'''
# #Create our dictionaries by parsing the xml
#   o1 = xmltodict.parse(r1.text)['response']
#   o2 = xmltodict.parse(r2.text)['response']
#   o3 = xmltodict.parse(r3.text)['response']
#   o4 = xmltodict.parse(r4.text)['response']

#   # o1 = json.dumps(o1)


    
#   length = len(o1['contributors'])
#   for x in range(0, length):
#       funding[str(o1['contributors']['contributor'][x]['@org_name'])] = int(o1['contributors']['contributor'][x]['@total'])
#   length2 = len(o2['contributors'])

#   for x in range(0, length2):
#       if o2['contributors']["contributor"][x]['@org_name'] in funding.keys():
#           funding[str(o2['contributors']['contributor'][x]['@org_name'])] = funding.get(o2['contributors']["contributor"][x]['@org_name']) + int(o2['contributors']['contributor'][x]['@total'])
#       else:
#           funding[str(o2['contributors']['contributor'][x]['@org_name'])] = int(o1['contributors']['contributor'][x]['@total'])
#   length3 = len(o3['contributors'])
#   for x in range(0, length3):
#       if o3['contributors']["contributor"][x]['@org_name'] in funding.keys():
#           funding[str(o3['contributors']['contributor'][x]['@org_name'])] = funding.get(o3['contributors']["contributor"][x]['@org_name']) + int(o3['contributors']['contributor'][x]['@total'])
#       else:
#           funding[str(o3['contributors']['contributor'][x]['@org_name'])] = int(o3['contributors']['contributor'][x]['@total'])
#   length4 = len(o4['contributors'])
#   for x in range(0, length3):
#       if o4['contributors']["contributor"][x]['@org_name'] in funding.keys():
#           funding[str(o4['contributors']['contributor'][x]['@org_name'])] = funding.get(o4['contributors']["contributor"][x]['@org_name']) + int(o4['contributors']['contributor'][x]['@total'])
#       else:
#           funding[str(o4['contributors']['contributor'][x]['@org_name'])] = int(o4['contributors']['contributor'][x]['@total'])
    
#   #funding = sorted(funding.values())
#   ans = dict()
#   for x in range(0, 5):
#       max = 0
#       for key in funding:
#           if funding[key] > max:
#               max = funding[key]
#               check = key
#       ans[check] = max
#       del funding[check]
#   link = dict()
#   for key in ans:
#       link["https://en.wikipedia.org/wiki/"+key] = ans[key]   
#   funding = dict()
#   length = len(o4['contributors'])
#   for x in range(0, length):
#       funding[str(o1['contributors']['contributor'][x]['@org_name'])] = int(o1['contributors']['contributor'][x]['@total'])

#   answer = json.dumps(funding)
#   return answer