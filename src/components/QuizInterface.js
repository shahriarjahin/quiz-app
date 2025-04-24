// components/QuizInterface.js
import React, { useState, useEffect, useCallback } from 'react';
import './QuizInterface.css';

function QuizInterface({ questions, onAnswerSelect, answers, remainingTime, onSubmit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCheating, setIsCheating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for loading

  const handleSubmit = useCallback(() => {
    setIsSubmitting(true); // Show loading screen
    onSubmit();
  }, [onSubmit]);

  useEffect(() => {
    // Block user actions
    const blockActions = (e) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const blockKeyboardShortcuts = (e) => {
      const forbiddenKeys = ['c', 'u', 'a', 's']; // Ctrl+C, Ctrl+U, Ctrl+A, Ctrl+S
      if (e.ctrlKey && forbiddenKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const detectTabSwitch = () => {
      setIsCheating(true);
    };

    // Add event listeners
    document.addEventListener('contextmenu', blockActions);
    document.addEventListener('copy', blockActions);
    document.addEventListener('cut', blockActions);
    document.addEventListener('paste', blockActions);
    document.addEventListener('keydown', blockKeyboardShortcuts);
    document.addEventListener('selectstart', blockActions);
    window.addEventListener('blur', detectTabSwitch);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener('contextmenu', blockActions);
      document.removeEventListener('copy', blockActions);
      document.removeEventListener('cut', blockActions);
      document.removeEventListener('paste', blockActions);
      document.removeEventListener('keydown', blockKeyboardShortcuts);
      document.removeEventListener('selectstart', blockActions);
      window.removeEventListener('blur', detectTabSwitch);
    };
  }, []);

  useEffect(() => {
    if (isCheating) {
      alert('Cheating detected! Submitting the quiz.');
      handleSubmit();
    }
  }, [isCheating, handleSubmit]);

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if we have questions to display
  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="glass-panel">
          <div className="loading">Loading questions...</div>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="loading-screen">
        <div className="loading-message">Submitting your quiz, please wait...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  // Handle navigation
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option) => {
    onAnswerSelect(currentQuestion.id, option);
  };

  return (
    <div className="quiz-container">
      <div className="glass-panel">
        <div className="quiz-header">
          <div className="timer">
            Time Remaining: {formatTime(remainingTime)}
          </div>
          <div className="progress">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>

        <div className="question-section">
          <h3 className="question-text">{currentQuestion.question}</h3>

          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                className={`option ${answers[currentQuestion.id] === option ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(option)}
              >
                <div className="option-letter">{String.fromCharCode(65 + index)}</div>
                <div className="option-text">{option}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="navigation-controls">
          <button
            className="nav-button"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>

          {currentQuestionIndex < questions.length - 1 && (
            <button className="nav-button" onClick={goToNextQuestion}>
              Next
            </button>
          )}
        </div>
        <div className="question-navigation">
          {questions.map((q, index) => (
            <div 
              key={index}
              className={`question-dot ${index === currentQuestionIndex ? 'active' : ''} ${answers[q.id] ? 'answered' : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <div className="submit-button-container">
          <button
            className="submit-quiz-middle"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length === 0 || isSubmitting}
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizInterface;
