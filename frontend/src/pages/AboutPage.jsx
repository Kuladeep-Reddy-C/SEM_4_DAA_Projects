import React from 'react';
import { Link } from 'react-router-dom';

function AboutPage() {
  return (
    <div className="about-page">
      <div className="container">
        <div className="page-header">
          <h1>About ATSScorePro</h1>
        </div>
        
        <div className="about-content">
          <p>
            ATSScorePro is a specialized tool designed to help job seekers optimize their resumes 
            for Applicant Tracking Systems (ATS) used by multinational corporations.
          </p>
          
          <h2>How It Works</h2>
          <p>
            Our system uses advanced text analysis and the Boyer-Moore string matching algorithm 
            to identify skills and qualifications in your resume that match the requirements of 
            your target job position. We calculate an ATS score based on how well your resume 
            matches these requirements.
          </p>
          
          <h2>Features</h2>
          <ul>
            <li>Resume analysis for multiple job positions</li>
            <li>Detailed breakdown of matched and missing skills</li>
            <li>Keyword density analysis</li>
            <li>MNC-specific optimization suggestions</li>
            <li>Resume highlighting to show where skills are mentioned</li>
          </ul>
          
          <h2>Privacy Policy</h2>
          <p>
            We take your privacy seriously. All uploaded resumes are processed securely and are 
            not stored on our servers after analysis. Your resume data is used only for the purpose 
            of providing you with an ATS score and improvement suggestions.
          </p>
          
          <div className="cta-container">
            <Link to="/upload" className="cta-button">
              Try It Now
            </Link>
          </div>
        </div>

        <div className="footer">
          <p>&copy; 2025 ATSScorePro. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
