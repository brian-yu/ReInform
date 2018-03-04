import json
import random

data = json.load(open('legislators-current.json'))
file = open("../static/legislators.geojson","w") 

file.write('{ "type": "FeatureCollection", "features": [' )

for i in range(0, len(data)):
    if data[i]['terms'][-1]['state'] == 'GU':
        continue
    if data[i]['terms'][-1]['state'] == 'MP':
        continue
    if data[i]['terms'][-1]['state'] == 'VI':
        continue
    if data[i]['terms'][-1]['state'] == 'AS':
        continue
    if data[i]['terms'][-1]['state'] == 'PR':
        continue
    file.write('{"type": "Feature", "geometry": { "type": "Point", "coordinates": [')
    if data[i]['terms'][-1]['type'] == "rep":
        count = 0
        latSum = 0
        longSum = 0
        if data[i]['terms'][-1]['state'] == 'DC':
            districtJSON = json.load(open('states\\'+ data[i]['terms'][-1]['state'] + '\\shape.geojson'))
            for j in range(0, len(districtJSON['coordinates'][0])):
                for k in range(0,len(districtJSON['coordinates'][0][j])):
                    longSum += districtJSON['coordinates'][0][j][k][0]
                    latSum += districtJSON['coordinates'][0][j][k][1]
                    count +=1
        else:
            districtJSON = json.load(open('cds\\'+ data[i]['terms'][-1]['state'] + '-' + str(data[i]['terms'][-1]['district']) + '\\shape.geojson'))
            for j in range(0, len(districtJSON['geometry']['coordinates'][0])):
                for k in range(0,len(districtJSON['geometry']['coordinates'][0][j])):
                    longSum += districtJSON['geometry']['coordinates'][0][j][k][0]
                    latSum += districtJSON['geometry']['coordinates'][0][j][k][1]
                    count +=1
        longAvg = longSum/count
        latAvg = latSum/count
        file.write(str(longAvg) + ',' + str(latAvg) +']},')
    else:
        stateJSON = json.load(open('states\\'+ data[i]['terms'][-1]['state'] + '\\shape.geojson'))
        count = 0
        latSum = 0
        longSum = 0
        for j in range(0, len(stateJSON['coordinates'][0])):
            scalar = random.randint(1, 10)
            for k in range(0,len(stateJSON['coordinates'][0][j])):
                #print(str(stateJSON['coordinates'][0][j][k][0]))
                longSum += stateJSON['coordinates'][0][j][k][0]*scalar
                latSum += stateJSON['coordinates'][0][j][k][1]*scalar
                count += (1*scalar)
        longAvg = longSum/count
        latAvg = latSum/count
        file.write(str(longAvg) + ',' + str(latAvg) +']},')
    file.write('"properties":{')
    file.write('"bioguide_id": "' + str(data[i]['id']['bioguide']) + '"')
    file.write(',"opensecrets_id": "' + str(data[i]['id']['opensecrets']) + '"')
    #file.write(',"fec_id": ' + str(data[i]['id']['fec']))
    file.write(',"first_name": "' + str(data[i]['name']['first']) + '"')
    file.write(',"last_name": "' + str(data[i]['name']['last']) + '"')
    file.write(',"state": "' + str(data[i]['terms'][-1]['state']) + '"')
    file.write(',"party": "' + str(data[i]['terms'][-1]['party']) + '"')
    if data[i]['terms'][-1]['party'][0] == "D":
        file.write(',"color": "#93B0D8"')
    else:
        file.write(',"color": "#E74C3C"')
    file.write(',"phone": "' + str(data[i]['terms'][-1]['phone']) + '"')
    file.write("} }")
    if(i<len(data)-1):
        file.write(',')
file.write(']}')
file.close() 