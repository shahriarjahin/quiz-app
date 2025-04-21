// components/Registration.js
import React, { useState } from 'react';
import './Registration.css';
import { supabase } from '../utils/supabase';

function Registration({ onSubmit, setUserData, setCurrentScreen, setTimerRunning }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    university: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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
    
    if (!formData.university.trim()) {
      newErrors.university = 'University name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegistration = async (data) => {
    try {
      // Check if the phone number exists in the users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('phone_number', data.phone)
        .single();

      if (userError && userError.code === 'PGRST116') {
        alert('Registration not found. Please check your phone number.');
        return;
      }

      if (userError) {
        throw userError; // Handle unexpected errors
      }

      // Check for duplicate phone number in the quiz_submissions table
      const { data: existingSubmission, error: submissionError } = await supabase
        .from('quiz_submissions')
        .select('*')
        .eq('phone', data.phone)
        .single();

      if (submissionError) {
        console.error('Error checking quiz submissions:', submissionError);
      }

      if (submissionError && submissionError.code !== 'PGRST116') {
        throw submissionError; // Handle unexpected errors
      }

      if (existingSubmission) {
        console.log('Duplicate submission found:', existingSubmission);
        alert('You have already participated.');
        return; // Stop further execution
      }

      // If no duplicate, proceed with registration
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            phone_number: data.phone,
            name: data.name,
            university: data.university
          }
        ]);

      if (insertError) throw insertError;

      setUserData(data);
      setCurrentScreen('quiz');
      setTimerRunning(true);
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await handleRegistration(formData);
        onSubmit(formData);
      } catch (error) {
        console.error('Error validating registration:', error);
        alert('An error occurred while validating your registration. Please try again.');
      }
    }
  };

  return (
    <div className="registration-container">
      <div className="glass-panel">
        <h2>Quiz Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="university">University Name</label>
            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder="Enter your university name"
              className={errors.university ? 'error' : ''}
            />
            {errors.university && <span className="error-message">{errors.university}</span>}
          </div>
          
          <button type="submit" className="start-button">Start Quiz</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;