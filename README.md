# Quiz App

This is a React-based Quiz Application that allows users to answer questions, navigate between them, and submit their answers. The app tracks the total number of answered questions and records the submission in a Supabase database.

## Features

- **Dynamic Question Navigation**: Users can navigate between questions using "Previous" and "Next" buttons or by clicking on question dots.
- **Answer Selection**: Users can select answers for each question, which are visually highlighted.
- **Submit Quiz**: The quiz can be submitted once at least one question is answered.
- **Progress Tracking**: Displays the current question number and total questions.
- **Timer**: Tracks the elapsed time during the quiz and automatically submits the quiz when time runs out.
- **Cheating Detection**: Detects tab switching or restricted actions (e.g., right-click, copy-paste) and auto-submits the quiz.
- **Loading Screen**: Displays a loading screen during quiz submission.
- **Database Integration**: Records the total number of answered questions and quiz results in a Supabase database.

---

## Installation Guide

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/quiz-app.git
   ```

2. Navigate to the project directory:
   ```bash
   cd quiz-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`.

5. Build for production:
   ```bash
   npm run build
   ```
   The production-ready files will be in the `build/` directory.

---

## Project Structure

### Components

#### `QuizInterface.js`
This is the main component of the application. It handles the quiz logic, navigation, and submission.

- **Props**:
  - `questions`: An array of question objects containing the question text, options, and IDs.
  - `onAnswerSelect`: A callback function to handle answer selection.
  - `answers`: An object storing the user's selected answers.
  - `remainingTime`: The remaining time for the quiz (in seconds).
  - `onSubmit`: A callback function to handle quiz submission.

- **Functions**:
  - `formatTime(timeInSeconds)`: Converts seconds into `MM:SS` format for the timer.
  - `goToNextQuestion()`: Navigates to the next question if available.
  - `goToPreviousQuestion()`: Navigates to the previous question if available.
  - `handleOptionSelect(option)`: Handles the selection of an answer for the current question.
  - `handleSubmit()`: Submits the quiz and records the total answered questions in the Supabase database.

#### `Details.js`
Handles user registration and displays user details fetched from a Google Sheets CSV file.

#### `ThankYou.js`
Displays the quiz results, including the score and time taken.

---

## Supabase Integration

The app uses Supabase to store quiz submissions. The `quiz_submissions` table includes the following columns:

- `id`: Primary key (auto-increment or UUID).
- `total_answered`: Integer to store the total number of answered questions.
- `submitted_at`: Timestamp to record when the quiz was submitted.
- `score`: Integer to store the user's score.
- `time_taken`: Integer to store the time taken to complete the quiz.

#### Supabase Client Setup
The Supabase client is initialized in `supabase.js`:
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

## Available Scripts

In the project directory, you can run:

- `npm start`: Runs the app in development mode. Open `http://localhost:3000` to view it in your browser.
- `npm test`: Launches the test runner in interactive watch mode.
- `npm run build`: Builds the app for production to the `build/` folder.

---

## How to Use

1. **Start the App**: Run `npm start` to launch the app in development mode.
2. **Answer Questions**:
   - Navigate between questions using the "Previous" and "Next" buttons.
   - Click on an option to select your answer.
3. **Submit the Quiz**:
   - The "Submit Quiz" button becomes active after answering at least one question.
   - Click "Submit Quiz" to save your submission in the Supabase database.
4. **View Results**:
   - The app records the total number of answered questions, score, and time taken in the `quiz_submissions` table.

---

## Future Enhancements

- Add user authentication to track individual quiz submissions.
- Display detailed results after submission.
- Add support for multiple quizzes with unique IDs.
- Implement a leaderboard to rank users based on their performance.

---

## License

This project is licensed under the MIT License. Feel free to use and modify it as needed.