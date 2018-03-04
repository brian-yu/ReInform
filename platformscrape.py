from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import re
import json

def get_politician_html(name):
    name = name.replace(" ", "_")
    return simple_get("http://www.ontheissues.org/" + name + ".htm")

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

def get_views(name):
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
        print(json_data)

#get_views('Mark Warner')
