import React from 'react';
import { FaLightbulb } from 'react-icons/fa';

function Suggestions({ suggestions, mncMentions }) {
  return (
    <div className="suggestions">
      <h3 className="suggestions-title">
        <FaLightbulb className="suggestion-icon" /> 
        Improvement Suggestions
      </h3>
      
      {suggestions.map((suggestion, index) => (
        <div key={index} className="suggestion-item">
          {suggestion}
        </div>
      ))}
      
      {mncMentions.length > 0 ? (
        <div className="suggestion-item positive">
          Great! Your resume mentions the following MNCs: {mncMentions.join(', ')}. 
          This can improve your chances of getting noticed.
        </div>
      ) : (
        <div className="suggestion-item">
          Consider adding relevant experience with well-known MNCs if you have any. 
          Recruiters often look for candidates with experience at recognized companies.
        </div>
      )}
      
      <div className="suggestion-item">
        Make sure your resume is properly formatted and easy to read. 
        ATS systems sometimes struggle with complex layouts or graphics.
      </div>
    </div>
  );
}

export default Suggestions;