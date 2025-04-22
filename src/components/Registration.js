// components/Registration.js
import React, { useState } from 'react';
import './Registration.css';

function Registration({ onSubmit }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Directly submit the form data without user validation
    onSubmit(formData);
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
            />
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
            />
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
            />
          </div>
          
          <button type="submit" className="start-button">Start Quiz</button>
        </form>
      </div>
    </div>
  );
}

export default Registration;