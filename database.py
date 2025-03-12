# database.py
import json
from Account import Account

def save_account(account):
    account_data = {
        'name': account.name,
        'surname': account.surname,
        'phone': account.phone,
        'id_number': account.id_number,
        'account_number': account.account_number,
        'balance': account.balance,
        'transactions': account.transactions
    }
    with open(f'{account.account_number}.txt', 'w') as file:
        json.dump(account_data, file)

def load_account(account_number):
    with open(f'{account_number}.txt', 'r') as file:
        account_data = json.load(file)
        account = Account(
            account_data['name'],
            account_data['surname'],
            account_data['phone'],
            account_data['id_number']
        )
        account.balance = account_data['balance']
        account.transactions = account_data['transactions']
        account.account_number = account_number
    return account
