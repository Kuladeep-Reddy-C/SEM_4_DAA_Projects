// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase } from 'react-icons/fa';

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <FaBriefcase className="logo-icon" />
            <span>ATS</span>Score<span>Pro</span>
          </Link>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/upload">Upload Resume</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;