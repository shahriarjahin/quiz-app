// components/QuizInterface.js
import React, { useState } from 'react';
import './QuizInterface.css';
import { supabase } from '../utils/supabase'; // Import Supabase client
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function QuizInterface({ questions, onAnswerSelect, answers, timeElapsed, onSubmit, userData }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const navigate = useNavigate(); // Initialize navigate

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

  // Define the handleSubmit function
  const handleSubmit = async () => {
    try {
      // Calculate results
      const correctAnswers = questions.filter(q => q.correct_answer === answers[q.id]).length;
      const totalAnswered = Object.keys(answers).length;

      // Insert submission into Supabase
      const { error } = await supabase
        .from('quiz_submissions')
        .insert([
          {
            name: userData.name,
            university: userData.university,
            phone: userData.phone, // Ensure phone matches the database column
            answers: answers,
            time_taken: timeElapsed,
            score: correctAnswers,
            total_questions_answered: totalAnswered,
            submitted_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      // Call onSubmit callback
      onSubmit({
        answers: answers,
        total: questions.length,
        timeTaken: timeElapsed
      });

      // Navigate to ThankYou page
      navigate('/thankyou'); // Replace '/thankyou' with the actual route for ThankYou.js
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
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

          {currentQuestionIndex < questions.length - 1 ? (
            <button
              className="nav-button"
              onClick={goToNextQuestion}
            >
              Next
            </button>
          ) : null}
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

        <div className="submit-quiz-middle">
          <button
            className="submit-button"
            onClick={handleSubmit}
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizInterface;

// components/ParentComponent.js
import React, { useState, useEffect } from 'react';
import QuizInterface from './QuizInterface';

function ParentComponent() {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    // Fetch questions from an API or database
    async function fetchQuestions() {
      const response = await fetch('/api/questions'); // Replace with your API endpoint
      const data = await response.json();
      setQuestions(data);
    }

    fetchQuestions();
  }, []);

  return (
    <QuizInterface
      questions={questions}
      onAnswerSelect={(id, answer) => console.log(id, answer)}
      answers={{}}
      timeElapsed={0}
      onSubmit={(data) => console.log('Quiz submitted:', data)}
      userData={{ name: 'John Doe', university: 'XYZ University', phone: '1234567890' }}
    />
  );
}

export default ParentComponent;