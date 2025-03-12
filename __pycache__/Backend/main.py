# main.py
from Account import Account
from Backend.database import save_account, load_account
from Backend.auth import UserAuthentication
from Backend.dashboard import Dashboard
from Backend.transactions import TransactionManagement
from Backend.error_handling import ErrorHandling

def main():
    auth = UserAuthentication()
    error_handler = ErrorHandling()
    
    # Register a new user
    auth.register("user1", "password123")
    
    # Attempt login
    if auth.login("user1", "password123"):
        # Create an account
        account = Account("John", "Doe", "1234567890", "987654321")
        save_account(account)
        
        # Load account
        loaded_account = load_account(account.account_number)
        
        # Perform dashboard operations
        dashboard = Dashboard(loaded_account)
        dashboard.display_balance()
        dashboard.deposit(1000)
        dashboard.withdraw(500)
        
        # Show transaction history
        transactions = TransactionManagement(loaded_account)
        transactions.show_transaction_history()
    else:
        error_handler.handle_invalid_login()

if __name__ == "__main__":
    main()
