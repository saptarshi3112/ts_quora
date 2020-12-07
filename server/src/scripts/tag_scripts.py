import requests

from user_scripts import User, BASE_URL

class Tag:
    def __init__(self):
        self.token = User.login_user()

    def getTags(self):
        response = requests.get(BASE_URL+'/tags/getAllTags', headers={
            'Content-Type': 'application/json',
            'token': self.token['token']
        })

        return response.text

tag = Tag()
tags = tag.getTags()
print(tags)
