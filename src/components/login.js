import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './login.css';
import { checkUserRegistration, GOOGLE_SHEETS_Users_CSV_URL } from '../utils/supabase';
function Login({ onLogin }) {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    // Load and parse the CSV file
    fetch(GOOGLE_SHEETS_Users_CSV_URL)
      .then((response) => response.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          complete: (result) => {
            setCsvData(result.data);
            console.log('CSV Data:', result.data);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      setError('Email is required');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phone.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    console.log('Input Email:', phone.trim());

    const isRegistered = csvData.some((user) => user.email && user.email.trim() === phone.trim());

    if (isRegistered) {
      onLogin(phone.trim()); // Pass the email to the parent component
    } else {
      setError('Email not found. Please register first.');
    }
  };

  return (
    <div className="details-container">
      <div className="glass-panel">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-groupl">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your email"
              className={error ? 'error' : ''}
            />
            {error && <span className="error-message">{error}</span>}
          </div>

          <button type="submit" className="start-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;