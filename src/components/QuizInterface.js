// components/QuizInterface.js
import React, { useState } from 'react';
import './QuizInterface.css';
import { supabase } from '../utils/supabase'; // Import Supabase client
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function QuizInterface({ questions, onAnswerSelect, answers, timeElapsed, onSubmit, userData }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate(); // Initialize navigation

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

  // Calculate total questions answered
  const totalQuestionsAnswered = Object.keys(answers).length;

  // Allow submission regardless of how many questions are answered
  const canSubmitQuiz = () => {
    return totalQuestionsAnswered > 0; // At least one question must be answered
  };

  const handleSubmit = async () => {
    try {
      // Calculate the score
      const correctAnswers = questions.filter(
        (q) => q.correct_answer === answers[q.id]
      ).length;

      // Prepare data for submission
      const submissionData = {
        phone: userData.phone,
        name: userData.name,
        university: userData.university,
        answers: JSON.stringify(answers), // Convert answers to JSON string
        time_taken: timeElapsed,
        score: correctAnswers,
        total_questions_answered: totalQuestionsAnswered,
        total_questions: questions.length,
        submitted_at: new Date().toISOString(),
      };

      // Insert data into the database
      const { error } = await supabase
        .from('quiz_submissions')
        .insert([submissionData]);

      if (error) {
        console.error('Error inserting data:', error);
        alert('Failed to submit quiz. Please try again.');
        return;
      }

      // Redirect to the Thank You page
      navigate('/thankyou');
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
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

          {currentQuestionIndex < questions.length - 1 && (
            <button
              className="nav-button"
              onClick={goToNextQuestion}
            >
              Next
            </button>
          )}

          {canSubmitQuiz() && (
            <button
              className="submit-button"
              onClick={handleSubmit}
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