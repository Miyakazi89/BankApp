# account.py
import random

class Account:
    def __init__(self, name, surname, phone, id_number):
        self.name = name
        self.surname = surname
        self.phone = phone
        self.id_number = id_number
        self.account_number = self.generate_account_number()
        self.balance = 0
        self.transactions = []

    def generate_account_number(self):
        return str(random.randint(1000000000, 9999999999))
