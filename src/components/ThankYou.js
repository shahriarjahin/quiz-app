// components/ThankYou.js
import React from 'react';
import './ThankYou.css';

function ThankYou({ result, userData }) {
  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="thankyou-container">
      <div className="glass-panel">
        <div className="confetti-animation">
          {/* Animation elements would go here */}
        </div>
        
        <h2>Quiz Complete!</h2>
        
        <div className="user-info">
          <p>Thank you, <strong>{userData.name}</strong>!</p>
          <p>Your submission has been recorded.</p>
        </div>
        
        {result && (
          <div className="result-summary">
            
            
            <div className="result-item">
              <span className="result-label">Total Answered:</span>
              <span className="result-value">{Object.keys(result.answers).length}</span>
            </div>
            
          </div>
        )}
        
        <div className="final-message">
          <p>We appreciate your participation!</p>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;