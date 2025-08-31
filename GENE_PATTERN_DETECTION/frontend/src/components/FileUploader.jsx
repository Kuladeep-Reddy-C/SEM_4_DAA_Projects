import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../index.css';

const FileUploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [fileContent, setFileContent] = useState(null);
  const [error, setError] = useState(null);

  // Base URL for API calls
  const API_BASE_URL = 'http://localhost:5000/api/files';

  // Fetch files on component mount
  useEffect(() => {
    fetchFiles();
  }, []);

  // Fetch list of files
  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/list`);
      setFiles(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch files');
      console.error(err);
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Reset file selection and refresh file list
      setSelectedFile(null);
      fetchFiles();
      setError(null);
    } catch (err) {
      setError('File upload failed');
      console.error(err);
    }
  };

  // Read file content
  const handleReadFile = async (fileId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/read/${fileId}`);
      setFileContent(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to read file');
      console.error(err);
    }
  };

  // Delete file
  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`${API_BASE_URL}/delete/${fileId}`);
      fetchFiles();
      // Clear file content if deleted file was being viewed
      if (fileContent && fileContent.filename) {
        setFileContent(null);
      }
      setError(null);
    } catch (err) {
      setError('Failed to delete file');
      console.error(err);
    }
  };

  return (
    <div className="file-uploader">
      {/* File Upload Section */}
      <div className="upload-section">
        <input 
          type="file" 
          onChange={handleFileSelect}
        />
        <button 
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Upload
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Files List */}
      <div className="files-list">
        <h2>Uploaded Files</h2>
        {files.length === 0 ? (
          <p>No files uploaded yet</p>
        ) : (
          <ul>
            {files.map((file) => (
              <li key={file._id}>
                <span>{file.filename}</span>
                <div>
                  <button onClick={() => handleReadFile(file._id)}>
                    Read File
                  </button>
                  <button onClick={() => handleDeleteFile(file._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* File Content Display */}
      {fileContent && (
        <div className="file-content">
          <h3>File Content: {fileContent.filename}</h3>
          <pre>{fileContent.content}</pre>
        </div>
      )}
    </div>
  );
};

export default FileUploader;