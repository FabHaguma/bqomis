
## II. Client Application Features

### 1. Authentication

Client authentication is the gateway for users to access personalized features of the BQOMIS application, such as booking appointments and managing their profile. It involves verifying a user's identity (Sign In) and allowing new users to create an account (Sign Up).

#### 1.1. Sign In (`SignInPage.jsx`)

*   **Purpose:** Allows existing users to log into their BQOMIS accounts.
*   **Accessibility:** Publicly accessible via the `/signin` route. It's also the default route if a user tries to access a protected area without being authenticated or navigates to the application root (`/`).
*   **UI Elements:**
    *   Email input field.
    *   Password input field.
    *   "Sign In" button.
    *   Link to the "Sign Up" page for users who don't have an account.
    *   Display area for error messages (e.g., "Invalid credentials").

*   **Workflow:**
    1.  The user enters their email and password.
    2.  Upon clicking "Sign In," client-side validation (e.g., checking for empty fields) is performed.
    3.  The `login` function from `AuthContext` (exposed via the `useAuth()` hook) is called with the email and password.
        *   *(In the current mocked implementation, this `login` function simulates an API call and checks credentials against predefined admin/client values. In a production system, it would make an API request to a backend authentication endpoint.)*
    4.  **On Successful Login:**
        *   The `AuthContext` updates its state with the user's information and JWT.
        *   User data and token are stored in `localStorage` for session persistence.
        *   The user is redirected:
            *   To `/admin/dashboard` if their role is "ADMIN".
            *   To `/client/home` if their role is "CLIENT".
            *   If the user was attempting to access a protected route before login, they are redirected back to that intended route (handled by `location.state?.from?.pathname` in `SignInPage` and protected route components).
    5.  **On Failed Login:**
        *   An error message is displayed on the `SignInPage`.

*   **Key Code Snippet (`SignInPage.jsx` - illustrating form handling):**
    ```javascript
    // src/pages/SignInPage.jsx (Illustrative)
    import React, { useState } from 'react';
    import { useNavigate, useLocation, Link } from 'react-router-dom';
    import { useAuth } from '../contexts/AuthContext';
    // import './SignInPage.scss'; // Styles

    const SignInPage = () => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [error, setError] = useState('');
      const [loading, setLoading] = useState(false);
      const auth = useAuth();
      const navigate = useNavigate();
      const location = useLocation();
      const from = location.state?.from?.pathname;

      const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
          const user = await auth.login(email, password);
          if (user) {
            const redirectTo = from || (user.role === 'ADMIN' ? '/admin/dashboard' : '/client/home');
            navigate(redirectTo, { replace: true });
          }
        } catch (err) {
          setError(err.message || 'Failed to sign in.');
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
              {/* Email Input */}
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
              </div>
              {/* Password Input */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
              </div>
              <button type="submit" disabled={loading} className="signin-button">
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
            <p className="signup-link">
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
      );
    };
    export default SignInPage;
    ```

#### 1.2. Sign Up (`SignUpPage.jsx`)

*   **Purpose:** Allows new users to register for a BQOMIS client account.
*   **Accessibility:** Publicly accessible via the `/signup` route, typically linked from the `SignInPage`.
*   **UI Elements:**
    *   Username input field.
    *   Email input field.
    *   Phone Number input field (optional).
    *   Password input field.
    *   Confirm Password input field.
    *   "Sign Up" button.
    *   Link to the "Sign In" page for users who already have an account.
    *   Display area for error and success messages.

*   **Workflow:**
    1.  The user fills in the registration form.
    2.  Upon clicking "Sign Up," client-side validation is performed:
        *   Required fields (username, email, password, confirm password).
        *   Password and Confirm Password match.
        *   Minimum password length/complexity (basic check).
        *   Basic email format check.
    3.  If client-side validation passes, an API call is made to `POST /api/users` (using the `registerClientUser` function from `userService.js`).
    4.  **Payload to Backend:** The frontend constructs a payload including `username`, `email`, `phoneNumber` (if provided), `password`, and hardcodes `role: "CLIENT"`.
    5.  **Backend Responsibility:**
        *   Performs its own validation (e.g., uniqueness of email/username).
        *   Hashes the password securely.
        *   Creates the new user record with the "CLIENT" role.
    6.  **On Successful Registration (Frontend):**
        *   A success message is displayed (e.g., "Registration successful! Redirecting to sign in...").
        *   The form is typically cleared.
        *   After a short delay (to allow the user to read the message), the user is redirected to the `/signin` page.
    7.  **On Failed Registration (Frontend):**
        *   An error message from the API (e.g., "Email already in use," "Username taken") or a generic failure message is displayed.

*   **Redirection after Sign Up:** The current implementation redirects to the Sign In page. An alternative could be to automatically log the user in if the backend registration endpoint returns a JWT and user details upon success.

*   **Key Code Snippet (`SignUpPage.jsx` - illustrating form handling and API call):**
    ```javascript
    // src/pages/SignUpPage.jsx (Illustrative)
    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { registerClientUser } from '../api/userService';
    import { useAuth } from '../contexts/AuthContext'; // To redirect if already logged in
    // import './SignUpPage.scss'; // Styles

    const SignUpPage = () => {
      const [formData, setFormData] = useState({ /* ... initial empty fields ... */ });
      const [error, setError] = useState('');
      const [successMessage, setSuccessMessage] = useState('');
      const [isLoading, setIsLoading] = useState(false);
      const navigate = useNavigate();
      const { isAuthenticated } = useAuth();

      useEffect(() => { if (isAuthenticated) navigate('/client/home'); }, [isAuthenticated, navigate]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        // ... client-side validation logic ...
        if (validationFails) { setError("Validation message"); return; }

        setIsLoading(true);
        const payload = {
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber || null,
          password: formData.password,
          role: "CLIENT",
        };

        try {
          await registerClientUser(payload);
          setSuccessMessage('Registration successful! Redirecting to sign in...');
          setTimeout(() => navigate('/signin'), 2000);
        } catch (err) {
          setError(err.message || 'Registration failed.');
        } finally {
          setIsLoading(false);
        }
      };
      
      // ... JSX for the form ...
      // <form onSubmit={handleSubmit}>
      //   {/* Inputs for username, email, phoneNumber, password, confirmPassword */}
      //   <button type="submit" disabled={isLoading}>
      //     {isLoading ? 'Creating...' : 'Sign Up'}
      //   </button>
      // </form>
      // <p>Already have an account? <Link to="/signin">Sign In</Link></p>
      // ...
    };
    export default SignUpPage;
    ```

Both `SignInPage.jsx` and `SignUpPage.jsx` are crucial for user onboarding and access, relying on `AuthContext` for managing the authenticated state post-login and leveraging API services for backend communication.