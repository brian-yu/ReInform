import pickle


'''
Congressmen without Bioguide IDs in the open secrets data:
doug jones - AL
jimmy gomez - CA
tina smith - MN
John curtis - UT
'''


data = pickle.load(open("congressmenbystate.p", "wb"))

for state in data:
	for cman in data[state]:
		if cman == "":
			print(data[state][cman])