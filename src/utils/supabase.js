// utils/supabase.js
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = 'https://emtdmqduqzryesxergee.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdGRtcWR1cXpyeWVzeGVyZ2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDkyNTEsImV4cCI6MjA2MDUyNTI1MX0.UeAvGYaCdl7ZuwotyHA5Q-_dGnuhI7Lreu7mejFk5jU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const GOOGLE_SHEETS_Users_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKJuHuQ4lepMDejWqYZayufcqsypOTmQmSRxQR1x9mIV4a9IObbq4FM8AWQ1oC5k1vztdfVKOGxTu7/pub?gid=107410889&single=true&output=csv';
export const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyx28u7TzpXidwXXWDxpoK90PMVUeUjGuzwOT0VHVQOPRH-3lmEF5s3sJMOCFmHd8yS2A/exec';
export const GOOGLE_SHEETS_Submitted_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKJuHuQ4lepMDejWqYZayufcqsypOTmQmSRxQR1x9mIV4a9IObbq4FM8AWQ1oC5k1vztdfVKOGxTu7/pub?gid=60723607&single=true&output=csv';
export const GOOGLE_SHEETS_Questions_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKJuHuQ4lepMDejWqYZayufcqsypOTmQmSRxQR1x9mIV4a9IObbq4FM8AWQ1oC5k1vztdfVKOGxTu7/pub?gid=1560799684&single=true&output=csv';

export const checkUserRegistration = async (phone) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('phone')
      .eq('phone', phone);

    if (error) {
      console.error('Error checking registration:', error);
      return false;
    }

    return data.length > 0;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
};

export const fetchQuestionsFromGoogleSheet = async () => {
  try {
    const response = await axios.get(GOOGLE_SHEETS_Questions_CSV_URL);
    const csvData = response.data;

    // Parse CSV data into an array of questions
    const rows = csvData.split('\n').map(row => row.split(','));
    const questions = rows.map(([id, question, option1, option2, option3, option4, correctAnswer]) => ({
      id: id.trim(),
      question: question.trim(),
      correct_answer: correctAnswer.trim(),
      options: [option1, option2, option3, option4].map(option => option.trim()).filter(option => option),
    }));

    return questions;
  } catch (error) {
    console.error('Error fetching questions from Google Sheet:', error);
    return [];
  }
};