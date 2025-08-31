import React from 'react';

function ResumePreview({ highlightedText }) {
  return (
    <div className="resume-preview">
      <h3 className="preview-title">Resume Preview with Highlighted Skills</h3>
      <div 
        className="preview-text"
        dangerouslySetInnerHTML={{ __html: highlightedText }}
      />
    </div>
  );
}

export default ResumePreview;