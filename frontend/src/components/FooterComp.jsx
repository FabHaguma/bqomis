import React from 'react';
import './styles/FooterComp.css'; 

const FooterComp = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Bank Queue Optimization. All rights reserved.</p>
                <nav className="footer-nav">
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/contact">Contact</a></li>
                        <li><a href="/privacy">Privacy Policy</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default FooterComp;