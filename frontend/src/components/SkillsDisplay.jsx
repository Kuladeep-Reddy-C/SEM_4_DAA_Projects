import React from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';

function SkillsDisplay({ matched, unmatched, keywordDensity }) {
  return (
    <div className="skills-list">
      <div className="skills-column matched-skills">
        <h3 className="skills-title">
          <FaCheck className="skill-icon" />
          Matched Skills ({matched.length})
        </h3>
        <div className="skills-container">
          {matched.map((skill) => (
            <span key={skill} className="skill-tag matched">
              {skill}
              {keywordDensity && keywordDensity[skill] && (
                <small className="density"> ({keywordDensity[skill].toFixed(1)}%)</small>
              )}
            </span>
          ))}
          {matched.length === 0 && (
            <p className="no-skills">No matched skills found.</p>
          )}
        </div>
      </div>
      
      <div className="skills-column unmatched-skills">
        <h3 className="skills-title">
          <FaTimes className="skill-icon" />
          Missing Skills ({unmatched.length})
        </h3>
        <div className="skills-container">
          {unmatched.map((skill) => (
            <span key={skill} className="skill-tag unmatched">
              {skill}
            </span>
          ))}
          {unmatched.length === 0 && (
            <p className="no-skills">No missing skills! Great job!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SkillsDisplay;