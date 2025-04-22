// utils/supabase.js
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = 'https://emtdmqduqzryesxergee.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtdGRtcWR1cXpyeWVzeGVyZ2VlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NDkyNTEsImV4cCI6MjA2MDUyNTI1MX0.UeAvGYaCdl7ZuwotyHA5Q-_dGnuhI7Lreu7mejFk5jU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKJuHuQ4lepMDejWqYZayufcqsypOTmQmSRxQR1x9mIV4a9IObbq4FM8AWQ1oC5k1vztdfVKOGxTu7/pub?gid=107410889&single=true&output=csv';

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