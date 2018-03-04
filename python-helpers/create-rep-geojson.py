import json
import random
import csv

houseLES = {}
with open('LEPData111to113Congresses.csv') as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        houseLES[row['first_name'] + ' ' + row['last_name']] = [row['ss_bills'],row['ss_aic'],row['ss_abc'],row['ss_pass'],row['ss_law'],row['s_bills'],row['s_aic'],row['s_abc'],row['s_pass'],row['s_law'],row['c_bills'],row['c_aic'],row['c_abc'],row['c_pass'],row['les']]

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
    full_name = str(data[i]['name']['first'])+ ' ' + str(data[i]['name']['last'])
    if full_name in houseLES:
        file.write(',"ss_bills": "' + str(houseLES[full_name][0]) + '"')
        file.write(',"ss_aic": "' + str(houseLES[full_name][1]) + '"')
        file.write(',"ss_abc": "' + str(houseLES[full_name][2]) + '"')
        file.write(',"ss_pass": "' + str(houseLES[full_name][3]) + '"')
        file.write(',"ss_law": "' + str(houseLES[full_name][4]) + '"')
        file.write(',"s_bills": "' + str(houseLES[full_name][5]) + '"')
        file.write(',"s_aic": "' + str(houseLES[full_name][6]) + '"')
        file.write(',"s_abc": "' + str(houseLES[full_name][7]) + '"')
        file.write(',"s_pass": "' + str(houseLES[full_name][8]) + '"')
        file.write(',"s_law": "' + str(houseLES[full_name][9]) + '"')
        file.write(',"c_bills": "' + str(houseLES[full_name][10]) + '"')
        file.write(',"c_aic": "' + str(houseLES[full_name][11]) + '"')
        file.write(',"c_abc": "' + str(houseLES[full_name][12]) + '"')
        file.write(',"c_pass": "' + str(houseLES[full_name][13]) + '"')
        file.write(',"les": "' + str(houseLES[full_name][14]) + '"')
    else:
        file.write(',"ss_bills": "' + str(-1) + '"')
        file.write(',"ss_aic": "' + str(-1) + '"')
        file.write(',"ss_abc": "' + str(-1) + '"')
        file.write(',"ss_pass": "' + str(-1) + '"')
        file.write(',"ss_law": "' + str(-1) + '"')
        file.write(',"s_bills": "' + str(-1) + '"')
        file.write(',"s_aic": "' + str(-1) + '"')
        file.write(',"s_abc": "' + str(-1) + '"')
        file.write(',"s_pass": "' + str(-1) + '"')
        file.write(',"s_law": "' + str(-1) + '"')
        file.write(',"c_bills": "' + str(-1) + '"')
        file.write(',"c_aic": "' + str(-1) + '"')
        file.write(',"c_abc": "' + str(-1) + '"')
        file.write(',"c_pass": "' + str(-1) + '"')
        file.write(',"les": "' + str(-1) + '"')
    file.write(',"state": "' + str(data[i]['terms'][-1]['state']) + '"')
    file.write(',"party": "' + str(data[i]['terms'][-1]['party']) + '"')
    if data[i]['terms'][-1]['party'][0] == "D":
        file.write(',"color": "#007bff"')
    else:
        file.write(',"color": "#E74C3C"')
    file.write(',"phone": "' + str(data[i]['terms'][-1]['phone']) + '"')
    file.write("} }")
    if(i<len(data)-1):
        file.write(',')
file.write(']}')
file.close() 