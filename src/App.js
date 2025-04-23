// src/App.js
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Details from './components/Details';
import QuizInterface from './components/QuizInterface';
import ThankYou from './components/ThankYou';
import Login from './components/login';
import AdminPanel from './components/AdminPanel';
import { supabase, fetchQuestionsFromGoogleSheet } from './utils/supabase';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userData, setUserData] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timerRunning, setTimerRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(30 * 60); // 30 minutes in seconds
  const [quizResult, setQuizResult] = useState(null);
  const [email, setEmail] = useState('');

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      const startTime = Date.now();
      const intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const timeLeft = 30 * 60 - elapsed; // Calculate remaining time
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
      const { data: existingSubmission, error } = await supabase
        .from('quiz_submissions')
        .select('phone')
        .eq('phone', data.phone)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking for duplicate submission:', error);
        alert('An error occurred while checking your registration. Please try again.');
        return;
      }

      if (existingSubmission) {
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

      const { data, error } = await supabase
        .from('quiz_submissions')
        .insert([
          {
            phone: userData.phone,
            name: userData.name,
            university: userData.university,
            answers: answers,
            time_taken: 30 * 60 - remainingTime, // Calculate time taken
            score: correctAnswers,
            total_questions: quizData.length
          }
        ]);

      if (error) throw error;

      setQuizResult({
        answers: answers,
        total: quizData.length,
        timeTaken: 30 * 60 - remainingTime
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
      case 'admin':
        return <AdminPanel />;
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