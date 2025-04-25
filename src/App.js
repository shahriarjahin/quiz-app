// src/App.js
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Details from './components/Details';
import QuizInterface from './components/QuizInterface';
import ThankYou from './components/ThankYou';
import Login from './components/login';
import { supabase, fetchQuestionsFromGoogleSheet, GOOGLE_SHEETS_Submitted_CSV_URL, GOOGLE_SHEETS_WEB_APP_URL } from './utils/supabase';
import './App.css';
const totaltime = 15; // Total time in minutes
function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userData, setUserData] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timerRunning, setTimerRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(totaltime * 60); // 3 minutes in seconds
  const [quizResult, setQuizResult] = useState(null);
  const [email, setEmail] = useState('');

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      const startTime = Date.now();
      const intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = totaltime * 60 - elapsed; // Calculate remaining time
        setRemainingTime(timeLeft);

        if (timeLeft <= 0) {
          clearInterval(intervalId); // Stop the timer
          handleSubmit(); // Automatically submit the quiz
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [timerRunning]);

  // Fetch quiz questions when user data is provided
  useEffect(() => {
    const fetchQuizData = async () => {
      if (userData) {
        try {
          const data = await fetchQuestionsFromGoogleSheet();
          setQuizData(data);
        } catch (error) {
          console.error('Error fetching quiz questions:', error);
        }
      }
    };

    fetchQuizData();
  }, [userData]);

  // Handle user registration
  const handleRegistration = async (data) => {
    try {
      const response = await fetch(GOOGLE_SHEETS_Submitted_CSV_URL);
      const csvText = await response.text();

      // Parse the CSV data
      const rows = csvText.split('\n').map(row => row.split(','));
      const headers = rows[0].map(header => header.trim().toLowerCase()); // Normalize headers
      const phoneIndex = headers.indexOf('phone'); // Match 'phone' column case-insensitively

      if (phoneIndex === -1) {
        alert('Phone column not found in the CSV file.');
        return;
      }

      // Check for duplicate phone number
      const isDuplicate = rows.some((row, index) => index !== 0 && row[phoneIndex] === data.phone);

      if (isDuplicate) {
        alert('You have already submitted.');
        return;
      }

      setUserData(data);
      setCurrentScreen('quiz');
      setTimerRunning(true);
    } catch (error) {
      console.error('Error during registration:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  // Handle user login
  const handleLogin = (emailInput) => {
    setEmail(emailInput);
    setCurrentScreen('registration');
  };

  // Handle answer selection
  const handleAnswerSelect = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer
    });
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    setTimerRunning(false);
  
    try {
      const correctAnswers = quizData.filter(q => q.correct_answer === answers[q.id]).length;
      const timeTaken = totaltime * 60 - remainingTime;
  
      const formData = new URLSearchParams();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
formData.append("university", userData.university);
formData.append("answers", JSON.stringify(answers));
formData.append("timeTaken", timeTaken);
formData.append("score", correctAnswers);
formData.append("totalQuestions", quizData.length);

await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
  method: "POST",
  body: formData
});
  
      
  
      
  
      setQuizResult({
        answers: answers,
        total: quizData.length,
        timeTaken: timeTaken
      });
  
      setCurrentScreen('thankYou');
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };
  

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <Login onLogin={handleLogin} />;
      case 'registration':
        return <Details onSubmit={handleRegistration} email={email} />;
      case 'quiz':
        return (
          <QuizInterface
            questions={quizData}
            onAnswerSelect={handleAnswerSelect}
            answers={answers}
            remainingTime={remainingTime} // Pass remaining time as a prop
            onSubmit={handleSubmit}
          />
        );
      case 'thankYou':
        return <ThankYou result={quizResult} userData={userData} />;
      default:
        return <Login />;
    }
  };

  return (
    <Layout>
      <div className="app-container">
        {renderScreen()}
      </div>
    </Layout>
  );
}

export default App;
