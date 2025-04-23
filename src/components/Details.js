// components/Registration.js
import React, { useState, useEffect } from 'react';
import './Details.css';
import { checkUserRegistration, GOOGLE_SHEETS_Users_CSV_URL } from '../utils/supabase';
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
  const [isConfirmed, setIsConfirmed] = useState(false);

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
      }
    }
  }, [csvData, email]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          <label>Phone Number:</label>
          <p>+880{ formData.phone || 'N/A'}</p>
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
