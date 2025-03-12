import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setShowLogin }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:5000/register', {
                name,
                surname,  // Updated to store surname instead of username
                email,
                password
            });
            alert(response.data.message);
            setShowLogin(true); // Redirect to login after successful registration
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleRegister}>Register</button>
            <p>Already have an account? <span onClick={() => setShowLogin(true)}>Login</span></p>
        </div>
    );
};

export default Register;
