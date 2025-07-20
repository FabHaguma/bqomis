
### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.2. Authentication & Authorization

Authentication (verifying who a user is) and Authorization (determining what an authenticated user is allowed to do) are critical aspects of the BQOMIS frontend. The system employs a token-based authentication mechanism with role-based access control.

**A. Authentication Flow & Token Management**

1.  **Login Process (`SignInPage.jsx`):**
    *   Users provide their credentials (email and password) on the Sign In page.
    *   These credentials are (intended to be) sent to a backend endpoint (e.g., `/api/auth/login` or a general user authentication endpoint that was mocked via `AuthContext`'s `login` function in early development).
    *   Upon successful authentication, the backend is expected to return a JSON Web Token (JWT) and user information (including their role).
    *   **Frontend Action:**
        *   The JWT (token) is stored in `localStorage` (e.g., under the key `bqomis_token`).
        *   User information (ID, username, email, role) is also stored in `localStorage` (e.g., `bqomis_user`) and set in the `AuthContext`.

2.  **Token Persistence & Session Management:**
    *   The `AuthContext` initializes its state by attempting to load the token and user information from `localStorage` when the application starts. This allows the user's session to persist across page reloads or browser sessions until the token expires or is cleared.

3.  **Authenticated API Requests:**
    *   For API endpoints that require authentication, the stored JWT is retrieved (typically from `AuthContext` or `localStorage`) and included in the `Authorization` header of the HTTP request, usually with the "Bearer" scheme.
        ```
        Authorization: Bearer <your_jwt_token>
        ```
    *   This is implemented in the API service functions (e.g., `userService.js`, `branchService.js`).

4.  **Logout Process:**
    *   When a user logs out (e.g., by clicking a "Sign Out" button):
        *   The `logout` function in `AuthContext` is called.
        *   The JWT and user information are removed from `localStorage`.
        *   The user state in `AuthContext` is cleared.
        *   The user is typically redirected to the `SignInPage`.

**B. `AuthContext.jsx` - The Core of Frontend Auth**

The `src/contexts/AuthContext.jsx` file is central to managing authentication and user session state throughout the application.

*   **Purpose:**
    *   Provides a global state for the current authenticated user, their token, and authentication status (`isAuthenticated`, `isAdmin`, `isClient`).
    *   Offers functions for `login`, `logout`, and `refreshUserContext` (to update user details after profile changes).
    *   Manages an initial loading state (`loading`) to check for persisted sessions from `localStorage` before rendering the main application.
*   **Key State and Functions Exposed by `useAuth()` Hook:**
    *   `user`: An object containing the current user's details (id, username, email, role, etc.) or `null` if not authenticated.
    *   `token`: The JWT string or `null`.
    *   `isAuthenticated`: A boolean indicating if a user is currently logged in.
    *   `isAdmin`: A boolean, true if `user.role === 'ADMIN'`.
    *   `isClient`: A boolean, true if `user.role === 'CLIENT'`.
    *   `login(email, password)`: Asynchronous function to attempt login. (In early development, this was a mock; in a full implementation, it calls the backend auth API).
    *   `logout()`: Clears session data and updates state.
    *   `refreshUserContext()`: Asynchronously fetches the latest user data from the backend (using `GET /api/users/{id}`) and updates the `user` state in the context and `localStorage`. This is useful after profile updates.
    *   `loading`: A boolean indicating if the initial auth check (from `localStorage`) is in progress.

*   **Implementation Snippet (`AuthContext.jsx`):**
    ```javascript
    // src/contexts/AuthContext.jsx (Illustrative Structure)
    import React, { createContext, useContext, useState, useEffect } from 'react';
    import { getUserById } from '../api/userService'; // For refreshUserContext

    const AuthContext = createContext(null);

    export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(null);
      const [token, setToken] = useState(localStorage.getItem('bqomis_token'));
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        const storedToken = localStorage.getItem('bqomis_token');
        const storedUser = localStorage.getItem('bqomis_user');
        if (storedToken && storedUser) {
          try {
            setUser(JSON.parse(storedUser));
            setToken(storedToken); // Ensure token state is also set
          } catch (e) { /* Handle parse error, clear storage */ }
        }
        setLoading(false);
      }, []);

      const login = async (email, password) => {
        // MOCK LOGIN (replace with actual API call)
        // Simulates API call, sets user, token, and localStorage
        // On success: setUser(userData); setToken(jwtToken); localStorage.setItem(...)
        // On failure: throw new Error(...)
        // Example based on previous mock:
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            let mockUser, mockToken;
            if (email === 'admin@bqomis.com' && password === 'admin123') {
                mockUser = { id: 'admin1', username: 'Admin User', email: 'admin@bqomis.com', role: 'ADMIN' };
                mockToken = 'fake-admin-jwt-token';
            } else if (email === 'client@bqomis.com' && password === 'client123') {
                mockUser = { id: 'client1', username: 'Client User', email: 'client@bqomis.com', role: 'CLIENT' };
                mockToken = 'fake-client-jwt-token';
            } // ... add other mock users like STAFF if needed for testing ...
            
            if (mockUser) {
                localStorage.setItem('bqomis_token', mockToken);
                localStorage.setItem('bqomis_user', JSON.stringify(mockUser));
                setUser(mockUser);
                setToken(mockToken);
                resolve(mockUser);
            } else {
                reject(new Error('Invalid credentials (mock)'));
            }
          }, 500);
        });
      };

      const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('bqomis_token');
        localStorage.removeItem('bqomis_user');
      };

      const refreshUserContext = async () => {
        if (user && user.id && token) {
          try {
            const updatedUserData = await getUserById(user.id, token);
            setUser(updatedUserData);
            localStorage.setItem('bqomis_user', JSON.stringify(updatedUserData));
          } catch (error) { /* ... error handling ... */ }
        }
      };
      
      const value = { user, token, isAuthenticated: !!user && !!token, isAdmin: user?.role === 'ADMIN', isClient: user?.role === 'CLIENT', login, logout, refreshUserContext, loading };
      return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
    };

    export const useAuth = () => useContext(AuthContext);
    ```

**C. Authorization (Role-Based Access Control - RBAC)**

Authorization is implemented primarily through:

1.  **Protected Routes (`App.jsx`):**
    *   `AdminProtectedRoute`: A wrapper component that checks if `isAuthenticated` is true AND `isAdmin` is true (derived from `user.role === 'ADMIN'` in `AuthContext`). If not, it redirects the user to the `SignInPage`. This protects all routes under `/admin/*`.
    *   `ClientProtectedRoute`: A wrapper component that checks if `isAuthenticated` is true. If not, it redirects to `SignInPage`. This protects client-specific routes like `/client/appointments` or `/client/profile`.

    ```javascript
    // src/App.jsx (Illustrative Snippet for Protected Route)
    const AdminProtectedRoute = () => {
      const { isAuthenticated, isAdmin, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      if (!isAuthenticated || !isAdmin) return <Navigate to="/signin" replace />;
      return <Outlet />; // Renders child routes
    };
    ```

2.  **Conditional UI Rendering:**
    *   Within components, UI elements or functionalities might be conditionally rendered based on the user's role obtained from `useAuth().user.role`. For example, an "Edit" button might only be shown if the user has an "ADMIN" or "STAFF" role with specific permissions.

3.  **Backend Enforcement:**
    *   **Crucially, the frontend RBAC is for UI/UX purposes.** True security is enforced by the backend. The backend APIs must validate the JWT on every protected request and check if the authenticated user's role has the necessary permissions to perform the requested action (e.g., only an ADMIN can delete a branch).

**D. Client Sign-Up (`SignUpPage.jsx`)**

*   New users can register for a "CLIENT" account.
*   The `SignUpPage.jsx` collects user details (username, email, password, phone number).
*   It makes a `POST` request to `/api/users`, including `role: "CLIENT"` in the payload.
*   The backend is responsible for creating the user with the "CLIENT" role and securely hashing the password.
*   Successful registration typically redirects the user to the `SignInPage`.

This system provides a foundational layer for securing the application and ensuring users can only access appropriate features and data based on their roles.