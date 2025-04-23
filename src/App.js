// src/App.js
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Details from './components/Details';
import QuizInterface from './components/QuizInterface';
import ThankYou from './components/ThankYou';
import Login from './components/login';
import { supabase, fetchQuestionsFromGoogleSheet } from './utils/supabase';
import axios from 'axios';
import './App.css';
import { GOOGLE_SHEETS_Submitted_CSV_URL } from './utils/supabase'; // Ensure this path is correct
function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userData, setUserData] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [email, setEmail] = useState('');

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

  // Start timer when quiz begins
  useEffect(() => {
    let intervalId;
    
    if (timerRunning) {
      intervalId = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [timerRunning]);

  // Handle user registration
  const handleRegistration = async (data) => {
    try {
      // Check for duplicate submission in the Supabase database
      const { data: existingSubmission, error } = await supabase
        .from('quiz_submissions') // Replace with your actual table name
        .select('phone')
        .eq('phone', data.phone)
        .single(); // Fetch a single matching record

      if (error && error.code !== 'PGRST116') { // Ignore "no rows found" error
        console.error('Error checking for duplicate submission:', error);
        alert('An error occurred while checking your registration. Please try again.');
        return;
      }

      if (existingSubmission) {
        alert('You have already submitted.');
        return; // Stop further execution
      }

      // If no duplicate, proceed with registration
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
      // Calculate results (optional)
      const correctAnswers = quizData.filter(q => q.correct_answer === answers[q.id]).length;
      
      // Store submission in Supabase
      const { data, error } = await supabase
        .from('quiz_submissions')
        .insert([
          {
            phone: userData.phone,
            name: userData.name,
            university: userData.university,
            answers: answers,
            time_taken: timeElapsed,
            score: correctAnswers,
            total_questions: quizData.length
          }
        ]);
      
      if (error) throw error;

      setQuizResult({
        answers: answers,
        total: quizData.length,
        timeTaken: timeElapsed
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
            timeElapsed={timeElapsed}
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