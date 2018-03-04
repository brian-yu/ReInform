import requests
import json

headers = {
    'X-API-Key': 'AAajU9CjQMKlHK1jl5Gie9Svi3AI3lXhOOoBaURL',
}

response = requests.get('https://api.propublica.org/congress/v1/115/house/members.json', headers=headers)

file = open("../static/house-propublica.geojson","w") 
file.write(response.text)