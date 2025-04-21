// components/Registration.js
import React, { useState } from 'react';
import './Registration.css';
import { supabase } from '../utils/supabase'; // Corrected import path

function Registration({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
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

  const validateUser = async (phone) => {
    try {
      const { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('phone', phone)
        .single();

      if (error && error.code === 'PGRST116') {
        alert('Registration not found. Please check your phone number.');
        return false;
      }

      if (error) {
        console.error('Error validating user:', error);
        throw error;
      }

      return true; // User exists
    } catch (error) {
      console.error('Unexpected error during user validation:', error);
      alert('An unexpected error occurred. Please try again.');
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
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