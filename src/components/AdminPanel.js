import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { CSVLink } from 'react-csv';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function AdminPanel() {
  const [submissions, setSubmissions] = useState([]);
  const [timerDuration, setTimerDuration] = useState(30); // Default timer duration in minutes

  // Fetch all quiz submissions
  useEffect(() => {
    const fetchSubmissions = async () => {
      const { data, error } = await supabase.from('quiz_submissions').select('*');
      if (error) {
        console.error('Error fetching submissions:', error);
      } else {
        setSubmissions(data);
      }
    };

    fetchSubmissions();
  }, []);

  // Export as XLSX
  const exportAsXLSX = () => {
    const worksheet = XLSX.utils.json_to_sheet(submissions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Submissions');
    XLSX.writeFile(workbook, 'quiz_submissions.xlsx');
  };

  // Export as PDF
  const exportAsPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ['Name', 'Phone', 'Score', 'Time Taken', 'Answers'];
    const tableRows = submissions.map((submission) => [
      submission.name,
      submission.phone,
      submission.score,
      submission.time_taken,
      JSON.stringify(submission.answers),
    ]);

    doc.text('Quiz Submissions', 14, 16);
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
    });
    doc.save('quiz_submissions.pdf');
  };

  // Handle timer duration change
  const handleTimerChange = (e) => {
    setTimerDuration(e.target.value);
  };

  // Save timer duration to database or state
  const saveTimerDuration = async () => {
    // Save the timer duration to a database or global state
    alert(`Timer duration set to ${timerDuration} minutes.`);
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>

      <div className="timer-settings">
        <h2>Set Quiz Timer</h2>
        <input
          type="number"
          value={timerDuration}
          onChange={handleTimerChange}
          min="1"
          max="120"
        />
        <button onClick={saveTimerDuration}>Save Timer</button>
      </div>

      <div className="submissions">
        <h2>Quiz Submissions</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Score</th>
              <th>Time Taken</th>
              <th>Answers</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.name}</td>
                <td>{submission.phone}</td>
                <td>{submission.score}</td>
                <td>{submission.time_taken}</td>
                <td>{JSON.stringify(submission.answers)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="export-buttons">
        <h2>Export Submissions</h2>
        <button>
          <CSVLink data={submissions} filename="quiz_submissions.csv">
            Export as CSV
          </CSVLink>
        </button>
        <button onClick={exportAsXLSX}>Export as XLSX</button>
        <button onClick={exportAsPDF}>Export as PDF</button>
      </div>
    </div>
  );
}

export default AdminPanel;