import requests
import json
import pickle
from random import randint

KEYS = ["1be2eb6f066a3890a06795c7e26af9ff", "c2a05d472f97d739f609febc55da71d8", "9888eab3ea2196c55f9408a2454e911b", "b7b4a651e7cbdd0e043020347099bba5", "e4d1df811c89a97cace751f38fdc3aa9", "a7073f1b6d5b25609c24c882ad879441"]

def getKey():
    key = KEYS[randint(0, len(KEYS)-1)]
    print(key)
    return key

states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "FL": "Florida",
    "GA": "Georgia",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PA": "Pennsylvania",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}


cmenbystate = pickle.load(open("../state/propublica/congressmenbystate.p", "rb"))

cmen_ids = []
for state in cmenbystate:
    for sen in cmenbystate[state]['senate']:
        # print(sen)
        cmen_ids.append(sen['id'])
    for rep in cmenbystate[state]['house']:
        cmen_ids.append(rep['id'])

# GET https://api.propublica.org/congress/v1/members/{member-id}.json
# GET https://api.propublica.org/congress/v1/members/{member-id}/bills/{type}.json

headers = {
    'X-API-Key': 'WmcCMKjGFtJmQyQuEvkVxvV666hs75JFky5bJqJG',
}

import pprint
pp = pprint.PrettyPrinter(indent=2)

# print(cmen_ids[383])
# pp.pprint(json.loads(requests.get('https://api.propublica.org/congress/v1/members/{}.json'.format(cmen_ids[383]), headers=headers).text)['results'][0])

def getCman(id):
    info = json.loads(requests.get('https://api.propublica.org/congress/v1/members/{}.json'.format(id), headers=headers).text)['results'][0]
    bills = json.loads(requests.get('https://api.propublica.org/congress/v1/members/{}/bills/introduced.json'.format(id), headers=headers).text)['results'][0]['bills']

    funding2018Req = requests.get("https://www.opensecrets.org/api/?method=candContrib&cid={}&cycle=2018&apikey={}&output=json".format(info['crp_id'], getKey()))

    if funding2018Req.status_code == 200:
        funding2018 = json.loads(funding2018Req.text)['response']['contributors']['contributor']
        funding2018 = [i['@attributes'] for i in funding2018]
    else:
        funding2018 = []

    # import pprint
    # pp = pprint.PrettyPrinter()

    info['bills'] = bills
    info['funding2018'] = funding2018

    # pp.pprint(info)

    return info

data = {}

num = 0
for cman_id in cmen_ids:
    print(num)
    data[cman_id] = getCman(cman_id)
    num += 1

pickle.dump( data, open( "congressmen.p", "wb" ) )
