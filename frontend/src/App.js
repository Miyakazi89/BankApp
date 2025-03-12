import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Dashboard2 from './components/Dashboard2';  // Import your Dashboard2 component
import myImage from './components/image.jpg'; // Import your image
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard2" element={<Dashboard2 />} /> {/* Add the route for Dashboard2 */}
            </Routes>
        </Router>
    );
}

function Auth() {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <div className="App">
            {showLogin ? (
                <Login setShowLogin={setShowLogin} />
            ) : (
                <Register setShowLogin={setShowLogin} />
            )}
        </div>
    );
}

export default App;
