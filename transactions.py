# transactions.py
class TransactionManagement:
    def __init__(self, account):
        self.account = account

    def show_transaction_history(self):
        for transaction in self.account.transactions:
            print(transaction)
