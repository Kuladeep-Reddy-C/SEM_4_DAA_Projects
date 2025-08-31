import React from 'react';
import UploadForm from '../components/UploadForm';

function UploadPage({ setResumeResults }) {
  return (
    <div className="upload-page">
      <div className="container">
        <div className="page-header">
          <h1>Upload Your Resume</h1>
          <p>
            Let our AI analyze your resume against MNC job requirements 
            and provide you with an ATS score and improvement suggestions.
          </p>
        </div>
        
        <div className="upload-container">
          <UploadForm setResumeResults={setResumeResults} />
        </div>
      </div>
    </div>
  );
}

export default UploadPage;