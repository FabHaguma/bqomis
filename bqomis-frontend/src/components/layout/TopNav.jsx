import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './TopNav.scss';

const TopNav = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/signin'); // Redirect to sign-in page after logout
  };

  return (
    <nav className="top-nav">
      <div className="top-nav__title">BQOMIS</div>
      <div className="top-nav__user-actions">
        {isAuthenticated ? (
          <>
            {user && <span className="top-nav__username">Hi, {user.username || user.email}</span>}
            <button onClick={handleSignOut} className="top-nav__sign-out">
              Sign Out
            </button>
          </>
        ) : (
          // Optionally show Sign In link if not on sign in page and not authenticated
          // <Link to="/signin">Sign In</Link>
          null
        )}
      </div>
    </nav>
  );
};

export default TopNav;