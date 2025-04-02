import React from 'react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} ATSScorePro. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
