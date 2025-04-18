// components/QuizInterface.js
import React, { useState } from 'react';
import './QuizInterface.css';

function QuizInterface({ questions, onAnswerSelect, answers, timeElapsed, onSubmit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
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

  // Check if all questions are answered
  const areAllQuestionsAnswered = () => {
    return questions.every(q => answers[q.id]);
  };

  return (
    <div className="quiz-container">
      <div className="glass-panel">
        <div className="quiz-header">
          <div className="timer">
            Time: {formatTime(timeElapsed)}
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
          
          {currentQuestionIndex < questions.length - 1 ? (
            <button 
              className="nav-button" 
              onClick={goToNextQuestion}
            >
              Next
            </button>
          ) : (
            <button 
              className="submit-button" 
              onClick={onSubmit}
              disabled={!areAllQuestionsAnswered()}
            >
              Submit Quiz
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
      </div>
    </div>
  );
}

export default QuizInterface;