import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerClientUser } from '../api/userService'; // Or createUserByAdmin
import { useAuth } from '../contexts/AuthContext'; // To check if already logged in
import './SignUpPage.scss'; // Create this SCSS file

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // If user is already authenticated, redirect them from sign up page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/client/home'); // Or admin dashboard if that logic exists
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(''); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic client-side validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields marked with * are required.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) { // Example: Minimum password length
      setError('Password must be at least 6 characters long.');
      return;
    }
    // Basic email format check (more robust validation can be added)
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Please enter a valid email address.');
        return;
    }

    setIsLoading(true);

    const payload = {
      username: formData.username,
      email: formData.email,
      phoneNumber: formData.phoneNumber || null, // Send null if empty, or backend handles empty string
      password: formData.password,
      role: "CLIENT", // Hardcode role for client self-registration
    };

    try {
      await registerClientUser(payload); // Using the dedicated function
      setSuccessMessage('Registration successful! Redirecting to sign in...');
      // Clear form
      setFormData({ username: '', email: '', phoneNumber: '', password: '', confirmPassword: '' });
      setTimeout(() => {
        navigate('/signin', { state: { registrationSuccess: true } }); // Pass state to SignInPage if needed
      }, 2000); // Delay for user to see success message
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      console.error("Sign up error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-form-container">
        <h2>Create Your BQOMIS Account</h2>
        
        {error && <div className="error-message alert alert-danger">{error}</div>}
        {successMessage && <div className="success-message alert alert-success">{successMessage}</div>}

        {!successMessage && ( // Hide form after success message
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username *</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number (Optional)</label>
              <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={isLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password *</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required disabled={isLoading} />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password *</label>
              <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required disabled={isLoading} />
            </div>
            <button type="submit" className="btn btn-primary btn-signup" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        )}

        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;