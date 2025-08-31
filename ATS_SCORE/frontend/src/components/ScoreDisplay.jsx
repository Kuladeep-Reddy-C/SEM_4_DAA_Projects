import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function ScoreDisplay({ score }) {
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745'; // Green for high score
    if (score >= 60) return '#17a2b8'; // Blue for medium score
    if (score >= 40) return '#fd7e14'; // Orange for low-medium score
    return '#dc3545'; // Red for low score
  };
  
  const scoreColor = getScoreColor(score);
  
  // Determine score description
  const getScoreDescription = (score) => {
    if (score >= 80) return "Excellent match! Your resume is well-aligned with the job requirements.";
    if (score >= 60) return "Good match. Your resume meets most of the job requirements.";
    if (score >= 40) return "Fair match. Consider improving your resume to better match the job requirements.";
    return "Low match. Your resume needs significant improvements to match the job requirements.";
  };
  
  return (
    <div className="score-display">
      <div className="score-circle-container">
        <CircularProgressbar
          value={score}
          text={`${Math.round(score)}%`}
          styles={buildStyles({
            pathColor: scoreColor,
            textColor: scoreColor,
            trailColor: '#f3f3f3'
          })}
        />
      </div>
      <h3 className="score-text">ATS Score</h3>
      <p className="score-desc">{getScoreDescription(score)}</p>
    </div>
  );
}

export default ScoreDisplay;