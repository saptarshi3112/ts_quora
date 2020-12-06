import requests
import json

from constants import BASE_URL

class User:
    @staticmethod
    def login_user(email, password):
        response = requests.post(BASE_URL+'/user/login', json.dumps({
            "email": email,
	        "password": password
        }), headers={
            'Content-Type': 'application/json'
        })


        parsed_data = (json.loads(response.text))
        if 'data' in parsed_data:
            return parsed_data['data']
        else:
            return '404'


login = User.login_user("sapt@yopmail.com", "ubuntu")
print(login)
