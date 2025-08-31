import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

function UploadForm({ setResumeResults }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [jobPosition, setJobPosition] = useState('software_developer');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [jobPositions, setJobPositions] = useState([]);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    // Fetch job positions from the API
    const fetchJobPositions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/job-positions');
        setJobPositions(response.data);
      } catch (error) {
        console.error('Error fetching job positions:', error);
      }
    };
    
    fetchJobPositions();
  }, []);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };
  
  const handleFileChange = (uploadedFile) => {
    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();
    
    if (!['pdf', 'txt'].includes(fileExtension)) {
      setError('Invalid file format. Only PDF and TXT files are allowed.');
      setFile(null);
      setFileName('');
      return;
    }
    
    setFile(uploadedFile);
    setFileName(uploadedFile.name);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_position', jobPosition);
    
    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setResumeResults(response.data);
      navigate('/results');
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.response?.data?.error || 'An error occurred while processing your resume.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
      >
        {!fileName ? (
          <>
            <div className="upload-icon">
              <FaCloudUploadAlt />
            </div>
            <div className="upload-text">
              <p>Drag & drop your resume here or <strong>browse files</strong></p>
              <p className="file-formats">Supported formats: PDF, TXT</p>
            </div>
          </>
        ) : (
          <div className="file-selected">
            <p className="file-name">{fileName}</p>
            <p className="file-status">Ready to analyze</p>
          </div>
        )}
        <input 
          type="file" 
          id="fileInput" 
          accept=".pdf,.txt" 
          onChange={(e) => handleFileChange(e.target.files[0])}
          style={{ display: 'none' }}
        />
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="job-select">
        <label htmlFor="jobPosition" className="select-label">
          Select Target Job Position at MNCs:
        </label>
        <select 
          id="jobPosition" 
          className="select-box"
          value={jobPosition}
          onChange={(e) => setJobPosition(e.target.value)}
        >
          {jobPositions.map(position => (
            <option key={position.id} value={position.id}>
              {position.name}
            </option>
          ))}
        </select>
      </div>
      
      <button 
        type="submit" 
        className={`upload-btn ${isLoading ? 'loading' : ''}`}
        disabled={isLoading || !file}
      >
        {isLoading ? (
          <>
            <FaSpinner className="spinner" /> 
            Processing Resume...
          </>
        ) : (
          'Analyze Resume for MNCs'
        )}
      </button>
    </form>
  );
}

export default UploadForm;