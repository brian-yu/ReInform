from flask import Flask, request, render_template, url_for, jsonify, send_from_directory
import requests, os, xmltodict, json, re, pickle
from collections import OrderedDict
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
from random import randint

############################################### CONFIG ###############################################

# app = Flask(__name__)
app = Flask(__name__, static_folder='app/build/')


KEYS = ["1be2eb6f066a3890a06795c7e26af9ff", "c2a05d472f97d739f609febc55da71d8", "9888eab3ea2196c55f9408a2454e911b", "b7b4a651e7cbdd0e043020347099bba5", "e4d1df811c89a97cace751f38fdc3aa9", "a7073f1b6d5b25609c24c882ad879441"]

def getKey():
    key = KEYS[randint(0, len(KEYS)-1)]
    print(key)
    return key

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

############################################### ROUTES ###############################################

congressmenByState = pickle.load( open( "./python-helpers/scrape/state/propublica/congressmenbystate.p", "rb" ) )

@app.route("/api/state/<state>")
def getLegislators(state):
    state = state.upper()
    return jsonify(congressmenByState[state])

dataByCongressmen = pickle.load( open("./python-helpers/scrape/congressmen/congressmen.p", "rb") )

@app.route("/api/congressman/<bid>")
def congressman(bid):
    return jsonify(dataByCongressmen[bid])

@app.route("/api/views/<name>")
def candidViews(name):
    name = name.replace('-',' ')
    response = get_politician_views(name)
    return response

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


# @app.route('/')
# def root():
#   return app.send_static_file('./app/build/index.html')

# @app.route('/<path:path>')
# def static_proxy(path):
#   # send_static_file will guess the correct MIME type
#   return app.send_static_file(path)

# Serve React App

# @app.route('/favicon.ico')
# def favicon():
#     return send_from_directory('app/build/favicon.ico')

# @app.route('/<path:path>')
# def serve(path):
#     return send_from_directory('app/build', path)

# @app.route('/')
# def index():
#     return send_from_directory('app/build', 'index.html')

@app.route('/', methods=['GET'])
def index():
    return app.send_static_file('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return app.send_static_file(path)