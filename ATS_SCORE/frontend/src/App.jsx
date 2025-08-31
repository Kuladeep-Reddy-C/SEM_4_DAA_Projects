// src/App.js - Main React Application

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import UploadPage from './pages/UploadPage';
import ResultsPage from './pages/ResultsPage';
import './App.css';

function App() {
  const [resumeResults, setResumeResults] = useState(null);
  
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route 
              path="/upload" 
              element={<UploadPage setResumeResults={setResumeResults} />} 
            />
            <Route 
              path="/results" 
              element={<ResultsPage results={resumeResults} />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
