import requests
import json
import pickle

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


# GET https://api.propublica.org/congress/v1/members/{member-id}.json

headers = {
	'X-API-Key': 'WmcCMKjGFtJmQyQuEvkVxvV666hs75JFky5bJqJG',
}
# response = requests.get('https://api.propublica.org/congress/v1/members/'+bid+'/bills/introduced.json', headers=headers)


def getState(state):
	h = json.loads(requests.get('https://api.propublica.org/congress/v1/members/house/{}/current.json'.format(state), headers=headers).text)['results']
	s = json.loads(requests.get('https://api.propublica.org/congress/v1/members/senate/{}/current.json'.format(state), headers=headers).text)['results']

	state = {}

	state['house'] = h
	state['senate'] = s

	return state

data = {}

for state in states:
	print(state)
	data[state] = getState(state)

pickle.dump( data, open( "congressmen.p", "wb" ) )
