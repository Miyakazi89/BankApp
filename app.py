from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import json
from werkzeug.security import generate_password_hash, check_password_hash
from Account import Account
from database import save_account, load_account

app = Flask(__name__)

# Enable CORS globally for all routes, but restrict it to the frontend origin (http://localhost:3000)
CORS(app, origins="http://localhost:3000", supports_credentials=True)

registered_users_file = 'registered_users.json'
accounts_file = 'accounts.json'

def save_user(data):
    try:
        with open(registered_users_file, 'r') as file:
            users = json.load(file)
    except FileNotFoundError:
        users = []

    for user in users:
        if user['email'] == data['email']:
            return False

    data['password'] = generate_password_hash(data['password'])  # Hash the password before saving
    users.append(data)
    with open(registered_users_file, 'w') as file:
        json.dump(users, file)
    return True

def save_account_data(data):
    try:
        with open(accounts_file, 'r') as file:
            accounts = json.load(file)
    except FileNotFoundError:
        accounts = []

    accounts.append(data)
    with open(accounts_file, 'w') as file:
        json.dump(accounts, file)

@app.route('/register', methods=['POST'])
@cross_origin()  # Enable CORS for the /register route
def register():
    data = request.get_json()
    if save_user(data):
        return jsonify({"message": "User registered successfully!"})
    else:
        return jsonify({"message": "Email is already registered."}), 400

@app.route('/login', methods=['POST'])
@cross_origin()  # Enable CORS for the /login route
def login():
    data = request.get_json()
    try:
        with open(registered_users_file, 'r') as file:
            users = json.load(file)
        for user in users:
            if user['email'] == data['email'] and check_password_hash(user['password'], data['password']):  # Check the hashed password
                return jsonify({"message": "Login successful!"})
        return jsonify({"message": "Invalid login attempt."}), 401
    except FileNotFoundError:
        return jsonify({"message": "No registered users."}), 401

@app.route('/signin', methods=['POST'])
@cross_origin()  # Enable CORS for the /signin route
def signin():
    data = request.get_json()
    account_number = data['account_number']
    try:
        with open(accounts_file, 'r') as file:
            accounts = json.load(file)
        # Check if the account number exists in the accounts data
        account = next((acc for acc in accounts if acc['account_number'] == account_number), None)
        if account:
            return jsonify({"success": True, "message": "Signin successful!", "user": account})
        else:
            return jsonify({"success": False, "message": "Account not found."}), 404
    except FileNotFoundError:
        return jsonify({"message": "No accounts found."}), 404

@app.route('/create_account', methods=['POST'])
@cross_origin()  # Enable CORS for the /create_account route
def create_account():
    data = request.get_json()
    account = Account(data['name'], data['surname'], data['phone'], data['id_number'])
    account_data = {
        'name': account.name,
        'surname': account.surname,
        'phone': account.phone,
        'id_number': account.id_number,
        'account_number': account.account_number,
        'balance': account.balance,
        'transactions': account.transactions
    }
    save_account_data(account_data)
    return jsonify({"message": "Bank account created successfully!", "account_number": account.account_number})

@app.route('/get_balance', methods=['POST'])
@cross_origin()  # Enable CORS for the /get_balance route
def get_balance():
    data = request.get_json()
    account_number = data['account_number']
    try:
        with open(accounts_file, 'r') as file:
            accounts = json.load(file)
        for account in accounts:
            if account['account_number'] == account_number:
                return jsonify({"balance": account['balance']})
        return jsonify({"message": "Account not found."}), 404
    except FileNotFoundError:
        return jsonify({"message": "No accounts found."}), 404

@app.route('/deposit', methods=['POST'])
@cross_origin()  # Enable CORS for the /deposit route
def deposit():
    data = request.get_json()
    account_number = data['account_number']
    amount = data['amount']
    try:
        with open(accounts_file, 'r') as file:
            accounts = json.load(file)
        for account in accounts:
            if account['account_number'] == account_number:
                account['balance'] += amount
                account['transactions'].append(f"Deposited: {amount}")
                with open(accounts_file, 'w') as file:
                    json.dump(accounts, file)
                return jsonify({"message": "Deposit successful!", "new_balance": account['balance']})
        return jsonify({"message": "Account not found."}), 404
    except FileNotFoundError:
        return jsonify({"message": "No accounts found."}), 404

@app.route('/withdraw', methods=['POST'])
@cross_origin()  # Enable CORS for the /withdraw route
def withdraw():
    data = request.get_json()
    account_number = data['account_number']
    amount = data['amount']
    try:
        with open(accounts_file, 'r') as file:
            accounts = json.load(file)
        for account in accounts:
            if account['account_number'] == account_number:
                if account['balance'] < amount:
                    return jsonify({"message": "Insufficient funds."}), 400
                account['balance'] -= amount
                account['transactions'].append(f"Withdrew: {amount}")
                with open(accounts_file, 'w') as file:
                    json.dump(accounts, file)
                return jsonify({"message": "Withdrawal successful!", "new_balance": account['balance']})
        return jsonify({"message": "Account not found."}), 404
    except FileNotFoundError:
        return jsonify({"message": "No accounts found."}), 404

@app.route('/transfer', methods=['POST'])
@cross_origin()  # Enable CORS for the /transfer route
def transfer():
    data = request.get_json()
    sender_account_number = data['sender_account_number']
    recipient_account_number = data['recipient_account_number']
    amount = data['amount']
    try:
        with open(accounts_file, 'r') as file:
            accounts = json.load(file)
        sender_account = next((acc for acc in accounts if acc['account_number'] == sender_account_number), None)
        recipient_account = next((acc for acc in accounts if acc['account_number'] == recipient_account_number), None)
        if not sender_account or not recipient_account:
            return jsonify({"message": "Account not found."}), 404
        if sender_account['balance'] < amount:
            return jsonify({"message": "Insufficient funds."}), 400
        sender_account['balance'] -= amount
        recipient_account['balance'] += amount
        sender_account['transactions'].append(f"Transferred: {amount} to {recipient_account_number}")
        recipient_account['transactions'].append(f"Received: {amount} from {sender_account_number}")
        with open(accounts_file, 'w') as file:
            json.dump(accounts, file)
        return jsonify({"message": "Transfer successful!", "sender_balance": sender_account['balance'], "recipient_balance": recipient_account['balance']})
    except FileNotFoundError:
        return jsonify({"message": "No accounts found."}), 404

@app.route('/transaction_history', methods=['POST'])
@cross_origin()  # Enable CORS for the /transaction_history route
def transaction_history():
    data = request.get_json()
    account_number = data['account_number']
    try:
        with open(accounts_file, 'r') as file:
            accounts = json.load(file)
        for account in accounts:
            if account['account_number'] == account_number:
                return jsonify({"transactions": account['transactions']})
        return jsonify({"message": "Account not found."}), 404
    except FileNotFoundError:
        return jsonify({"message": "No accounts found."}), 404

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response

if __name__ == '__main__':
    app.run(debug=True)
