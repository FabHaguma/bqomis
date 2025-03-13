import React from 'react';
import logo from '../assets/bqomis-logo.jpeg';

const LeftsideNav = () => {
      return (
        <aside className="sidebar">
          <div className="logo-container">
            <img
              src= {logo}
              alt="Bank Logo"
              className="logo"
            />
          </div>
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#account">Account</a></li>
            <li><a href="#appointments">Appointments</a></li>
            <li><a href="#profile">Profile</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </aside>
      );
};

export default LeftsideNav;