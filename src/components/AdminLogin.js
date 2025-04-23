import React, { useState } from 'react';
import './AdminLogin.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Hardcoded admin credentials (replace with secure authentication in production)
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    if (email === adminEmail && password === adminPassword) {
      alert('Admin login successful!');
      // Redirect to admin dashboard or perform other actions
    } else {
      setError('Invalid admin credentials');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="glass-panel">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          {error && <span className="error-message">{error}</span>}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;