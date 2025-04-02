import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaChartBar, FaLightbulb, FaCloudUploadAlt } from 'react-icons/fa';
import axios from 'axios';

function HomePage() {
  const [mncs, setMncs] = useState([]);
  
  useEffect(() => {
    // Fetch MNCs from the API
    const fetchMncs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/mncs');
        setMncs(response.data);
      } catch (error) {
        console.error('Error fetching MNCs:', error);
      }
    };
    
    fetchMncs();
  }, []);
  
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <h1>Optimize Your Resume for Top MNCs</h1>
          <p>
            Our AI-powered ATS Score Calculator analyzes your resume against job requirements 
            for leading multinational corporations. Get instant feedback and suggestions to improve 
            your chances of landing your dream job.
          </p>
          <Link to="/upload" className="cta-button">
            <FaCloudUploadAlt className="button-icon" />
            Analyze Your Resume Now
          </Link>
          
          <div className="company-logos">
            {mncs.map((company, index) => (
              <div key={index} className="company-logo">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="features-section">
        <div className="container">
          <h2 className="features-title">Why Use ATSScorePro?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FaRocket />
              </div>
              <h3 className="feature-title">Boost Your Application</h3>
              <p className="feature-desc">
                Increase your chances of getting past the initial ATS screening 
                by optimizing your resume for specific job positions.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaChartBar />
              </div>
              <h3 className="feature-title">Detailed Analysis</h3>
              <p className="feature-desc">
                Get a comprehensive breakdown of your resume's strengths and weaknesses, 
                including matched and missing skills.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <FaLightbulb />
              </div>
              <h3 className="feature-title">Smart Suggestions</h3>
              <p className="feature-desc">
                Receive personalized recommendations to improve your resume 
                for specific multinational corporations and job positions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;