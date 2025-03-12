// src/components/CreateAccount.js
import React, { useState } from 'react';
import axios from 'axios';

const CreateAccount = ({ email }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [phone, setPhone] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [message, setMessage] = useState('');

    const handleCreateAccount = async () => {
        try {
            const response = await axios.post('http://localhost:5000/create_account', {
                name,
                surname,
                phone,
                id_number: idNumber,
                email
            });
            setMessage(response.data.message + "\nAccount Number: " + response.data.account_number);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Create Bank Account</h2>
            {message && <p>{message}</p>}
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Surname" value={surname} onChange={(e) => setSurname(e.target.value)} />
            <input type="text" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input type="text" placeholder="ID Number" value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
            <button onClick={handleCreateAccount}>Create Account</button>
        </div>
    );
};

export default CreateAccount;
