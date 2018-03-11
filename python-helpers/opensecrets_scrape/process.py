import pickle


'''
Congressmen without Bioguide IDs in the open secrets data:
doug jones - AL
jimmy gomez - CA
tina smith - MN
John curtis - UT
'''

data = pickle.load(open("congressmenbystate.p", "rb"))

for state in data:
	for cman in data[state]:
		if cman['bioguide_id'] == "":
			print(data[state][cman])
			bid = input("Please input bioguide id for {}".format(cman['firstlast']))
			cman['bioguide_id'] = bid