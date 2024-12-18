import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Navbar from '../components/Navbar';
import './Dashboard.css';

const Dashboard = () => {
  const [userName, setUserName] = useState(''); // State to store user's name
  const [showTips, setShowTips] = useState(false); // State to toggle the tips dropdown visibility
  const navigate = useNavigate(); // Initialize the navigate function

  // Fetch user info (in a real scenario, this could come from an API or context)
  



  // Toggle the visibility of the tips dropdown
  const toggleTips = () => {
    setShowTips(!showTips);
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-content">
        <h1 className="welcome">Welcome to the Question Paper Generator!</h1>
        
        <div className="action-buttons">
          <button onClick={() => navigate('/question-banks')}>Manage Question Banks</button>
        </div>

        {/* Tips Dropdown */}
        <div className="tips-section">
          <button className="tips-toggle-button" onClick={toggleTips}>
            {showTips ? 'Hide Tips' : 'Tips'}
          </button>

          {showTips && (
            <div className="tips-card">
              <h3>Helpful Tips</h3>
              <ul>
                <li>Check the preview of papers before generating .</li>
                <li>You can generate random papers by selecting their difficulty levels and marks .</li>
                <li>Ensure to review the paper before publishing to avoid mistakes.</li>
                <li>Go through the createPaper to create your own paper </li>
                <li>Don't leave the page untill paper is paper the history will not be saved</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
