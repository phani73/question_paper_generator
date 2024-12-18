import React, { useState } from 'react';
import './RandomPaperGenerator.css';
import Navbar from '../components/Navbar';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import { jsPDF } from 'jspdf';

function RandomPaperGenerator() {
  // State declarations
  const [unit, setUnit] = useState(1);
  const [numQuestions, setNumQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState([]);
  const [marks, setMarks] = useState([]);
  const [questionTexts, setQuestionTexts] = useState([]);
  const [showQuestionInputs, setShowQuestionInputs] = useState(false);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [generatedPapers, setGeneratedPapers] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [numRandomQuestions, setNumRandomQuestions] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);

  // Event handlers
  const handleUnitChange = (e) => setUnit(e.target.value);
  const handleNumQuestionsChange = (e) => setNumQuestions(e.target.value);

  const handleSubmit = () => {
    setDifficulty(Array.from({ length: numQuestions }, () => 'k1'));
    setMarks(Array.from({ length: numQuestions }, () => 1));
    setQuestionTexts(Array.from({ length: numQuestions }, () => ''));
    setShowQuestionInputs(true);
  };

  const handleDifficultyChange = (index, e) => {
    const updatedDifficulty = [...difficulty];
    updatedDifficulty[index] = e.target.value;
    setDifficulty(updatedDifficulty);
  };

  const handleMarksChange = (index, e) => {
    const updatedMarks = [...marks];
    updatedMarks[index] = e.target.value;
    setMarks(updatedMarks);
  };

  const handleQuestionTextChange = (index, e) => {
    const updatedQuestions = [...questionTexts];
    updatedQuestions[index] = e.target.value;
    setQuestionTexts(updatedQuestions);
  };

  const handleGenerateQuestions = () => {
    const selectedQuestions = [];
    for (let i = 0; i < numQuestions; i++) {
      selectedQuestions.push({
        unit,
        question: questionTexts[i] || `Question ${i + 1} for Unit ${unit}`,
        difficulty: difficulty[i],
        marks: marks[i],
      });
    }
    setQuestions(selectedQuestions);
    setRandomQuestions([]);
    setShowDialog(true);
  };

  const handleDialogSubmit = () => {
    const selectedQuestions = [...questions];
    const totalMarksInt = parseInt(totalMarks, 10);

    const filteredQuestions = selectedQuestions.filter(q => q.marks <= totalMarksInt);
    const randomSelected = filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, numRandomQuestions);

    setRandomQuestions(randomSelected);
    setGeneratedPapers([...generatedPapers, ...randomSelected]);
    setShowDialog(false);
  };

  const convertToWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: generatedPapers.map(q => new Paragraph({
          children: [
            new TextRun({
              text: `${q.question} (Difficulty: ${q.difficulty}, Marks: ${q.marks})`,
              break: 1
            })
          ]
        }))
      }]
    });

    try {
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'GeneratedPaper.docx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating Word document:', error);
    }
  };

  const convertToPDF = () => {
    const doc = new jsPDF();

    // Define starting position
    let yPosition = 10;
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;

    generatedPapers.forEach((q, index) => {
        const questionText = `${index + 1}. ${q.question} (Difficulty: ${q.difficulty}, Marks: ${q.marks})`;

        // Split the question text into lines that fit within the page width
        const lines = doc.splitTextToSize(questionText, 180); // 180 is the width in mm
        doc.text(lines, margin, yPosition);

        // Update yPosition for the next question
        yPosition += lines.length * 10; // Adjust line height as needed

        // Check if the content exceeds the page height and add a new page if necessary
        if (yPosition + 20 > pageHeight) {
            doc.addPage();
            yPosition = 10; // Reset yPosition for new page
        }
    });

    doc.save('GeneratedPaper.pdf');
};


  return (
    <>
      <Navbar />
      <div className="random-paper-generator">
        <h2>Random Paper Generator</h2>

        <section className="input-section">
          <label>Unit:</label>
          <select value={unit} onChange={handleUnitChange}>
            <option value="1">Unit 1</option>
            <option value="2">Unit 2</option>
            <option value="3">Unit 3</option>
            <option value="4">Unit 4</option>
            <option value="5">Unit 5</option>
          </select>

          <label>Number of Questions:</label>
          <input type="number" value={numQuestions} onChange={handleNumQuestionsChange} />

          <button onClick={handleSubmit}>Submit</button>
        </section>

        {showQuestionInputs && (
          <section className="question-inputs">
            <h3>Enter Custom Questions, Difficulty, and Marks</h3>
            {Array.from({ length: numQuestions }).map((_, index) => (
              <div key={index} className="question-input">
                <label>Question {index + 1}</label>
                 <div>
      <label>Question Text:</label>
      <textarea
        rows="4"  // Set the height of the text area
        cols="50" // Set the width of the text area
        value={questionTexts[index]}
        onChange={(e) => handleQuestionTextChange(index, e)}
        placeholder="Enter your question here"
      />
    </div>

                <div>
                  <label>Difficulty:</label>
                  <select
                    value={difficulty[index]}
                    onChange={(e) => handleDifficultyChange(index, e)}
                  >
                    <option value="k1">k1</option>
                    <option value="k2">k2</option>
                    <option value="k3">k3</option>
                  </select>
                </div>

                <div>
                  <label>Marks:</label>
                  <input
                    type="number"
                    value={marks[index]}
                    onChange={(e) => handleMarksChange(index, e)}
                  />
                </div>
              </div>
            ))}

            <button onClick={handleGenerateQuestions}>Generate Questions</button>
          </section>
        )}

        {showDialog && (
          <>
            <div className="overlay"></div>
            <div className="dialog-box">
              <div className="dialog-content">
                <h3>Select Number of Random Questions</h3>
                <label>Number of Random Questions:</label>
                <input
                  type="number"
                  value={numRandomQuestions}
                  onChange={(e) => setNumRandomQuestions(e.target.value)}
                />
                <label>Total Marks:</label>
                <input
                  type="number"
                  value={totalMarks}
                  onChange={(e) => setTotalMarks(e.target.value)}
                />
                <button onClick={handleDialogSubmit}>Submit</button>
                <button onClick={() => setShowDialog(false)}>Cancel</button>
              </div>
            </div>
          </>
        )}

        <section className="generated-questions">
          <h3>Generated Questions</h3>
          {questions.map((q, index) => (
            <p key={index}>
              {q.unit}. {q.question} (Difficulty: {q.difficulty}, Marks: {q.marks})
            </p>
          ))}
        </section>

        <section className="randomly-selected-questions">
          <h3>Randomly Selected Questions</h3>
          {randomQuestions.map((q, index) => (
            <p key={index}>
              {q.unit}. {q.question} (Difficulty: {q.difficulty}, Marks: {q.marks})
            </p>
          ))}
        </section>

        <section className="generated-papers">
          <h3>Generated Papers</h3>
          {generatedPapers.length > 0 && (
            <>
              <button onClick={convertToWord}>Download as Word</button>
              <button onClick={convertToPDF}>Download as PDF</button>
            </>
          )}
        </section>
      </div>
    </>
  );
}

export default RandomPaperGenerator;
