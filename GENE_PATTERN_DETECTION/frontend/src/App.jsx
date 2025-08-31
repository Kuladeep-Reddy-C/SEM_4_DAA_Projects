import React from 'react';
import FileUploader from './components/FileUploader';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className="container">
        <h1>File Upload Application</h1>
        <FileUploader />
      </div>
    </div>
  );
}

export default App;