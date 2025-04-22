// components/QuizInterface.js
import React, { useState } from 'react';
import './QuizInterface.css';
import { supabase } from '../utils/supabaseClient'; // Import Supabase client

function QuizInterface({ questions, onAnswerSelect, answers, timeElapsed, onSubmit }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Format time (seconds to MM:SS)
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTotalAnsweredQuestions = () => {
    return Object.keys(answers).filter((key) => answers[key]).length;
  };

  const handleSubmit = async () => {
    const totalAnswered = getTotalAnsweredQuestions();

    try {
      const { data, error } = await supabase
        .from('quiz_submissions') // Replace with your table name
        .insert([
          { total_answered: totalAnswered, submitted_at: new Date().toISOString() }
        ]);

      if (error) {
        console.error('Error saving submission:', error);
      } else {
        console.log('Submission saved:', data);
        onSubmit(totalAnswered); // Call the parent onSubmit function
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
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

          <button 
            className="submit-button" 
            onClick={handleSubmit} // Use the new handleSubmit function
            disabled={getTotalAnsweredQuestions() === 0}
          >
            Submit Quiz
          </button>

          {currentQuestionIndex < questions.length - 1 && (
            <button 
              className="nav-button" 
              onClick={goToNextQuestion}
            >
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
      </div>
    </div>
  );
}

export default QuizInterface;