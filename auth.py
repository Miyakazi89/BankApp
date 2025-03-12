# auth.py
class UserAuthentication:
    def __init__(self):
        self.users = {}

    def register(self, username, password):
        self.users[username] = password

    def login(self, username, password):
        if username in self.users and self.users[username] == password:
            return True
        return False
