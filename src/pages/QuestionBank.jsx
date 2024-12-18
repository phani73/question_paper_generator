import React, { useState, useEffect } from 'react';
import './QuestionBanks.css';
import Navbar from "../components/Navbar"
import { useNavigate } from 'react-router-dom';

const QuestionBank = () => {
  const [questionBanks, setQuestionBanks] = useState([]);  // Initialize as an empty array
  const [file, setFile] = useState(null);
  const navigate =useNavigate();

  useEffect(() => {
    const fetchQuestionBanks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/question-banks');
        const data = await response.json();

        console.log('API response:', data);  // Log the response to check its structure

        if (Array.isArray(data)) {  // Ensure the data is an array
          setQuestionBanks(data);
        } else {
          console.error("Expected an array, but received:", data);
        }
      } catch (err) {
        console.error('Error fetching question banks:', err);
      }
    };

    fetchQuestionBanks();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/api/upload-question-bank', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Question bank uploaded successfully');
        setFile(null); // Clear file input
        // Refresh the list of question banks
        const updatedBanks = await response.json();
        setQuestionBanks(updatedBanks);
      } else {
        alert('Failed to upload question bank');
      }
    } catch (err) {
      console.error('Error uploading file:', err);
    }
  };

  const handleViewPdf = (pdfPath) => {
    window.open(pdfPath, '_blank');
  };

  return (
    <>
    <Navbar />
    <div className="question-banks">
      <h1>Question Banks</h1>

      {/* File upload section */}
      <div className="upload-section">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Question Bank</button>
      </div>

      {/* Display the list of uploaded question banks */}
      <div className="question-banks-list">
        {Array.isArray(questionBanks) && questionBanks.map((bank, index) => (
          <div key={index} className="question-bank-card">
            <img src={`http://localhost:5000/${bank.thumbnail}`} alt="Thumbnail" />
            <div className="card-info">
              <h3>{bank.filename}</h3>
              <button onClick={() => handleViewPdf(`http://localhost:5000/${bank.path}`)}>
                View Question Bank
              </button>
              
            </div>
           
          </div>
        ))}

      </div>
       <button onClick={() => navigate('/dashboard')}>Back</button>
    </div>
    </>
  );
};

export default QuestionBank;
