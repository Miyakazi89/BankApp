import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [message, setMessage] = useState('');
    const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
    const [showSigninForm, setShowSigninForm] = useState(false); 
    const [signinAccountNumber, setSigninAccountNumber] = useState(''); 
    const [accountCreated, setAccountCreated] = useState(false);
    const navigate = useNavigate();

    // Handle account creation
    const handleCreateAccount = async () => {
        const accountData = { name, surname, phone, id_number: idNumber };

        try {
            const response = await axios.post('http://localhost:5000/create_account', accountData);
            setAccountNumber(response.data.account_number);
            setMessage(response.data.message);
            setAccountCreated(true);

            const userData = { name, surname, phone, idNumber, accountNumber: response.data.account_number };

            setTimeout(() => {
                navigate('/dashboard2', { state: { user: userData } });  
            }, 2000);
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    // Handle signin using account number
    const handleSignin = async () => { 
        const signinData = { account_number: signinAccountNumber }; 

        try {
            const response = await axios.post('http://localhost:5000/signin', signinData);

            if (response.data.success) {
                setMessage(response.data.message);
                const userData = response.data.user;

                // Redirect to Dashboard2 with user data
                setTimeout(() => {
                    navigate('/dashboard2', { state: { user: userData } });
                }, 2000);
            } else {
                setMessage(response.data.message || 'Invalid account number');
            }
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Welcome to Our Bank</h1>
                <p>Your trusted partner in financial growth and security.</p>
            </header>

            <section className="services-section">
                <h2>Our Services</h2>
                <p>We offer a variety of services to meet your banking needs:</p>
                <ul>
                    <li><strong>Account Creation:</strong> Easily create an account and start managing your finances.</li>
                    <li><strong>Online Banking:</strong> Access your account anytime, anywhere, and manage your balance.</li>
                    <li><strong>Loans:</strong> Get personalized loan offers based on your financial profile.</li>
                    <li><strong>Customer Support:</strong> We're here for you 24/7 to assist with any inquiries or issues.</li>
                </ul>
            </section>

            <section className="create-account-section">
                <button onClick={() => setShowCreateAccountForm(true)}>Create Account</button>
                <button onClick={() => setShowSigninForm(true)}>Signin</button> 
            </section>

            {/* Modal for Create Account Form */}
            {showCreateAccountForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowCreateAccountForm(false)}>&times;</span>
                        <h2>Create Your Account</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }}>
                            <div>
                                <label>Name:</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div>
                                <label>Surname:</label>
                                <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required />
                            </div>
                            <div>
                                <label>Phone:</label>
                                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            </div>
                            <div>
                                <label>ID Number:</label>
                                <input type="text" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} required />
                            </div>
                            <button type="submit">Create Account</button>
                        </form>
                        {accountNumber && (
                            <div>
                                <h3>Account Created!</h3>
                                <p>Your account number is: {accountNumber}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modal for Signin Form */}
            {showSigninForm && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowSigninForm(false)}>&times;</span>
                        <h2>Signin to Your Account</h2>
                        <form onSubmit={(e) => { e.preventDefault(); handleSignin(); }}> {/* Signin form */}
                            <div>
                                <label>Account Number:</label>
                                <input
                                    type="text"
                                    value={signinAccountNumber} // Changed to signinAccountNumber
                                    onChange={(e) => setSigninAccountNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Signin</button> 
                        </form>
                    </div>
                </div>
            )}

            <section className="message-section">
                {message && <p className="message">{message}</p>}
            </section>
        </div>
    );
};

export default Dashboard;
