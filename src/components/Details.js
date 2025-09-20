// components/Registration.js
import React, { useState, useEffect } from 'react';
import './Details.css';
import { supabase, GOOGLE_SHEETS_Users_CSV_URL, GOOGLE_SHEETS_Submitted_CSV_URL } from '../utils/supabase';
import Papa from 'papaparse';

function Registration({ onSubmit, email }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    university: ''
  });
  const [errors, setErrors] = useState({});
  const [csvData, setCsvData] = useState([]);
  const [quizStatus, setQuizStatus] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [manualPhone, setManualPhone] = useState('');
  const [phoneConfirmed, setPhoneConfirmed] = useState(false);

  useEffect(() => {
    fetch(GOOGLE_SHEETS_Users_CSV_URL)
      .then((response) => response.text())
      .then((text) => {
        Papa.parse(text, {
          header: true,
          complete: (result) => {
            setCsvData(result.data);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
          }
        });
      });
  }, []);

  useEffect(() => {
    if (email && csvData.length > 0) {
      const user = csvData.find((user) => user.email === email);
      if (user) {
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          university: user.university || 'N/A'
        });
        if (user.phone) {
          setPhoneConfirmed(true);
          fetchQuizDetails(user.phone); // Only fetch if phone exists
        } else {
          setPhoneConfirmed(false);
        }
      }
    }
  }, [csvData, email]);

  const handlePhoneConfirm = () => {
    setFormData((prev) => ({
      ...prev,
      phone: manualPhone
    }));
    fetchQuizDetails(manualPhone);
    setPhoneConfirmed(true);
  };

  const fetchQuizDetails = async (phone) => {
    try {
      const response = await fetch(GOOGLE_SHEETS_Submitted_CSV_URL);
      const csvText = await response.text();
      const rows = csvText.split('\n').map(row => row.split(','));
      const headers = rows[0].map(header => header.trim());
      const phoneIndex = headers.indexOf('Phone');
      const statusIndex = headers.indexOf('Submitted At');
      const scoreIndex = headers.indexOf('Score');
      if (phoneIndex === -1) {
        setQuizStatus('Error fetching status');
        setQuizScore('N/A');
        return;
      }
      const userRow = rows.find((row, index) => index !== 0 && row[phoneIndex] === phone);
      if (userRow) {
        setQuizStatus(userRow[statusIndex] ? 'Completed' : 'Not Started');
        if (scoreIndex === -1) setQuizScore('N/A');
        else setQuizScore(userRow[scoreIndex] || 'N/A');
      } else {
        setQuizStatus('Not Started');
        setQuizScore('N/A');
      }
    } catch (err) {
      setQuizStatus('Error fetching status');
      setQuizScore('N/A');
    }
  };

  const handleConfirm = () => {
    if (formData.name && formData.phone && formData.email) {
      alert('You cannot change tab or switch browser, take screenshots otherwise you will be disqualified.');
      onSubmit(formData);
    } else {
      alert('Please ensure all fields are filled correctly.');
    }
  };

  return (
    <div className="registration-container">
      <div className="glass-panel">
        <h2>Confirm Your Details</h2>
        <div className="form-group">
          <label>Phone Number:</label>
          {formData.phone && phoneConfirmed ? (
            <p>{formData.phone}</p>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="text"
                placeholder="Enter your phone number"
                value={manualPhone}
                maxLength={11}
                onChange={(e) => {
                  // Only allow numbers
                  const val = e.target.value.replace(/\D/g, '');
                  setManualPhone(val);
                  setPhoneConfirmed(false); // Reset confirmation if editing
                }}
                style={{ marginRight: "8px" }}
              />
              {manualPhone.length === 11 && !phoneConfirmed && (
                <button
                  type="button"
                  onClick={handlePhoneConfirm}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: "#47b881",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  OK
                </button>
              )}
              {!manualPhone && <p style={{ color: 'red', marginLeft: 8 }}>NOT FOUND</p>}
            </div>
          )}
        </div>
        <div className="form-group">
          <label>Full Name:</label>
          <p>{formData.name || 'N/A'}</p>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <p>{formData.email || 'N/A'}</p>
        </div>
        <div className="form-group">
          <label>University:</label>
          <p>{formData.university || 'N/A'}</p>
        </div>
        <div className="form-group">
          <label>Quiz Status:</label>
          <p>{quizStatus || 'Loading...'}</p>
        </div>
        <button onClick={handleConfirm} className="start-button">Confirm and Start Quiz</button>
      </div>
    </div>
  );
}

export default Registration;
