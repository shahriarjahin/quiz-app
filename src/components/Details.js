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
  const [quizStatus, setQuizStatus] = useState(null); // To store quiz status
  const [quizScore, setQuizScore] = useState(null); // To store quiz score

  useEffect(() => {
    // Fetch and parse the CSV data from the Google Sheets link
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

        // Check quiz status and score in Google Sheets CSV
        fetchQuizDetails(user.phone);
      }
    }
  }, [csvData, email]);

  const fetchQuizDetails = async (phone) => {
    try {
      const response = await fetch(GOOGLE_SHEETS_Submitted_CSV_URL);
      const csvText = await response.text();

      // Parse the CSV data
      const rows = csvText.split('\n').map(row => row.split(','));
      const headers = rows[0].map(header => header.trim()); // Normalize headers without changing case
      const phoneIndex = headers.indexOf('Phone');
      const statusIndex = headers.indexOf('Submitted At'); // Assuming 'Submitted At' indicates completion
      const scoreIndex = headers.indexOf('Score');

      if (phoneIndex === -1) {
        console.error('Phone column not found in the CSV file.');
        setQuizStatus('Error fetching status');
        setQuizScore('N/A');
        return;
      }

      // Find the row with the matching phone number
      const userRow = rows.find((row, index) => index !== 0 && row[phoneIndex] === phone);

      if (userRow) {
        setQuizStatus(userRow[statusIndex] ? 'Completed' : 'Not Started'); // Check if 'Submitted At' has a value

        if (scoreIndex === -1) {
          console.warn('Score column not found in the CSV file.');
          setQuizScore('N/A');
        } else if (!userRow[scoreIndex]) {
          console.warn('Score value is empty for the user.');
          setQuizScore('N/A');
        } else {
          setQuizScore(userRow[scoreIndex]);
        }
      } else {
        setQuizStatus('Not Started');
        setQuizScore('N/A');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
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
            <p>+880{formData.phone || 'N/A'}</p>
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
