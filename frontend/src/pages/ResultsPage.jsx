import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import ScoreDisplay from '../components/ScoreDisplay';
import SkillsDisplay from '../components/SkillsDisplay';
import ResumePreview from '../components/ResumePreview';
import Suggestions from '../components/Suggestions';

function ResultsPage({ results }) {
  // If no results, redirect to upload page
  if (!results) {
    return <Navigate to="/upload" />;
  }
  
  return (
    <div className="results-page">
      <div className="container">
        <div className="page-header">
          <h1>Resume Analysis Results</h1>
          <p>
            Here's how your resume stacks up against the requirements for your selected position.
          </p>
        </div>
        
        <div className="results-container">
          <div className="results-grid">
            <div className="results-column score-column">
              <ScoreDisplay score={results.ats_score} />
              
              <div className="score-stats">
                <div className="stat-item">
                  <span className="stat-label">Matched Skills</span>
                  <span className="stat-value">{results.matched_count} / {results.total_skills}</span>
                </div>
              </div>
              
              <div className="action-buttons">
                <Link to="/upload" className="secondary-button">
                  Analyze Another Resume
                </Link>
              </div>
            </div>
            
            <div className="results-column details-column">
              <div className="results-section">
                <SkillsDisplay 
                  matched={results.matched_skills} 
                  unmatched={results.unmatched_skills}
                  keywordDensity={results.keyword_density}
                />
              </div>
              
              <div className="results-section">
                <Suggestions 
                  suggestions={results.suggestions}
                  mncMentions={results.mnc_mentions}
                />
              </div>
              
              <div className="results-section">
                <ResumePreview highlightedText={results.highlighted_text} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;