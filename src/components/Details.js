// components/Registration.js
import React, { useState, useEffect } from 'react';
import './Details.css';
import { supabase, GOOGLE_SHEETS_Users_CSV_URL } from '../utils/supabase';
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
    console.log('Email Prop:', email);
    console.log('CSV Data:', csvData);
    if (email && csvData.length > 0) {
      const user = csvData.find((user) => user.email === email);
      console.log('Matched User:', user);
      if (user) {
        setFormData({
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          university: user.university || 'N/A'
        });

        // Check quiz status and score in Supabase
        fetchQuizDetails(user.phone);
      }
    }
  }, [csvData, email]);

  const fetchQuizDetails = async (phone) => {
    try {
      const { data: submission, error } = await supabase
        .from('quiz_submissions') // Replace with your actual table name
        .select('status, score') // Replace 'status' and 'score' with your actual column names
        .eq('phone', phone)
        .single();

      if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
        console.error('Error fetching quiz details:', error);
        setQuizStatus('Error fetching status');
        setQuizScore('N/A');
      } else if (submission) {
        setQuizStatus(submission.status || 'Completed'); // Default to 'Completed' if no status is found
        setQuizScore(submission.score || 'N/A'); // Default to 'N/A' if no score is found
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
          <label>Quiz Status:</label>
          <p>{quizStatus || 'Loading...'}</p>
        </div>
        <div className="form-group">
          <label>Score:</label>
          <p>{quizScore || 'N/A'}</p>
        </div>
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
        <button onClick={handleConfirm} className="start-button">Confirm and Start Quiz</button>
      </div>
    </div>
  );
}

export default Registration;
