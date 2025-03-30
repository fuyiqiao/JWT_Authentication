import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure this import exists

function App() {
  const [token, setToken] = useState('');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        setShowLoginPopup(false);
        setUsername('');
        setPassword('');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('An error occurred during login');
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

  const handleProtectedData = async () => {
    const response = await fetch('http://localhost:3001/protected', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message);
    } else {
      alert('Unauthorized');
    }
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* Keep your existing header content */}
        <div>
          <button onClick={() => setShowLoginPopup(true)}>Login</button>
          <button onClick={handleProtectedData}>Access Protected Data</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
        
        {showLoginPopup && <LoginPopup />}
      </header>
    </div>
  );
}

export default App;