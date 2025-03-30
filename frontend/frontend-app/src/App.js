import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [token, setToken] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nric: '',
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
    gender: ''
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
  
      setToken(data.token);
      localStorage.setItem('token', data.token);
      
      // Fetch user data after successful login
      const userResponse = await fetch('http://localhost:3001/user', {
        headers: { Authorization: `Bearer ${data.token}` }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
  
      const userData = await userResponse.json();
      setUserData(userData);
      setShowLoginPopup(false);
  
    } catch (error) {
      alert(error.message);
      setUsername('');
      setPassword('');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/newuser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          nric: registerData.nric,
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          dob: registerData.dob,
          address: registerData.address,
          gender: registerData.gender
        })
      });

      if (response.ok) {
        setShowRegisterPopup(false);
        setRegisterData({
          username: '',
          password: '',
          confirmPassword: '',
          nric: '',
          firstName: '',
          lastName: '',
          dob: '',
          address: '',
          gender: ''
        });
        alert('Registration successful! Please login.');
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Registration failed');
      }
    } catch (error) {
      alert('An error occurred during registration');
    }
  };

  const LoginPopup = () => (
    <div className="App-login-overlay" onClick={() => setShowLoginPopup(false)}>
      <div className="App-login-content" onClick={(e) => e.stopPropagation()}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
        <div className="App-login-form-group">
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="App-login-form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
          <div className="App-login-button-group">
            <button type="submit" className="App-login-submit-button">
              Login
            </button>
            <button
              type="button"
              className="App-login-cancel-button"
              onClick={() => setShowLoginPopup(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const RegisterPopup = () => (
    <div className="App-login-overlay" onClick={() => setShowRegisterPopup(false)}>
      <div className="App-register-content" onClick={(e) => e.stopPropagation()}>
        <h2 style={{color:"black"}}>Register New User</h2>
        <form onSubmit={handleRegister}>
          <div className="App-login-form-group">
            <label>Username:</label>
            <input
              type="text"
              value={registerData.username}
              onChange={(e) => setRegisterData(prev => ({
                ...prev,
                username: e.target.value
              }))}
              required
            />
          </div>
          <div className="App-login-form-group">
            <label>Password:</label>
            <input
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData(prev => ({
                ...prev,
                password: e.target.value
              }))}
              required
            />
          </div>
          <div className="App-login-form-group">
            <label>Confirm Password:</label>
            <input
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData(prev => ({
                ...prev,
                confirmPassword: e.target.value
              }))}
              required
            />
          </div>
          <div className="App-login-form-group">
            <label>NRIC:</label>
            <input
              type="text"
              value={registerData.nric}
              onChange={(e) => setRegisterData(prev => ({
                ...prev,
                nric: e.target.value
              }))}
              required
            />
          </div>
          <div className="App-login-form-group">
            <label>First Name:</label>
            <input
              type="text"
              value={registerData.firstName}
              onChange={(e) => setRegisterData(prev => ({
                ...prev,
                firstName: e.target.value
              }))}
              required
            />
          </div>
          <div className="App-login-form-group">
            <label>Last Name:</label>
            <input
              type="text"
              value={registerData.lastName}
              onChange={(e) => setRegisterData(prev => ({
                ...prev,
                lastName: e.target.value
              }))}
              required
            />
          </div>
          <div className="App-login-form-group">
            <label>Date of Birth:</label>
            <input
              type="date"
              value={registerData.dob}
              onChange={(e) => setRegisterData({...registerData, dob: e.target.value})}
              required
            />
          </div>
          <div className="App-login-form-group">
            <label>Address:</label>
            <textarea
              value={registerData.address}
              onChange={(e) => setRegisterData(prev => ({
                ...prev,
                address: e.target.value
              }))}
              required
            />
          </div>
          <div className="App-login-form-group">
            <label>Gender:</label>
            <select
              value={registerData.gender}
              onChange={(e) => setRegisterData({...registerData, gender: e.target.value})}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="App-login-button-group">
            <button type="submit" className="App-login-submit-button">
              Register
            </button>
            <button
              type="button"
              className="App-login-cancel-button"
              onClick={() => setShowRegisterPopup(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const handleLogout = () => {
    setToken('');
    setUserData(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Fetch user data if token exists
      fetch('http://localhost:3001/user', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
        .then(res => res.json())
        .then(data => setUserData(data))
        .catch(console.error);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {userData ? (
          <div className="dashboard">
            <h2>Welcome, {userData.first_name} {userData.last_name}</h2>
            <p>NRIC: {userData.nric}</p>
            <p>Date of Birth: {new Date(userData.dob).toLocaleDateString()}</p>
            <p>Address: {userData.address}</p>
            <p>Gender: {userData.gender}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div>
            <button onClick={() => setShowLoginPopup(true)}>Login</button>
            <button onClick={() => setShowRegisterPopup(true)}>Register</button>
          </div>
        )}
        
        {showLoginPopup && <LoginPopup />}
        {showRegisterPopup && <RegisterPopup />}
      </header>
    </div>
  );
}

export default App;