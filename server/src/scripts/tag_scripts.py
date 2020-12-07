import requests
import json

from user_scripts import User, BASE_URL

class Tag:
    def __init__(self):
        self.token = User.login_user()
        self.user_id = ''

    def get_tags(self):
        response = requests.get(BASE_URL+'/tags/getAllTags', headers={
            'Content-Type': 'application/json',
            'token': self.token['token']
        })

        return response.text

    def create_tag(self, name):
        response = requests.post(BASE_URL+'/tags/addNewTag', json.dumps({
            "name": name
        }), headers={
            'Content-Type': 'application/json',
            'token': self.token['token']
        })

        return response.text

    def search_tag(self, serach_term):
        response = requests.post(BASE_URL+'/tags/searchTagsByName', json.dumps({
            'search_term': serach_term
        }), headers={
            'Content-Type': 'application/json',
            'token': self.token['token']
        })

        return response.text

    def vote_tag()


tagObject = Tag()

search = tagObject.search_tag('cr')
print(search)
