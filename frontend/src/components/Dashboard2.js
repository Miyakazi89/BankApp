import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard2 = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {}; // Get user data from location.state

  // Initialize state to store user data
  const [userData, setUserData] = useState({
    ...user,
    transactionHistory: user?.transactionHistory || [], // Ensure transactionHistory is initialized
  });

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [recipient, setRecipient] = useState('');

  // UseEffect to debug balance changes
  useEffect(() => {
    console.log('Balance updated:', userData.balance);
  }, [userData.balance]);

  // Handle Deposit
  const depositFunds = () => {
    const depositAmount = parseFloat(amount);
    if (depositAmount <= 0 || isNaN(depositAmount)) {
      setError('Invalid deposit amount. Please enter a positive number.');
      return;
    }

    const newBalance = (userData.balance || 0) + depositAmount;

    const newTransaction = {
      type: 'Deposit',
      amount: depositAmount,
      date: new Date().toLocaleString(),
    };

    setUserData((prevUserData) => ({
      ...prevUserData,
      balance: newBalance,
      transactionHistory: [...(prevUserData.transactionHistory || []), newTransaction],
    }));

    setAmount('');
    setError('');
  };

  // Handle Withdrawal
  const withdrawFunds = () => {
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0 || isNaN(withdrawAmount)) {
      setError('Invalid withdrawal amount. Please enter a positive number.');
      return;
    } else if (userData.balance < withdrawAmount) {
      setError('Insufficient funds.');
      return;
    }

    const newBalance = userData.balance - withdrawAmount;

    const newTransaction = {
      type: 'Withdrawal',
      amount: withdrawAmount,
      date: new Date().toLocaleString(),
    };

    setUserData((prevUserData) => ({
      ...prevUserData,
      balance: newBalance,
      transactionHistory: [...(prevUserData.transactionHistory || []), newTransaction],
    }));

    setAmount('');
    setError('');
  };

  // Handle Transfer
  const transferFunds = () => {
    const transferAmount = parseFloat(amount);
    if (transferAmount <= 0 || isNaN(transferAmount)) {
      setError('Invalid transfer amount.');
      return;
    } else if (userData.balance < transferAmount) {
      setError('Insufficient funds.');
      return;
    } else if (!recipient) {
      setError('Please enter a recipient name.');
      return;
    }

    const newBalance = userData.balance - transferAmount;

    const newTransaction = {
      type: 'Transfer',
      amount: transferAmount,
      recipient,
      date: new Date().toLocaleString(),
    };

    setUserData((prevUserData) => ({
      ...prevUserData,
      balance: newBalance,
      transactionHistory: [...(prevUserData.transactionHistory || []), newTransaction],
    }));

    setAmount('');
    setRecipient('');
    setError('');
  };

  // Clean Transaction History
  const cleanHistory = () => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      transactionHistory: [],
    }));
  };

  // Display transaction history
  const renderTransactionHistory = () => {
    const transactions = Array.isArray(userData.transactionHistory)
      ? userData.transactionHistory
      : [];
    return transactions.map((transaction, index) => (
      <div key={index} className="transaction-item">
        <p>
          <strong>{transaction.type}</strong> - R{transaction.amount?.toFixed(2) || '0.00'}
          <span> ({transaction.date || 'N/A'})</span>
        </p>
      </div>
    ));
  };

  // Logout function (updated to navigate to dashboard)
  const handleLogout = () => {
    navigate('/dashboard'); 
  };

  return (
    <div key={userData.balance} className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Your one-stop hub to manage your account and settings</p>
      </div>

      <div className="user-info">
        <h2>Hello, {userData?.name || 'User'}!</h2>
        <p>Your account number: {userData?.accountNumber || 'Account number not available'}</p>
        <p>Your balance: R{userData.balance?.toFixed(2) || '0.00'}</p>
      </div>

      <div className="transaction-section">
        <h2>Manage Your Funds</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="amount-input"
        />
        <input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Enter recipient's name"
          className="recipient-input"
        />
        <div className="buttons">
          <button onClick={depositFunds} className="btn">
            Deposit
          </button>
          <button onClick={withdrawFunds} className="btn">
            Withdraw
          </button>
          <button onClick={transferFunds} className="btn">
            Transfer
          </button>
        </div>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="clean-history">
        <button onClick={cleanHistory} className="btn btn-clean">
          Clean History
        </button>
      </div>

      <div className="transaction-history">
        <h2>Your Transaction History</h2>
        {renderTransactionHistory()}
      </div>

      <div className="logout-section">
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard2;
