# dashboard.py
from Backend.database import save_account

class Dashboard:
    def __init__(self, account):
        self.account = account

    def display_balance(self):
        print(f"Account Balance: {self.account.balance}")

    def deposit(self, amount):
        self.account.balance += amount
        self.account.transactions.append(f"Deposited: {amount}")
        save_account(self.account)

    def withdraw(self, amount):
        if amount > self.account.balance:
            print("Insufficient funds.")
        else:
            self.account.balance -= amount
            self.account.transactions.append(f"Withdrew: {amount}")
            save_account(self.account)

    def transfer(self, amount, recipient_account):
        if amount > self.account.balance:
            print("Insufficient funds.")
        else:
            self.account.balance -= amount
            self.account.transactions.append(f"Transferred: {amount} to {recipient_account.account_number}")
            recipient_account.balance += amount
            recipient_account.transactions.append(f"Received: {amount} from {self.account.account_number}")
            save_account(self.account)
            save_account(recipient_account)
