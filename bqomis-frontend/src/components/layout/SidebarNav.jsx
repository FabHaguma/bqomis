import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
import './SidebarNav.scss';

const SidebarNav = ({ navigationItems }) => {
  const { user } = useAuth(); // Get user from AuthContext
  
  return (
    <aside className="sidebar-nav">
      {user && ( // Only show profile info if user is logged in
        <div className="sidebar-nav__profile">
          <div className="sidebar-nav__profile-avatar">
            {/* Placeholder for avatar - could be an img tag or initials */}
            {user.username ? user.username.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-nav__profile-info">
            <p className="sidebar-nav__profile-name">{user.username || 'User'}</p>
            <p className="sidebar-nav__profile-email">{user.email}</p>
          </div>
        </div>
      )}
      <nav>
        <ul>
          {navigationItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `sidebar-nav__link ${isActive ? 'active' : ''}`
                }
              >
                <span className="sidebar-nav__icon">{item.icon}</span>
                <span className="sidebar-nav__label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SidebarNav;