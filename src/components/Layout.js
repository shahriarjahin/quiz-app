// src/components/Layout.js
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './Layout.css';
import eventLogo from '../assets/event-logo.png'; // Add your logo file
import sponsorLogo from '../assets/sponsor-logo.png'; // Add your logo file
import adminIcon from '../assets/admin-icon.png'; // Add your admin icon here

function Layout({ children }) {
  const navigate = useNavigate(); // Initialize navigation

  const handleAdminLogin = () => {
    navigate('/admin'); // Navigate to the AdminLogin page
  };

  return (
    <div className="layout-container">
      <header className="app-header">
        <img src={eventLogo} alt="Event Logo" className="event-logo" />

        {/* Toggle Button in Header */}
        <button
          className="toggle-button"
          onClick={handleAdminLogin}
          title="Go to Admin Login"
        >
          <img src={adminIcon} alt="Admin Login" />
        </button>
      </header>

      <main className="app-content">{children}</main>

      <footer className="app-footer">
        <div className="powered-by">
          Powered by
          <img src={sponsorLogo} alt="Sponsor Logo" className="sponsor-logo" />
        </div>
      </footer>
    </div>
  );
}

export default Layout;