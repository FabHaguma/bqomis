import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './SignInPage.scss';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the path the user was trying to access, or default to client/admin home
  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await auth.login(email, password);
      // Navigation will be handled by the App.jsx component based on user.role
      // but we can provide a fallback or specific redirect if `from` is not set.
      if (user) {
        if (from) {
          navigate(from, { replace: true });
        } else {
          // Default redirection based on role
          navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/client/home', { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-form-container">
        <h2>Sign In to BQOMIS</h2>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button type="submit" disabled={loading} className="signin-button">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="signup-link">
          Don't have an account? <a href="/signup">Sign Up</a> {/* Link to SignUpPage later */}
        </p>
      </div>
    </div>
  );
};

export default SignInPage;