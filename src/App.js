import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar"; // Ensure this import is correct
import CreatePaper from "./pages/createPaper";
import QuestionBank from "./pages/QuestionBank";
import RandomPaperGenerator from "./pages/RandomPaperGenerator";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes without Navbar */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/question-banks" element={<QuestionBank />} />
        <Route path="/create-paper" element={<CreatePaper />} />
        <Route path="/random-generate" element={<RandomPaperGenerator />} />

        {/* Routes with Navbar */}
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
            </>
          }
        />

        {/* Add other routes here that need the Navbar */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
