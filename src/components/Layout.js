// src/components/Layout.js
import React from 'react';
import './Layout.css';
import eventLogo from '../assets/event-logo.png'; // You'll need to add your logo file
import sponsorLogo from '../assets/sponsor-logo.png'; // You'll need to add your logo file
import organizerLogo from '../assets/organizer-logo.png'; // You'll need to add your logo file
import headerLogo from '../assets/header-logo.png';
function Layout({ children }) {
  return (
    <div className="layout-container">
      <header className="app-header">
      
        <img src={headerLogo} alt="Event Logo" className="event-logo" />
      </header>
      
      <main className="app-content">
        {children}
      </main>
      
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