// components/QuizInterface.js
import React, { useState, useEffect } from 'react';
import './QuizInterface.css';

function QuizInterface({ questions, onAnswerSelect, answers, totalTime, onSubmit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const [remainingTime, setRemainingTime] = useState(30 * 60); // 30 minutes in seconds

  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Sync timer with device time and handle auto-submission
  useEffect(() => {
    const intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(elapsed);

      const timeLeft = 30 * 60 - elapsed; // Calculate remaining time
      setRemainingTime(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(intervalId); // Stop the timer
        onSubmit(timeElapsed); // Automatically submit the quiz
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime, onSubmit, timeElapsed]);

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
    return questions.every((q) => answers[q.id]);
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

          <button
            className="submit-button"
            onClick={() => onSubmit(timeElapsed)}
            disabled={getTotalAnsweredQuestions() === 0}
          >
            Submit Quiz
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
              className={`question-dot ${index === currentQuestionIndex ? 'active' : ''} ${
                answers[q.id] ? 'answered' : ''
              }`}
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