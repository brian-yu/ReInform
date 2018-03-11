import requests
import json
# from google.cloud import datastore
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
    # "DC": "District Of Columbia",
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

print(len(states))




def test():
    import pprint
    pp = pprint.PrettyPrinter(indent=4)
    r = requests.get("https://www.opensecrets.org/api/?method=getLegislators&id=va&apikey=1be2eb6f066a3890a06795c7e26af9ff&output=json")
    cmen = json.loads(r.text)['response']['legislator']
    # print(legislators)
    congressmen = {}
    for cman in cmen:
        congressmen[cman['@attributes']['bioguide_id']] = cman['@attributes']
    pp.pprint(congressmen)


# test()
data = {}

noid = 1

for abbrev in states:
    state = states[abbrev]
    print(state)
    r = requests.get("https://www.opensecrets.org/api/?method=getLegislators&id=" + abbrev + "&apikey=" + getKey() + "&output=json")
    cmen = json.loads(r.text)['response']['legislator']
    congressmen = {}
    for cman in cmen:
        print("\t" + cman['@attributes']['firstlast'])
        if cman['@attributes']['bioguide_id'] == "":
            bid = noid
            noid += 1
            print(cman['@attributes'])
        else:
            bid = cman['@attributes']['bioguide_id']
        congressmen[bid] = cman['@attributes']
    data[state] = congressmen

pickle.dump( data, open( "congressmenbystate.p", "wb" ) )
