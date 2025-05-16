import React from 'react';
import './Footer.scss';


const Footer = () => {
  return (
    <footer className="admin-footer">
      <p>© {new Date().getFullYear()} BQOMIS. All rights reserved.</p>
    </footer>
  );
};

export default Footer;