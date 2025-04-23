import axios from 'axios';
import {GOOGLE_SHEETS_WEB_APP_URL} from './supabase'; // Ensure this path is correct
 
async function appendDataToGoogleSheet(data) {
  try {
    const response = await axios.post(GOOGLE_SHEETS_WEB_APP_URL, data);
    console.log('Data appended successfully:', response.data);
  } catch (error) {
    console.error('Error appending data to Google Sheet:', error);
  }
}

export default appendDataToGoogleSheet;
