import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import './CreatePaper.css';
import jsPDF from "jspdf";
import htmlDocx from "html-docx-js/dist/html-docx";
import { useParams, useNavigate } from 'react-router-dom';
const CreatePaper = () => {
      const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [unitDetails, setUnitDetails] = useState({ unit: '', numberOfQuestions: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [previewData, setPreviewData] = useState(null);  // New state to hold the preview data
  const [paperId, setPaperId] = useState(null);  // To store the generated paper ID
  const [courseCode, setCourseCode] = useState('');  // State for course code
  const [courseName, setCourseName] = useState('');  // State for course name
  const [examDate, setExamDate] = useState('');  // State for exam date
  const [examTime, setExamTime] = useState('');  // State for exam time
  const [maxMarks, setMaxMarks] = useState('');  // State for max marks

    const generatePDF = () => {
    const doc = new jsPDF();

    // Set title
    doc.text(previewData.courseName, 20, 20);
    doc.text(`Exam Date: ${previewData.examDate}`, 20, 30);
    doc.text(`Time: ${previewData.examTime}`, 20, 40);
    doc.text(`Max Marks: ${previewData.maxMarks}`, 20, 50);

    let y = 60;
    previewData.questions.forEach((q, index) => {
      doc.text(`Unit ${q.unit}`, 20, y);
      y += 10;
      doc.text(`Question: ${q.question}`, 20, y);
      doc.text(`CO: ${q.co}`, 20, y + 10);
      doc.text(`Level: ${q.level}`, 20, y + 20);
      doc.text(`Marks: ${q.marks}`, 20, y + 30);
      y += 40;
    });

    doc.save("question-paper.pdf");
  };


   const generateWord = () => {
    const htmlContent = `
      <h1>${previewData.courseName}</h1>
      <p>Exam Date: ${previewData.examDate}</p>
      <p>Time: ${previewData.examTime}</p>
      <p>Max Marks: ${previewData.maxMarks}</p>
      ${previewData.questions.map((q) => `
        <h3>Unit ${q.unit}</h3>
        <p><strong>Question:</strong> ${q.question}</p>
        <p><strong>CO:</strong> ${q.co}</p>
        <p><strong>Level:</strong> ${q.level}</p>
        <p><strong>Marks:</strong> ${q.marks}</p>
      `).join('')}
    `;

    const converted = htmlDocx.asBlob(htmlContent);
    const link = document.createElement("a");
    link.href = URL.createObjectURL(converted);
    link.download = "question-paper.docx";
    link.click();
  };



  // Handle changes in unitDetails
  const handleUnitDetailsChange = (field, value) => {
    setUnitDetails({ ...unitDetails, [field]: value });
  };

  const validateInput = () => {
    // Check if the number of questions is valid
    if (unitDetails.numberOfQuestions < 0) {
      setErrorMessage('Number of questions cannot be negative.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  const addQuestions = () => {
    if (!validateInput()) return;

    const newQuestions = Array.from({ length: unitDetails.numberOfQuestions }, () => ({
      unit: unitDetails.unit,
      co: '',
      level: '',
      marks: '',
      question: ''
    }));
    setQuestions([...questions, ...newQuestions]);
    setUnitDetails({ unit: '', numberOfQuestions: '' });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = questions.map((q, i) =>
      i === index ? { ...q, [field]: value } : q
    );
    setQuestions(newQuestions);
  };

  const renderQuestions = () => {
    let currentUnit = '';
    return questions.map((question, index) => {
      const isLastInUnit = index === questions.length - 1 || questions[index + 1].unit !== question.unit;
      return (
        <div key={index} className="unit-questions">
          {currentUnit !== question.unit && (
            <div>
              <h3>Unit: {question.unit}</h3>
              {currentUnit = question.unit}
            </div>
          )}
          <label>
            Course Outcome:
            <select value={question.co} onChange={(e) => handleQuestionChange(index, 'co', e.target.value)}>
              <option value="">Select CO</option>
              <option value="CO1">CO1</option>
              <option value="CO2">CO2</option>
              <option value="CO3">CO3</option>
              <option value="CO4">CO4</option>
              <option value="CO5">CO5</option>
            </select>
          </label>
          <label>
            Level:
            <select value={question.level} onChange={(e) => handleQuestionChange(index, 'level', e.target.value)}>
              <option value="">Select Level</option>
              <option value="K1">K1 (Easy)</option>
              <option value="K2">K2 (Medium)</option>
              <option value="K3">K3 (Hard)</option>
            </select>
          </label>
          <label>
            Marks:
            <input type="number" value={question.marks} onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)} />
          </label>
          <label>
            Question:
            <textarea value={question.question} className="question" onChange={(e) => handleQuestionChange(index, 'question', e.target.value)} />
          </label>
          {isLastInUnit && <hr className="unit-divider" />}
        </div>
      );
    });
  };

  // Handle form submission (creating the paper)
  const generatePaper = async () => {
  const paperData = {
    courseCode,
    courseName,
    examDate,
    examTime,
    maxMarks,
    questions,
  };

  console.log("Sending paper data:", paperData);  // Add this line to log the data being sent

  try {
    const response = await fetch('http://localhost:5000/api/create-paper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paperData),
    });

    const data = await response.json();
    if (response.ok) {
      setPaperId(data.courseCode);  // Set the paperId if the paper was successfully created
      alert('Paper generated successfully!');
    } else {
      alert('Failed to generate paper');
    }
  } catch (err) {
    console.error('Error generating paper:', err);
  }
};


  // Preview Paper
  const previewPaper = async () => {
    if (!courseCode) {
      alert("Course Code is required for preview");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/preview-paper/${courseCode}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to fetch preview: ${errorData.message}`);
        return;
      }

      const paper = await response.json();
      setPreviewData(paper);
      console.log("Paper preview retrieved successfully:", paper);
    } catch (error) {
      console.error("Error fetching paper for preview:", error);
      alert(`Error fetching paper for preview: ${error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="create-paper">
        <h1>Create Paper</h1>
        <div className="paper-details">
          <label>
            Course Code:
            <input 
              type="text" 
              value={courseCode} 
              onChange={(e) => setCourseCode(e.target.value)}  // Update courseCode state
            />
          </label>
          <label>
            Course Name:
            <input 
              type="text" 
              value={courseName} 
              onChange={(e) => setCourseName(e.target.value)}  // Update courseName state
            />
          </label>
          <label>
            Date of Exam:
            <input 
              type="date" 
              value={examDate} 
              onChange={(e) => setExamDate(e.target.value)}  // Update examDate state
            />
          </label>
          <label>
            Time:
            <input 
              type="text" 
              value={examTime} 
              onChange={(e) => setExamTime(e.target.value)}  // Update examTime state
            />
          </label>
          <label>
            Max Marks:
            <input 
              type="number" 
              value={maxMarks} 
              onChange={(e) => setMaxMarks(e.target.value)}  // Update maxMarks state
            />
          </label>
        </div>

        <div className="unit-section">
          <h2>Add Questions by Unit</h2>
          <label>
            Unit:
            <select value={unitDetails.unit} onChange={(e) => handleUnitDetailsChange('unit', e.target.value)}>
              <option value="">Select Unit</option>
              <option value="1">Unit 1</option>
              <option value="2">Unit 2</option>
              <option value="3">Unit 3</option>
              <option value="4">Unit 4</option>
              <option value="5">Unit 5</option>
            </select>
          </label>
          <label>
            Number of Questions:
            <input 
              type="number" 
              value={unitDetails.numberOfQuestions} 
              onChange={(e) => handleUnitDetailsChange('numberOfQuestions', e.target.value)} 
            />
          </label>

          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
          <button onClick={addQuestions}>Add Questions</button>
        </div>

        <div className="questions-section">
          <h2>Questions</h2>
          {renderQuestions()}
        </div>

        <div className="preview-generate">
          <button onClick={generatePaper}>Generate Paper</button>
          <button onClick={previewPaper}>Preview Paper</button>
        </div>

        {previewData && (
          <div className="preview-paper">
            <h2>Preview Paper</h2>
            <div>
              <h3>{previewData.courseName}</h3>
              <p>Exam Date: {previewData.examDate}</p>
              <p>Time: {previewData.examTime}</p>
              <p>Max Marks: {previewData.maxMarks}</p>

              {previewData.questions.map((q, index) => (
                <div key={index}>
                  <p>Question: {q.question}</p>
                  <p>CO: {q.co}</p>
                  <p>Level: {q.level}</p>
                  <p>Marks: {q.marks}</p>
                </div>
              ))}
               <div className="preview-generate">
            <button onClick={generatePDF}>Convert to PDF</button>
            <button onClick={generateWord}>Convert to Word</button>
          </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePaper;
