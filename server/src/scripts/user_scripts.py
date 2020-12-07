import requests
import json

from constants import (
    BASE_URL,
    EMAIL,
    PASSWORD
)

class User:
    @staticmethod
    def login_user():
        response = requests.post(BASE_URL+'/user/login', json.dumps({
            "email": EMAIL,
	        "password": PASSWORD
        }), headers={
            'Content-Type': 'application/json'
        })


        parsed_data = (json.loads(response.text))
        if 'data' in parsed_data:
            return parsed_data['data']
        else:
            return '404'
