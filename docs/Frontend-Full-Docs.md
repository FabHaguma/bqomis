**BQOMIS Frontend Documentation**

**Part I: BQOMIS Frontend Documentation - Overview**

1.  `I.1. Introduction & Purpose`
2.  `I.2. Project Setup & Structure`
3.  `I.3.1. Core Concepts - Routing`
4.  `I.3.2. Core Concepts - Authentication & Authorization`
5.  `I.3.3. Core Concepts - Styling & Theming`
6.  `I.3.4. Core Concepts - API Interaction`
7.  `I.3.5. Core Concepts - State Management`
8.  `I.3.6. Core Concepts - Common Reusable Components`

**Part II: Client Application Features** 9. `II.1.1. Client Features - Authentication - Sign In` 10. `II.1.2. Client Features - Authentication - Sign Up` 11. `II.2. Client Features - Home Page` 12. `II.3. Client Features - Branch & Service Discovery` 13. `II.4. Client Features - Appointment Booking` 14. `II.5. Client Features - My Appointments Page` 15. `II.6. Client Features - My Profile Page`

**Part III: Admin Application Features** 16. `III.1. Admin Features - Core Admin Layout` 17. `III.2. Admin Features - Branch Management` 18. `III.3. Admin Features - Service Management` 19. `III.4. Admin Features - Branch-Service Relationships` 20. `III.5. Admin Features - User Management` 21. `III.6. Admin Features - Appointment Management` 22. `III.7. Admin Features - Analytics Dashboard` 23. `III.8. Admin Features - Settings Page`

**Part IV: Appendix** 24. `IV.1. Appendix - API Endpoint Summary` 25. `IV.2. Appendix - Key SCSS Variables Overview` 26. `IV.3. Appendix - Potential Future Enhancements`

---

## I. BQOMIS Frontend Documentation - Overview

### 1. Introduction & Purpose

**Introduction**

The Bank Queue Optimizing Management Information System (BQOMIS) Frontend is a modern, responsive web application designed to serve as the primary user interface for both clients and administrative staff of the BQOMIS platform. Built with React (using Vite for a fast development experience) and SCSS for styling, it aims to provide an intuitive and efficient way to interact with the system's backend services.

**Purpose**

The core purpose of the BQOMIS Frontend is to address inefficient queue management in bank branches by providing a digital platform for:

- **Clients:**
  - Discovering bank branches and the services they offer.
  - Viewing estimated queue traffic for services at different times.
  - Booking appointments for specific services at chosen branches, thereby reducing physical waiting times.
  - Managing their scheduled appointments.
  - Managing their user profile and account settings.
- **Administrative Staff (Admins/Managers):**
  - Managing foundational data such as districts, branches, and banking services.
  - Defining relationships between branches and the services they offer.
  - Managing user accounts, particularly for staff and other administrators.
  - Overseeing and managing client appointments system-wide.
  - Accessing analytics and reports to understand operational efficiency, service demand, and branch performance.
  - Configuring system-wide and branch-specific operational settings.
  - Utilizing developer tools for data seeding and testing.

The frontend application acts as a client to the BQOMIS Backend (a Spring Boot application), consuming its RESTful APIs to fetch data, submit changes, and facilitate all user interactions. It emphasizes a clear separation of concerns for client and admin perspectives, providing tailored interfaces for each user role.

**Key Technologies Used:**

- **React:** A JavaScript library for building user interfaces, chosen for its component-based architecture, efficiency, and large ecosystem.
- **Vite:** A next-generation frontend tooling system that provides an extremely fast development server and optimized build process.
- **JavaScript (ES6+):** The primary programming language.
- **SCSS (Sassy CSS):** A CSS preprocessor used for more organized, maintainable, and powerful styling. A global theming approach with variables is utilized for consistency.
- **React Router DOM:** For client-side routing and navigation within the single-page application.
- **Recharts:** A composable charting library used for data visualization on the admin analytics dashboard.
- **Axios (or Fetch API):** For making HTTP requests to the backend API (Fetch API has been primarily used in the generated examples).

The overall goal is to create a seamless, user-friendly experience that optimizes service delivery for bank clients and provides powerful management tools for bank staff.

### 2. Project Setup & Structure

**2.1. Development Environment Setup**

The BQOMIS Frontend is built using Vite with React (using the SWC compiler for speed). To set up the development environment:

1.  **Prerequisites:**
    - Node.js (version 16.x or higher recommended) and npm (or yarn/pnpm).
2.  **Create the Project (if starting from scratch):**

    ```bash
    # Using npm
    npm create vite@latest bqomis-frontend -- --template react-swc

    # OR Using yarn
    # yarn create vite bqomis-frontend --template react-swc
    ```

3.  **Navigate into the project directory:**
    ```bash
    cd bqomis-frontend
    ```
4.  **Install Dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```
    Key dependencies to install manually if not included by the template or added later:
    ```bash
    npm install react-router-dom sass recharts
    # or
    # yarn add react-router-dom sass recharts
    ```
5.  **Environment Variables:**
    - Create a `.env` file in the root of the project.
    - Add the base URL for the backend API:
      ```env
      VITE_API_BASE_URL=http://localhost:8080/api
      ```
      (Adjust the URL and port if your backend runs elsewhere).
6.  **Run the Development Server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
    This will typically start the application on `http://localhost:5173` (or another available port).

**2.2. High-Level Folder Structure (`src`)**

The `src` directory contains the core source code of the application, organized as follows:

```
src/
├── api/                     # API call functions (e.g., userService.js, branchService.js)
├── assets/                  # Static assets like images, fonts, global styles
│   └── styles/              # Global SCSS files (_variables.scss, main.scss)
├── components/              # Reusable UI components shared across features/pages
│   ├── common/              # Generic components (Button, Input, Modal, ConfirmationDialog)
│   └── layout/              # Layout components (AdminLayout, ClientLayout, TopNav, SidebarNav, Footer)
├── contexts/                # React Context API providers and hooks (e.g., AuthContext.jsx)
├── features/                # Feature-specific components, hooks, and utilities
│   ├── admin/               # Admin-specific features (e.g., branchManagement, userManagement)
│   │   ├── branchManagement/
│   │   ├── serviceManagement/
│   │   └── userManagement/
│   └── client/              # Client-specific features (currently, most client logic is in pages/)
├── hooks/                   # Custom global hooks (if any, beyond context hooks)
├── pages/                   # Top-level page components rendered by routes
│   ├── admin/               # Admin-facing pages (e.g., AdminDashboardPage.jsx)
│   └── client/              # Client-facing pages (e.g., ClientHomePage.jsx)
│   └── SignInPage.jsx       # Shared auth pages
│   └── SignUpPage.jsx
│   └── NotFoundPage.jsx
├── routes/                  # Route definitions and protected route components (currently in App.jsx)
├── services/                # (Alternative or layer on top of api/, not heavily used if api/ is direct)
└── utils/                   # Utility functions (helpers, formatters, validators)
```

- **`api/`**: Contains JavaScript modules responsible for making HTTP requests to the backend API. Each module typically corresponds to a backend controller or resource (e.g., `branchService.js` for branch-related endpoints).
- **`assets/styles/`**: Holds global SCSS files.
  - `_variables.scss`: Defines global SCSS variables for colors, fonts, spacing, etc., enabling consistent theming.
  - `main.scss`: Imports variables, applies global resets/base styles, and serves as the main stylesheet entry point.
- **`components/common/`**: Houses small, highly reusable UI components like `Modal.jsx`, `ConfirmationDialog.jsx`, buttons, inputs, etc., that can be used anywhere in the application.
- **`components/layout/`**: Defines the main structural components of the application, such as `AdminLayout.jsx` and `ClientLayout.jsx`, which provide the consistent header, sidebar, and footer for their respective sections. Includes `TopNav.jsx`, `SidebarNav.jsx`, and `Footer.jsx`.
- **`contexts/`**: Manages global state using React's Context API. The primary context is `AuthContext.jsx`, which handles user authentication state, session information, and provides login/logout functionalities.
- **`features/`**: Organizes code by specific application features, particularly for more complex UI or logic related to a domain. For example, `features/admin/devDataTools/generatorUtils.js` contains logic for the data generator.
- **`pages/`**: Contains top-level components that are mapped to specific routes. These components compose layouts and feature-specific UIs to form complete views. They are further organized into `admin/` and `client/` subdirectories. Shared pages like `SignInPage.jsx` are at the root of `pages/`.
- **`App.jsx` (in `src/`)**: The main application component. It sets up the primary routing structure using `react-router-dom` and wraps the application with global context providers (like `AuthProvider`).
- **`main.jsx` (in `src/`)**: The entry point of the React application. It renders the `App` component into the DOM and imports global stylesheets (`main.scss`).

**2.3. Entry Point and Main Application Component**

- **`src/main.jsx`:**

  - This is the JavaScript entry point for the Vite build.
  - It uses `ReactDOM.createRoot()` to render the application.
  - It wraps the `<App />` component with `<React.StrictMode>`, `<BrowserRouter>` (from `react-router-dom`), and the global `<AuthProvider>`.
  - Crucially, it imports the global stylesheet: `import './assets/styles/main.scss';`.

  ```javascript
  // src/main.jsx (Illustrative)
  import React from "react";
  import ReactDOM from "react-dom/client";
  import { BrowserRouter } from "react-router-dom";
  import App from "./App";
  import { AuthProvider } from "./contexts/AuthContext";
  import "./assets/styles/main.scss"; // Global styles entry point

  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
  ```

- **`src/App.jsx`:**
  - Defines the application's routing hierarchy using `<Routes>` and `<Route>` components from `react-router-dom`.
  - Implements protected routes for client and admin sections using custom wrapper components (`ClientProtectedRoute`, `AdminProtectedRoute`) that leverage the `AuthContext`.
  - Uses layout components (`ClientLayout`, `AdminLayout`) to provide consistent structure for different parts of the application.
  - Handles redirection logic based on authentication status and user roles.

This structure aims for a balance between feature-based organization and type-based organization (e.g., all API services in `api/`), promoting maintainability and scalability.

### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.1. Core Concepts - Routing

Client-side routing in the BQOMIS Frontend is managed by the `react-router-dom` library (version 6.x). This library enables navigation between different views or "pages" within the single-page application (SPA) without requiring a full page reload from the server.

**A. Setup and Configuration (`main.jsx` and `App.jsx`)**

1.  **`BrowserRouter` (`src/main.jsx`):**

    - The entire application, starting from the `<App />` component, is wrapped with `<BrowserRouter>`. This component uses the HTML5 history API (pushState, replaceState, and the popstate event) to keep the UI in sync with the URL.

    ```javascript
    // src/main.jsx (Relevant part)
    import { BrowserRouter } from "react-router-dom";
    import App from "./App";
    // ... other imports ...

    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            {" "}
            {/* AuthProvider wraps App */}
            <App />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
    ```

2.  **Route Definitions (`src/App.jsx`):**

    - The main `<App />` component is responsible for defining the application's routes using the `<Routes>` and `<Route>` components.
    - `<Routes>` acts as a container for a collection of `<Route>` elements.
    - Each `<Route>` maps a URL path to a specific React component that should be rendered when the path matches.
      - `path`: The URL path pattern (e.g., `/signin`, `/admin/dashboard`, `/client/branches`).
      - `element`: The React component to render for that path.
      - `index`: Used for default child routes within a nested route structure.

    ```javascript
    // src/App.jsx (Simplified structure)
    import React from "react";
    import { Routes, Route, Navigate, Outlet } from "react-router-dom";
    import AdminLayout from "./components/layout/AdminLayout";
    import ClientLayout from "./components/layout/ClientLayout";
    import SignInPage from "./pages/SignInPage";
    import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
    import ClientHomePage from "./pages/client/ClientHomePage";
    // ... other page imports

    function App() {
      // ... (useAuth hook for protected routes) ...

      return (
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignInPage />} />
          {/* ... other public routes like /signup ... */}
          {/* Client Protected Routes with ClientLayout */}
          <Route path="/client" element={<ClientProtectedRoute />}>
            {" "}
            {/* Wrapper for auth check */}
            <Route element={<ClientLayout />}>
              {" "}
              {/* Layout for nested client routes */}
              <Route index element={<Navigate to="home" replace />} />{" "}
              {/* Default /client to /client/home */}
              <Route path="home" element={<ClientHomePage />} />
              {/* ... other nested client routes ... */}
            </Route>
          </Route>
          {/* Admin Protected Routes with AdminLayout */}
          <Route path="/admin" element={<AdminProtectedRoute />}>
            {" "}
            {/* Wrapper for auth & role check */}
            <Route element={<AdminLayout />}>
              {" "}
              {/* Layout for nested admin routes */}
              <Route index element={<Navigate to="dashboard" replace />} />{" "}
              {/* Default /admin to /admin/dashboard */}
              <Route path="dashboard" element={<AdminDashboardPage />} />
              {/* ... other nested admin routes ... */}
            </Route>
          </Route>
          <Route path="/" element={<Navigate to="/signin" replace />} /> {/* Default root to signin */}
          <Route path="*" element={<NotFoundPage />} />{" "}
          {/* Catch-all for 404 */}
        </Routes>
      );
    }
    export default App;
    ```

**B. Key Routing Concepts Used**

1.  **Layout Routes & `Outlet`:**

    - The application uses layout routes to provide a consistent structure (header, sidebar, footer) for different sections (Client and Admin).
    - A parent `<Route>` defines the layout component in its `element` prop (e.g., `<Route element={<ClientLayout />}>`).
    - Nested `<Route>` elements define the content specific to sub-paths.
    - The layout component (`ClientLayout.jsx`, `AdminLayout.jsx`) uses the `<Outlet />` component from `react-router-dom`. The `<Outlet />` acts as a placeholder where the matched child route's component will be rendered.

    ```javascript
    // src/components/layout/ClientLayout.jsx (Illustrative)
    import { Outlet } from "react-router-dom";
    // ... other imports for TopNav, SidebarNav, Footer ...

    const ClientLayout = () => {
      return (
        <div className="client-layout">
          <TopNav />
          <div className="client-layout__main">
            <SidebarNav navigationItems={clientNavItems} />
            <main className="client-layout__content">
              <Outlet /> {/* Child route components render here */}
            </main>
          </div>
          <Footer />
        </div>
      );
    };
    ```

2.  **Protected Routes:**

    - Custom components like `AdminProtectedRoute` and `ClientProtectedRoute` are used to guard routes.
    - These components use the `useAuth()` hook (from `AuthContext`) to check if the user is authenticated and (for admin routes) if they have the correct role.
    - If the checks fail, the user is redirected to the `/signin` page using the `<Navigate to="/signin" replace />` component.
    - If the checks pass, they render an `<Outlet />`, allowing the nested child routes to be rendered.

3.  **Navigation:**

    - **`<Link>` Component:** Used for declarative navigation, similar to an `<a>` tag but for client-side routing. It prevents full page reloads.
      ```javascript
      import { Link } from "react-router-dom";
      // <Link to="/client/appointments">My Appointments</Link>
      ```
    - **`<NavLink>` Component:** A special version of `<Link>` that can apply an "active" class or style when its `to` prop matches the current URL. This is used in `SidebarNav.jsx` for highlighting the active menu item.
      ```javascript
      import { NavLink } from "react-router-dom";
      // <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
      ```
    - **`useNavigate` Hook:** Used for programmatic navigation (e.g., after a form submission or a successful login/logout).
      ```javascript
      import { useNavigate } from "react-router-dom";
      const navigate = useNavigate();
      // navigate('/some-path');
      // navigate('/signin', { state: { from: location } }); // Pass state during navigation
      ```
    - **`<Navigate>` Component:** Used for declarative redirection within the route configuration (e.g., redirecting from `/` to `/signin` or from `/admin` to `/admin/dashboard`).

4.  **Index Routes:**

    - An `index` route is a child route that renders at the parent route's path when no other child route matches. For example, in the admin section, `/admin` defaults to showing the content of `/admin/dashboard`.
      ```javascript
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />{" "}
        {/* Default */}
        <Route path="dashboard" element={<AdminDashboardPage />} />
      </Route>
      ```

5.  **"Not Found" Route (404):**
    - A catch-all route with `path="*"` is defined to render a `NotFoundPage.jsx` component when no other route matches the current URL.

This routing setup provides a clear and organized way to manage navigation and access control within the BQOMIS frontend application, separating concerns for public, client-only, and admin-only sections.

### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.2. Authentication & Authorization

Authentication (verifying who a user is) and Authorization (determining what an authenticated user is allowed to do) are critical aspects of the BQOMIS frontend. The system employs a token-based authentication mechanism with role-based access control.

**A. Authentication Flow & Token Management**

1.  **Login Process (`SignInPage.jsx`):**

    - Users provide their credentials (email and password) on the Sign In page.
    - These credentials are (intended to be) sent to a backend endpoint (e.g., `/api/auth/login` or a general user authentication endpoint that was mocked via `AuthContext`'s `login` function in early development).
    - Upon successful authentication, the backend is expected to return a JSON Web Token (JWT) and user information (including their role).
    - **Frontend Action:**
      - The JWT (token) is stored in `localStorage` (e.g., under the key `bqomis_token`).
      - User information (ID, username, email, role) is also stored in `localStorage` (e.g., `bqomis_user`) and set in the `AuthContext`.

2.  **Token Persistence & Session Management:**

    - The `AuthContext` initializes its state by attempting to load the token and user information from `localStorage` when the application starts. This allows the user's session to persist across page reloads or browser sessions until the token expires or is cleared.

3.  **Authenticated API Requests:**

    - For API endpoints that require authentication, the stored JWT is retrieved (typically from `AuthContext` or `localStorage`) and included in the `Authorization` header of the HTTP request, usually with the "Bearer" scheme.
      ```
      Authorization: Bearer <your_jwt_token>
      ```
    - This is implemented in the API service functions (e.g., `userService.js`, `branchService.js`).

4.  **Logout Process:**
    - When a user logs out (e.g., by clicking a "Sign Out" button):
      - The `logout` function in `AuthContext` is called.
      - The JWT and user information are removed from `localStorage`.
      - The user state in `AuthContext` is cleared.
      - The user is typically redirected to the `SignInPage`.

**B. `AuthContext.jsx` - The Core of Frontend Auth**

The `src/contexts/AuthContext.jsx` file is central to managing authentication and user session state throughout the application.

- **Purpose:**
  - Provides a global state for the current authenticated user, their token, and authentication status (`isAuthenticated`, `isAdmin`, `isClient`).
  - Offers functions for `login`, `logout`, and `refreshUserContext` (to update user details after profile changes).
  - Manages an initial loading state (`loading`) to check for persisted sessions from `localStorage` before rendering the main application.
- **Key State and Functions Exposed by `useAuth()` Hook:**

  - `user`: An object containing the current user's details (id, username, email, role, etc.) or `null` if not authenticated.
  - `token`: The JWT string or `null`.
  - `isAuthenticated`: A boolean indicating if a user is currently logged in.
  - `isAdmin`: A boolean, true if `user.role === 'ADMIN'`.
  - `isClient`: A boolean, true if `user.role === 'CLIENT'`.
  - `login(email, password)`: Asynchronous function to attempt login. (In early development, this was a mock; in a full implementation, it calls the backend auth API).
  - `logout()`: Clears session data and updates state.
  - `refreshUserContext()`: Asynchronously fetches the latest user data from the backend (using `GET /api/users/{id}`) and updates the `user` state in the context and `localStorage`. This is useful after profile updates.
  - `loading`: A boolean indicating if the initial auth check (from `localStorage`) is in progress.

- **Implementation Snippet (`AuthContext.jsx`):**

  ```javascript
  // src/contexts/AuthContext.jsx (Illustrative Structure)
  import React, { createContext, useContext, useState, useEffect } from "react";
  import { getUserById } from "../api/userService"; // For refreshUserContext

  const AuthContext = createContext(null);

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("bqomis_token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const storedToken = localStorage.getItem("bqomis_token");
      const storedUser = localStorage.getItem("bqomis_user");
      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setToken(storedToken); // Ensure token state is also set
        } catch (e) {
          /* Handle parse error, clear storage */
        }
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
          if (email === "admin@bqomis.com" && password === "admin123") {
            mockUser = {
              id: "admin1",
              username: "Admin User",
              email: "admin@bqomis.com",
              role: "ADMIN",
            };
            mockToken = "fake-admin-jwt-token";
          } else if (
            email === "client@bqomis.com" &&
            password === "client123"
          ) {
            mockUser = {
              id: "client1",
              username: "Client User",
              email: "client@bqomis.com",
              role: "CLIENT",
            };
            mockToken = "fake-client-jwt-token";
          } // ... add other mock users like STAFF if needed for testing ...

          if (mockUser) {
            localStorage.setItem("bqomis_token", mockToken);
            localStorage.setItem("bqomis_user", JSON.stringify(mockUser));
            setUser(mockUser);
            setToken(mockToken);
            resolve(mockUser);
          } else {
            reject(new Error("Invalid credentials (mock)"));
          }
        }, 500);
      });
    };

    const logout = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("bqomis_token");
      localStorage.removeItem("bqomis_user");
    };

    const refreshUserContext = async () => {
      if (user && user.id && token) {
        try {
          const updatedUserData = await getUserById(user.id, token);
          setUser(updatedUserData);
          localStorage.setItem("bqomis_user", JSON.stringify(updatedUserData));
        } catch (error) {
          /* ... error handling ... */
        }
      }
    };

    const value = {
      user,
      token,
      isAuthenticated: !!user && !!token,
      isAdmin: user?.role === "ADMIN",
      isClient: user?.role === "CLIENT",
      login,
      logout,
      refreshUserContext,
      loading,
    };
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  };

  export const useAuth = () => useContext(AuthContext);
  ```

**C. Authorization (Role-Based Access Control - RBAC)**

Authorization is implemented primarily through:

1.  **Protected Routes (`App.jsx`):**

    - `AdminProtectedRoute`: A wrapper component that checks if `isAuthenticated` is true AND `isAdmin` is true (derived from `user.role === 'ADMIN'` in `AuthContext`). If not, it redirects the user to the `SignInPage`. This protects all routes under `/admin/*`.
    - `ClientProtectedRoute`: A wrapper component that checks if `isAuthenticated` is true. If not, it redirects to `SignInPage`. This protects client-specific routes like `/client/appointments` or `/client/profile`.

    ```javascript
    // src/App.jsx (Illustrative Snippet for Protected Route)
    const AdminProtectedRoute = () => {
      const { isAuthenticated, isAdmin, loading } = useAuth();
      if (loading) return <div>Loading...</div>;
      if (!isAuthenticated || !isAdmin)
        return <Navigate to="/signin" replace />;
      return <Outlet />; // Renders child routes
    };
    ```

2.  **Conditional UI Rendering:**

    - Within components, UI elements or functionalities might be conditionally rendered based on the user's role obtained from `useAuth().user.role`. For example, an "Edit" button might only be shown if the user has an "ADMIN" or "STAFF" role with specific permissions.

3.  **Backend Enforcement:**
    - **Crucially, the frontend RBAC is for UI/UX purposes.** True security is enforced by the backend. The backend APIs must validate the JWT on every protected request and check if the authenticated user's role has the necessary permissions to perform the requested action (e.g., only an ADMIN can delete a branch).

**D. Client Sign-Up (`SignUpPage.jsx`)**

- New users can register for a "CLIENT" account.
- The `SignUpPage.jsx` collects user details (username, email, password, phone number).
- It makes a `POST` request to `/api/users`, including `role: "CLIENT"` in the payload.
- The backend is responsible for creating the user with the "CLIENT" role and securely hashing the password.
- Successful registration typically redirects the user to the `SignInPage`.

This system provides a foundational layer for securing the application and ensuring users can only access appropriate features and data based on their roles.

### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.6. Core Concepts - Common Reusable Components

To promote consistency, reduce code duplication, and streamline development, the BQOMIS Frontend utilizes several common reusable UI components. These components are typically generic in nature and can be used across various features and pages. They are primarily located in the `src/components/common/` and `src/components/layout/` directories.

**A. Purpose of Reusable Components**

- **Consistency:** Ensure UI elements like modals, buttons, and navigation bars have a uniform look and feel throughout the application.
- **Maintainability:** Changes to a common UI element only need to be made in one place.
- **Efficiency:** Speeds up development as pre-built components can be easily integrated into new features.
- **Encapsulation:** Complex UI logic or styling can be encapsulated within a component, making the consuming pages cleaner.

**B. Key Reusable Components**

1.  **Layout Components (`src/components/layout/`)**

    - These components define the overall page structure for different sections of the application.
    - **`AdminLayout.jsx`:**
      - Provides the standard layout for all admin-facing pages.
      - Typically includes a `TopNav.jsx`, `SidebarNav.jsx` (configured with admin navigation items), and a `Footer.jsx`.
      - Uses `<Outlet />` from `react-router-dom` to render the content of specific admin pages.
    - **`ClientLayout.jsx`:**
      - Provides the standard layout for client-facing pages.
      - Also includes a `TopNav.jsx`, `SidebarNav.jsx` (configured with client navigation items), and a `Footer.jsx`.
      - Uses `<Outlet />`.
    - **`TopNav.jsx`:**
      - A generic top navigation bar component.
      - Displays the application title ("BQOMIS").
      - Shows user information (e.g., "Hi, [Username]") and a "Sign Out" button when a user is authenticated (using `AuthContext`).
      - Used by both `AdminLayout` and `ClientLayout`.
    - **`SidebarNav.jsx`:**
      - A generic sidebar navigation component.
      - Accepts a `navigationItems` prop (an array of objects defining links, labels, and icons).
      - Displays user profile information (avatar placeholder, username, email) from `AuthContext`.
      - Uses `<NavLink>` for navigation links to highlight the active route.
      - Configured with different `navigationItems` for admin and client layouts.
    - **`Footer.jsx`:**
      - A simple footer component displaying copyright information or other branding elements.
      - Can be generic or have slight variations for admin/client sections if needed.

2.  **Common UI Elements (`src/components/common/`)**

    - **`Modal.jsx`:**
      - A generic modal dialog component.
      - Props: `isOpen` (boolean to control visibility), `onClose` (function to close the modal), `title` (string for the modal header), `children` (content to be rendered within the modal body).
      - Provides an overlay and a content area, with a close button in the header.
      - Used for forms (e.g., `BranchForm`, `ServiceForm`, `UserForm`, password change) and detail views.
      - **Snippet Structure:**
        ```javascript
        // <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="My Modal">
        //   <p>Modal content goes here.</p>
        // </Modal>
        ```
    - **`ConfirmationDialog.jsx`:**
      - A specialized modal for prompting users to confirm actions (e.g., deletion).
      - Built using the `Modal` component or as a standalone.
      - Props: `isOpen`, `onClose` (for cancel), `onConfirm` (function for confirm action), `title`, `message`, `confirmButtonText`, `cancelButtonText`, `confirmButtonVariant` (e.g., "danger").
      - Used extensively before destructive operations like deleting branches, services, users, or appointments.
      - **Snippet Structure:**
        ```javascript
        // <ConfirmationDialog
        //   isOpen={isConfirmOpen}
        //   title="Confirm Action"
        //   message="Are you sure?"
        //   onConfirm={handleConfirm}
        //   onCancel={() => setIsConfirmOpen(false)}
        // />
        ```
    - **Buttons, Inputs, etc. (Implicit):**
      - While not always extracted into separate files like `<Button.jsx>` or `<Input.jsx>` in the provided examples, the SCSS styling for common HTML elements like buttons (`.btn`, `.btn-primary`, `.btn-danger`, `.btn-sm`) and form inputs (`.form-group input`, `.form-group select`) aims for global consistency.
      - In a larger application, these might be further componentized for more complex behavior or variations (e.g., `<ButtonWithSpinner />`).

3.  **Feature-Specific Reusable Components (within `src/features/`)**
    - **`HourChunkStatus.jsx` (`src/components/client/` or could be `src/features/client/common/`):**
      - Displays the 8-chunk hourly traffic status visualizer for services.
      - Accepts an `hourlyStatus` prop (array of color strings: "green", "yellow", "red").
      - Used on the `ClientFindBranchPage.jsx`.
    - Forms like `BranchForm.jsx`, `ServiceForm.jsx`, `UserForm.jsx` (located in `src/features/admin/...`) are also reusable in the sense that they handle both "create" and "edit" modes for their respective entities, typically displayed within a `Modal`.

**C. Benefits Realized**

- **Standardized Modals:** All create/edit forms and confirmation prompts use a consistent modal presentation.
- **Consistent Navigation:** Admin and Client sections share the same structural navigation components (`TopNav`, `SidebarNav`), ensuring a familiar user experience pattern.
- **Reduced Styling Duplication:** Global SCSS variables and utility classes for common elements like buttons and form groups reduce the need to restyle similar elements repeatedly.

By leveraging these common reusable components, the BQOMIS frontend achieves a higher degree of maintainability, consistency, and development speed. As the application grows, more components may be identified as candidates for generalization and inclusion in the `common/` directory.

### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.3. Core Concepts - Styling & Theming

The BQOMIS Frontend employs SCSS (Sassy CSS) for styling, enabling a more organized, maintainable, and powerful approach compared to plain CSS. A global theming strategy is implemented using SCSS variables to ensure visual consistency across the application.

**A. SCSS (Sassy CSS)**

- **Why SCSS?**

  - **Variables:** Allows defining reusable values for colors, fonts, spacing, etc.
  - **Nesting:** Provides a way to nest CSS selectors in a way that mimics HTML structure, making stylesheets more readable.
  - **Partials & Imports:** SCSS files can be broken down into smaller, manageable partials (prefixed with an underscore, e.g., `_variables.scss`) which can then be imported into other SCSS files. The modern `@use` rule is preferred over the older `@import`.
  - **Mixins:** Enable defining reusable blocks of CSS declarations.
  - **Functions:** Allow for more complex operations on values.
  - **Modularity:** Styles can be co-located with their respective components or organized by feature.

- **Compilation:** Vite handles the compilation of SCSS files into standard CSS that browsers can understand. The `sass` package is a prerequisite dependency for this.

**B. Global Theming with SCSS Variables (`_variables.scss`)**

A central file, `src/assets/styles/_variables.scss`, defines the application's design tokens.

- **Purpose:**

  - Provides a single source of truth for the visual identity of the application.
  - Makes sitewide theme changes (e.g., altering the primary brand color) easy by modifying a single file.
  - Ensures consistency in UI elements.

- **Contents:**

  - **Color Palette:**
    - Primary, secondary, and accent colors (with dark/light variations).
    - Neutral/grayscale colors for text, backgrounds, borders.
    - Semantic colors for states like success, error, warning, info.
  - **UI Element Colors:** Variables that map palette colors to specific UI uses (e.g., `$bg-primary`, `$text-link`, `$btn-primary-bg`).
  - **Typography (Optional but Recommended):** Font families, base font sizes, line heights.
  - **Spacing Units (Optional but Recommended):** Consistent spacing values (e.g., `$spacing-sm`, `$spacing-md`).
  - **Border Radius & Other UI Primitives.**

- **Example Snippet (`_variables.scss`):**

  ```scss
  // src/assets/styles/_variables.scss

  // --- COLOR PALETTE ---
  $primary-color: #646cff;
  $primary-color-dark: #535bf2;
  // ... other palette colors ...

  $neutral-darker: #242424;
  $neutral-lightest: #f0f0f0;
  // ... other neutral colors ...

  $error-color: #dc3545;

  // --- UI ELEMENT COLORS ---
  $bg-primary: $neutral-darker;
  $bg-secondary: #2c2c2e; // e.g., for sidebars, cards
  $bg-tertiary: #3a3a3a; // e.g., for input fields

  $text-primary: $neutral-lightest;
  $text-secondary: #aaaaaa;
  $text-link: $primary-color;

  $border-color: #555555;

  // --- SPACING ---
  $spacing-sm: 8px;
  $spacing-md: 16px;
  $spacing-lg: 24px;

  // --- BORDERS ---
  $border-radius-sm: 4px;
  $border-radius-md: 8px;
  ```

**C. Global Stylesheet (`main.scss`)**

The file `src/assets/styles/main.scss` serves as the primary entry point for global styles.

- **Importing Variables:** It's the first file to import (using `@use ... as *;`) the `_variables.scss` file, making these variables accessible to all subsequently imported SCSS files or components whose styles are processed as part of the global build.
  ```scss
  // src/assets/styles/main.scss
  @use "variables" as *; // Makes variables like $primary-color directly usable
  ```
- **Resets/Normalize (Optional):** Can include CSS resets or normalize stylesheets to ensure consistent base styling across browsers.
- **Global Base Styles:** Defines styles for fundamental HTML elements like `body`, `a`, headings (`h1`-`h6`), etc., using the defined SCSS variables.

  ```scss
  // src/assets/styles/main.scss (continued)
  body {
    margin: 0;
    font-family: $font-family-sans-serif; // Example variable use
    line-height: $line-height-base;
    color: $text-primary;
    background-color: $bg-primary;
  }

  a {
    color: $text-link;
    &:hover {
      color: $text-link-hover;
    }
  }
  ```

- **Global Utility Classes (Optional):** Can define common utility classes (e.g., for margins, padding, text alignment) if not using a utility-first framework.
- **Importing `main.scss`:** This global stylesheet is imported once in the application's main entry point, `src/main.jsx`, ensuring the styles are applied application-wide.
  ```javascript
  // src/main.jsx
  import "./assets/styles/main.scss";
  ```

**D. Component-Specific Styles**

- Each React component can have its own dedicated SCSS file (e.g., `MyComponent.jsx` and `MyComponent.scss`).
- These component-specific SCSS files directly use the global variables defined in `_variables.scss` (because `main.scss` makes them available via `@use ... as *;` and `main.scss` is globally imported).
- This approach promotes modularity and co-location of styles with their components.

  ```scss
  // src/components/common/Button.scss (Example)
  // No need to @use 'variables' again if main.scss does it with 'as *'

  .btn {
    padding: $spacing-sm $spacing-md; // Using global spacing variables
    border-radius: $border-radius-sm; // Using global border-radius
    cursor: pointer;
    font-weight: 500;
  }

  .btn-primary {
    background-color: $primary-color; // Using global color variable
    color: $text-on-primary-bg;
    &:hover {
      background-color: $primary-color-dark;
    }
  }
  ```

This styling architecture provides a robust, maintainable, and themeable foundation for the BQOMIS frontend, ensuring visual consistency while allowing for component-specific styling needs. The use of global SCSS variables is central to achieving an easily adaptable theme.

### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.4. Core Concepts - API Interaction

The BQOMIS Frontend is a client-side application that relies heavily on communication with the BQOMIS Backend (a Spring Boot application) to fetch data, submit changes, and perform operations. This interaction is facilitated through RESTful API calls.

**A. API Service Modules (`src/api/`)**

- **Organization:** API call logic is organized into dedicated service modules located in the `src/api/` directory. Each module typically groups functions related to a specific backend resource or controller (e.g., `userService.js`, `branchService.js`, `appointmentService.js`).
- **Purpose:**
  - Centralizes API call logic, making it easier to manage, update, and test.
  - Abstracts the details of HTTP requests (method, headers, body construction, URL formation) from the UI components.
  - Promotes reusability of API call functions across different parts of the application.

**B. Base URL Configuration**

- The base URL for all backend API calls is configured using an environment variable.
- This is defined in the `.env` file at the root of the project:
  ```env
  VITE_API_BASE_URL=http://localhost:8080/api
  ```
- Vite makes these environment variables accessible in the frontend code via `import.meta.env.VITE_API_BASE_URL`.
- API service functions prepend this base URL to the specific endpoint paths.

  ```javascript
  // Example in an API service file
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  export const getAllBranches = async (token) => {
    // ...
    const response = await fetch(`${API_BASE_URL}/branches`, {
      /* ... */
    });
    // ...
  };
  ```

**C. Making HTTP Requests (Fetch API)**

- The application primarily uses the browser's built-in `fetch` API for making HTTP requests.
- Common HTTP methods used include `GET` (to retrieve data), `POST` (to create new resources), `PUT` or `PATCH` (to update existing resources), and `DELETE` (to remove resources).

**D. Request Headers**

- **`Content-Type`:** For requests that send a body (like `POST`, `PUT`, `PATCH`), the `Content-Type` header is typically set to `application/json` to indicate that the request body is JSON formatted.
  ```javascript
  headers: {
    'Content-Type': 'application/json',
    // ... other headers
  }
  ```
- **`Authorization` (for Protected Endpoints):**

  - When interacting with backend endpoints that require authentication, a JSON Web Token (JWT) is included in the `Authorization` header using the "Bearer" scheme.
  - The token is retrieved from the `AuthContext` (or `localStorage` where it's persisted).

  ```javascript
  // Example from an API service function
  const { token } = useAuth(); // Assuming token is available via context or direct retrieval

  // ...
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  // ...
  ```

**E. Request Body Construction**

- For `POST`, `PUT`, and `PATCH` requests, data is sent in the request body, typically as a JSON string.
- The `JSON.stringify()` method is used to convert JavaScript objects into a JSON string before sending.
  ```javascript
  // Example
  const userData = { username: "newuser", email: "new@example.com" };
  // ...
  body: JSON.stringify(userData);
  // ...
  ```

**F. Response Handling (`handleResponse` Utility)**

A common utility function, often named `handleResponse`, is used within API service modules to process the raw response from the `fetch` API.

- **Purpose:**

  - Checks if the HTTP response status indicates success (e.g., `response.ok` which checks for status codes in the 200-299 range).
  - If the response is not okay, it attempts to parse an error message from the JSON body of the error response (common for Spring Boot error handling) or falls back to the status text. It then throws an error, which can be caught by the calling component.
  - If the response is successful:
    - For `204 No Content` responses (common for `DELETE` or some `PUT` operations), it returns `null` or a success indicator.
    - For responses with a JSON body, it parses the JSON using `response.json()`.
    - For responses with other content types (e.g., plain text), it might use `response.text()`.

- **Example `handleResponse` Snippet:**
  ```javascript
  // Typically defined in each API service file or a shared apiUtils.js
  const handleResponse = async (response) => {
    if (!response.ok) {
      // Try to parse error message from backend, otherwise use status text
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    // For DELETE or other methods that might not return JSON content but are successful
    if (response.status === 204) {
      return null;
    }
    // Attempt to parse JSON, handle cases where it might be text for certain success responses
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
      return response.json();
    } else {
      // Could be a simple text success message from backend
      return response.text().then((text) => text || null); // Return null if text is empty
    }
  };
  ```

**G. Asynchronous Operations (`async/await`)**

- All API calls are asynchronous operations. The `async/await` syntax is used extensively to handle these promises in a more readable and synchronous-looking style.
- UI components that trigger API calls typically use `async` functions for their event handlers or `useEffect` callbacks and `await` the completion of the API service function call.
- `try...catch` blocks are used in components to handle potential errors thrown by the API service functions (originating from `handleResponse`).

This structured approach to API interaction ensures that:

- Backend communication logic is encapsulated and reusable.
- Authentication tokens are consistently applied to protected requests.
- Responses are handled uniformly, and errors are propagated for UI display.
- The main UI components remain focused on presentation and user interaction, delegating data fetching and submission to the API service layer.

### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.5. Core Concepts - State Management

State management in the BQOMIS Frontend primarily relies on React's built-in mechanisms: local component state using the `useState` and `useReducer` hooks, and global/shared state using the React Context API. For the current scope of the application, dedicated third-party state management libraries like Redux, Zustand, or Recoil have not been heavily emphasized, favoring a simpler, React-native approach where appropriate.

**A. Local Component State (`useState`, `useReducer`)**

- **`useState` Hook:**

  - This is the most common way to manage state that is local to a single component or a small group of closely related components.
  - Used for managing UI state (e.g., form input values, modal visibility, loading indicators within a component, toggle states).
  - **Example:**

    ```javascript
    // Inside a React functional component
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleInputChange = (e) => {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
    ```

- **`useReducer` Hook:**
  - Used for more complex state logic within a component, especially when the next state depends on the previous one, or when multiple sub-values are involved.
  - While available, `useState` has been sufficient for most local state needs in the BQOMIS frontend examples provided so far. `useReducer` might be adopted if a component's local state logic becomes significantly more intricate.

**B. Global/Shared State (React Context API)**

The React Context API is used for state that needs to be accessible by many components at different nesting levels, without explicitly passing props down through every level of the component tree ("prop drilling").

- **`AuthContext.jsx`:**

  - This is the primary example of global state management in BQOMIS.
  - It manages the authenticated user's information, JWT token, authentication status, and provides login/logout functions.
  - **Creation:** A context is created using `createContext()`.
  - **Provider:** An `<AuthProvider>` component wraps parts of the application (in this case, the entire `<App />`) and uses the `<AuthContext.Provider>` to make the authentication state and functions available to all descendant components.
  - **Consumer:** Components consume the context value using the `useContext` hook (via a custom hook `useAuth()`).

  ```javascript
  // src/contexts/AuthContext.jsx (Simplified)
  import React, {
    createContext,
    useContext,
    useState /*, useEffect */,
  } from "react";

  const AuthContext = createContext(null);

  export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    // ... login, logout, loading state, etc. ...

    const value = { user, token /* ... other auth data and functions ... */ };
    return (
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
  };

  export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
  };
  ```

- **Other Potential Contexts (If Needed):**
  - If other pieces of global state emerge (e.g., application-wide theme preferences, notification system state), additional contexts could be created following the same pattern.

**C. Server State Management & Caching (Considerations)**

- **Current Approach:** Data fetched from the API is typically stored in local component state (e.g., `useState([])` for a list of branches). When data needs to be refreshed, the API call is re-triggered (often via `useEffect` or a manual refresh action).
- **Fetching and Re-fetching Logic:**

  - `useEffect` hook is commonly used to fetch data when a component mounts or when certain dependencies (like a user ID, filter parameters, or the auth token) change.
  - `useCallback` is used to memoize functions like `fetchData` to prevent unnecessary re-fetches if passed as dependencies to `useEffect`.

  ```javascript
  // Example in a page component
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const result = await someApiServiceFunction(token);
      setData(result || []);
    } catch (error) {
      /* ... */
    } finally {
      setIsLoading(false);
    }
  }, [token]); // Dependency on token

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Re-fetch if fetchData identity changes (due to token change)
  ```

- **Future Enhancements (Data Caching Libraries):**
  - For more sophisticated server state management, including automatic caching, background updates, optimistic updates, and deduplication of requests, libraries like:
    - **React Query (TanStack Query)**
    - **SWR**
  - These libraries are not currently implemented in the BQOMIS frontend examples but are strong candidates if the application scales and requires more advanced data fetching and caching strategies to improve performance and user experience. They help manage the "server cache" distinct from UI state.

**D. Prop Drilling vs. Context**

- For state that is only needed by a component and its direct children, passing props is the standard and simplest approach.
- Context API is reserved for truly global state or state that needs to be shared across deeply nested components where prop drilling would become cumbersome.

**Summary of Strategy:**

The BQOMIS frontend currently employs a pragmatic state management strategy:

1.  **Local State First:** Use `useState` for component-specific UI and data.
2.  **Global State for Cross-Cutting Concerns:** Utilize React Context API (e.g., `AuthContext`) for application-wide state like authentication.
3.  **Server State:** Managed within components using `useState`/`useEffect` for fetching and storing API data, with potential to integrate dedicated data fetching/caching libraries if complexity grows.

This approach keeps the initial setup lean while providing pathways for more advanced state management solutions as the application evolves.

---

## II. Client Application Features

### 1. Authentication

Client authentication is the gateway for users to access personalized features of the BQOMIS application, such as booking appointments and managing their profile. It involves verifying a user's identity (Sign In) and allowing new users to create an account (Sign Up).

#### 1.1. Sign In (`SignInPage.jsx`)

- **Purpose:** Allows existing users to log into their BQOMIS accounts.
- **Accessibility:** Publicly accessible via the `/signin` route. It's also the default route if a user tries to access a protected area without being authenticated or navigates to the application root (`/`).
- **UI Elements:**

  - Email input field.
  - Password input field.
  - "Sign In" button.
  - Link to the "Sign Up" page for users who don't have an account.
  - Display area for error messages (e.g., "Invalid credentials").

- **Workflow:**

  1.  The user enters their email and password.
  2.  Upon clicking "Sign In," client-side validation (e.g., checking for empty fields) is performed.
  3.  The `login` function from `AuthContext` (exposed via the `useAuth()` hook) is called with the email and password.
      - _(In the current mocked implementation, this `login` function simulates an API call and checks credentials against predefined admin/client values. In a production system, it would make an API request to a backend authentication endpoint.)_
  4.  **On Successful Login:**
      - The `AuthContext` updates its state with the user's information and JWT.
      - User data and token are stored in `localStorage` for session persistence.
      - The user is redirected:
        - To `/admin/dashboard` if their role is "ADMIN".
        - To `/client/home` if their role is "CLIENT".
        - If the user was attempting to access a protected route before login, they are redirected back to that intended route (handled by `location.state?.from?.pathname` in `SignInPage` and protected route components).
  5.  **On Failed Login:**
      - An error message is displayed on the `SignInPage`.

- **Key Code Snippet (`SignInPage.jsx` - illustrating form handling):**

  ```javascript
  // src/pages/SignInPage.jsx (Illustrative)
  import React, { useState } from "react";
  import { useNavigate, useLocation, Link } from "react-router-dom";
  import { useAuth } from "../contexts/AuthContext";
  // import './SignInPage.scss'; // Styles

  const SignInPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname;

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setLoading(true);
      try {
        const user = await auth.login(email, password);
        if (user) {
          const redirectTo =
            from ||
            (user.role === "ADMIN" ? "/admin/dashboard" : "/client/home");
          navigate(redirectTo, { replace: true });
        }
      } catch (err) {
        setError(err.message || "Failed to sign in.");
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
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {/* Password Input */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <button type="submit" disabled={loading} className="signin-button">
              {loading ? "Signing In..." : "Sign In"}
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

- **Purpose:** Allows new users to register for a BQOMIS client account.
- **Accessibility:** Publicly accessible via the `/signup` route, typically linked from the `SignInPage`.
- **UI Elements:**

  - Username input field.
  - Email input field.
  - Phone Number input field (optional).
  - Password input field.
  - Confirm Password input field.
  - "Sign Up" button.
  - Link to the "Sign In" page for users who already have an account.
  - Display area for error and success messages.

- **Workflow:**

  1.  The user fills in the registration form.
  2.  Upon clicking "Sign Up," client-side validation is performed:
      - Required fields (username, email, password, confirm password).
      - Password and Confirm Password match.
      - Minimum password length/complexity (basic check).
      - Basic email format check.
  3.  If client-side validation passes, an API call is made to `POST /api/users` (using the `registerClientUser` function from `userService.js`).
  4.  **Payload to Backend:** The frontend constructs a payload including `username`, `email`, `phoneNumber` (if provided), `password`, and hardcodes `role: "CLIENT"`.
  5.  **Backend Responsibility:**
      - Performs its own validation (e.g., uniqueness of email/username).
      - Hashes the password securely.
      - Creates the new user record with the "CLIENT" role.
  6.  **On Successful Registration (Frontend):**
      - A success message is displayed (e.g., "Registration successful! Redirecting to sign in...").
      - The form is typically cleared.
      - After a short delay (to allow the user to read the message), the user is redirected to the `/signin` page.
  7.  **On Failed Registration (Frontend):**
      - An error message from the API (e.g., "Email already in use," "Username taken") or a generic failure message is displayed.

- **Redirection after Sign Up:** The current implementation redirects to the Sign In page. An alternative could be to automatically log the user in if the backend registration endpoint returns a JWT and user details upon success.

- **Key Code Snippet (`SignUpPage.jsx` - illustrating form handling and API call):**

  ```javascript
  // src/pages/SignUpPage.jsx (Illustrative)
  import React, { useState, useEffect } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { registerClientUser } from "../api/userService";
  import { useAuth } from "../contexts/AuthContext"; // To redirect if already logged in
  // import './SignUpPage.scss'; // Styles

  const SignUpPage = () => {
    const [formData, setFormData] = useState({
      /* ... initial empty fields ... */
    });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
      if (isAuthenticated) navigate("/client/home");
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
      e.preventDefault();
      // ... client-side validation logic ...
      if (validationFails) {
        setError("Validation message");
        return;
      }

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
        setSuccessMessage("Registration successful! Redirecting to sign in...");
        setTimeout(() => navigate("/signin"), 2000);
      } catch (err) {
        setError(err.message || "Registration failed.");
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

### II.2. Client Features - Home Page (`ClientHomePage.jsx`)

- **Purpose:** The `ClientHomePage.jsx` serves as the primary landing page for authenticated clients. It aims to provide a personalized welcome, quick access to key functionalities, and a summary of important information, such as their next upcoming appointment.
- **Accessibility:** Accessible via the `/client/home` route. It's typically the page users are redirected to after a successful client login. This route is protected and requires authentication.

- **Key UI Elements & Functionality:**

  1.  **Personalized Greeting:**

      - Displays a welcome message that includes the logged-in user's username (e.g., "Welcome back, [Username]!").
      - The username is retrieved from the `user` object provided by the `AuthContext`.

  2.  **Upcoming Appointment Summary:**

      - Shows details of the user's _next_ scheduled or active appointment, if one exists.
      - Information displayed includes:
        - Service Name
        - Branch Name
        - Full Date (e.g., "Monday, July 15, 2024")
        - Time (e.g., "10:30 AM")
        - Current Status (e.g., "SCHEDULED", "ACTIVE") with a visual status badge.
      - Provides a link/button ("View All My Appointments") that navigates the user to the `ClientMyAppointmentsPage.jsx`.
      - If no upcoming appointments are found, a message indicating this is shown.
      - **Data Fetching:**
        - On component mount (or when user/token changes), it calls the `getAppointmentsByUserId` function from `appointmentService.js` using the logged-in user's ID and token.
        - The fetched appointments (which, thanks to the enhanced `Appointment` DTO, include `serviceName` and `branchName`) are then filtered client-side to find only those that are "SCHEDULED" or "ACTIVE" and occur on or after the current date.
        - The list is sorted chronologically, and the first appointment is selected as the "next upcoming."
      - Displays loading and error states during data fetching.

  3.  **Quick Actions Section:**
      - Provides prominent links or "cards" for common client tasks:
        - **"Book New Appointment":** Links to `ClientFindBranchPage.jsx` (`/client/branches`) to start the process of finding a branch and booking a new service.
        - **"My Appointments":** Links to `ClientMyAppointmentsPage.jsx` (`/client/appointments`).
        - **"My Profile":** Links to `ClientProfilePage.jsx` (`/client/profile`).
      - Each action card typically includes an icon, a title, and a brief description.

- **State Management:**

  - `nextUpcomingAppointment`: Stores the fetched upcoming appointment object or `null`.
  - `isLoadingAppointment`: Boolean to indicate if appointment data is being fetched.
  - `appointmentError`: Stores any error message related to fetching appointment data.

- **Key Code Snippet (`ClientHomePage.jsx` - illustrating data fetching and display logic):**

  ```javascript
  // src/pages/client/ClientHomePage.jsx (Illustrative Structure)
  import React, { useState, useEffect, useCallback } from "react";
  import { Link } from "react-router-dom";
  import { useAuth } from "../../contexts/AuthContext";
  import { getAppointmentsByUserId } from "../../api/appointmentService";
  // import './ClientHomePage.scss'; // Styles

  const ClientHomePage = () => {
    const { user, token, isAuthenticated } = useAuth();
    const [nextUpcomingAppointment, setNextUpcomingAppointment] =
      useState(null);
    const [isLoadingAppointment, setIsLoadingAppointment] = useState(false);
    // ... other state like appointmentError ...

    const fetchNextAppointment = useCallback(async () => {
      if (!isAuthenticated || !user?.id || !token) return;
      setIsLoadingAppointment(true);
      try {
        const userAppointments = await getAppointmentsByUserId(user.id, token);
        const todayStr = new Date().toISOString().split("T")[0];
        const upcoming = (userAppointments || [])
          .filter(
            (app) =>
              app.date >= todayStr &&
              (app.status?.toUpperCase() === "SCHEDULED" ||
                app.status?.toUpperCase() === "ACTIVE")
          )
          .sort(
            (a, b) =>
              new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time)
          );
        setNextUpcomingAppointment(upcoming.length > 0 ? upcoming[0] : null);
      } catch (err) {
        /* ... setError ... */
      } finally {
        setIsLoadingAppointment(false);
      }
    }, [user, token, isAuthenticated]);

    useEffect(() => {
      fetchNextAppointment();
    }, [fetchNextAppointment]);

    return (
      <div className="client-home-page">
        <header className="home-header">
          <h1>Welcome back, {user?.username || "Guest"}!</h1>
          {/* ... intro paragraph ... */}
        </header>

        <section className="upcoming-appointment-section">
          <h2>Your Next Appointment</h2>
          {isLoadingAppointment && <p>Loading...</p>}
          {/* ... Display nextUpcomingAppointment details if present, else "No upcoming..." ... */}
          {nextUpcomingAppointment && (
            <div className="appointment-summary-card">
              <h3>{nextUpcomingAppointment.serviceName}</h3>
              <p>
                <strong>Branch:</strong> {nextUpcomingAppointment.branchName}
              </p>
              {/* ... Date, Time, Status ... */}
              <Link to="/client/appointments" className="btn btn-secondary">
                View All
              </Link>
            </div>
          )}
          {!isLoadingAppointment && !nextUpcomingAppointment && (
            <p>No upcoming appointments.</p>
          )}
        </section>

        <section className="quick-actions-section">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/client/branches" className="action-card">
              {/* ... Book New ... */}
            </Link>
            <Link to="/client/appointments" className="action-card">
              {/* ... My Appointments ... */}
            </Link>
            <Link to="/client/profile" className="action-card">
              {/* ... My Profile ... */}
            </Link>
          </div>
        </section>
      </div>
    );
  };
  export default ClientHomePage;
  ```

The `ClientHomePage.jsx` acts as a welcoming and functional dashboard for clients, providing immediate value by highlighting relevant information and offering easy navigation to core features of the BQOMIS system.

### II.3. Client Features - Branch & Service Discovery (`ClientFindBranchPage.jsx`)

- **Purpose:** This page allows clients to find bank branches and discover the services they offer. A key feature is the display of estimated hourly queue traffic for services, helping clients choose less busy times if they are flexible. The UI employs a progressive selection mechanism, guiding the user from selecting a province, then a district, then a branch, and finally viewing the services at that branch.
- **Accessibility:** Accessible via the `/client/branches` route, typically linked from the client home page or main navigation as "Find Branch & Services" or "Book New Appointment." This route is protected and requires client authentication.

- **Key UI Elements & Workflow:**

  1.  **Progressive Selection UI:**

      - The page presents a single primary selection area that dynamically changes based on the user's choices.
      - A "breadcrumb" style path at the top shows the current selections (e.g., "Selected Province > Selected District > Selected Branch") and allows users to click on a previous step to go back and change their selection.

  2.  **Selection Steps:**

      - **Step 1: Select Province:**
        - Initially, the page prompts "1. Select a Province."
        - A list of available provinces (derived from all fetched districts) is displayed.
        - Upon selecting a province, the UI updates.
      - **Step 2: Select District:**
        - The prompt changes to "2. Select a District in [Selected Province Name]."
        - A list of districts _within the chosen province_ is displayed.
        - Upon selecting a district, the UI updates.
      - **Step 3: Select Branch:**
        - The prompt changes to "3. Select a Branch in [Selected District Name]."
        - A list of branches _within the chosen district_ is displayed, showing branch name and address.
        - Upon selecting a branch, the primary selection list area is cleared, and the page transitions to display services for that branch.
      - **Step 4: View Services & Traffic:**
        - The header changes to "Services at [Selected Branch Name]."
        - A list of services offered by the selected branch is displayed. Each service item includes:
          - Service Name.
          - (Optional) Service Description.
          - The `HourChunkStatus.jsx` component, visualizing estimated traffic for that service across a typical 8-hour workday (e.g., 8 AM - 5 PM).
          - A "Book this Service" button.

  3.  **Data Fetching Logic:**

      - **Initial Load:**
        - `GET /api/districts` (via `getAllDistricts`): Fetches all districts. Provinces are then derived from this data client-side to populate the initial province selection list.
      - **On District Selection:**
        - `GET /api/branches/district/{districtName}` (via `getBranchesByDistrictName`): Fetches branches for the selected district.
      - **On Branch Selection (Complex Data Aggregation):**
        1.  `GET /api/branch-services/branch/{branchId}` (via `getBranchServicesByBranchId`): Fetches all `BranchService` link objects for the selected branch. These objects contain `serviceId`, `serviceName`, and the crucial `id` of the `BranchService` link itself (`branchServiceId` needed for appointment booking).
        2.  `GET /api/appointments/today/branch/{branchId}` (via `getTodaysAppointmentsForBranch`): Fetches _all_ appointments scheduled for the selected branch _for the current day_.
        3.  **Client-Side Processing for Traffic:** For each `BranchService` link (representing a service offered):
            - The frontend filters the `allBranchAppointmentsToday` list to find appointments specifically matching the current `BranchService` link's ID (`app.branchServiceId === bsLink.id`).
            - It then counts these filtered appointments per hour (e.g., 8 AM - 5 PM, in 1-hour buckets).
            - Based on predefined thresholds (`QUEUE_THRESHOLDS.LOW`, `QUEUE_THRESHOLDS.MODERATE`), it generates an array of 9 status strings (e.g., "green", "yellow", "red") representing the traffic for each hour slot.
            - This `hourlyTraffic` array, along with service details, is stored to be passed to the `HourChunkStatus` component.

  4.  **`HourChunkStatus.jsx` Component (`src/components/client/HourChunkStatus.jsx`):**

      - **Purpose:** A reusable component to display the hourly traffic visualization.
      - **Input:** Takes an `hourlyStatus` prop (an array of 9 color strings).
      - **Output:** Renders a series of 9 colored bars, each representing an hour from 8 AM to 4 PM (covering up to 4:59 PM). Tooltips or labels indicate the hour for each bar.
        - Green: Low traffic
        - Yellow: Moderate traffic
        - Red: High traffic
      - **Code Snippet (`HourChunkStatus.jsx`):**

        ```javascript
        // src/components/client/HourChunkStatus.jsx (Illustrative)
        import React from "react";
        // import './HourChunkStatus.scss';

        const HourChunkStatus = ({ hourlyStatus }) => {
          const hours = [
            "8am",
            "9am",
            "10am",
            "11am",
            "12pm",
            "1pm",
            "2pm",
            "3pm",
            "4pm",
          ];
          if (!hourlyStatus || hourlyStatus.length !== 9) return null;

          return (
            <div className="hour-chunk-status-container">
              <p className="status-label">
                Today's Estimated Traffic (8am - 5pm):
              </p>
              <div className="chunks-wrapper">
                {hourlyStatus.map((status, index) => (
                  <div
                    key={index}
                    className="hour-chunk-item"
                    title={hours[index]}
                  >
                    <div className={`chunk-bar chunk-${status}`}></div>
                    <span className="chunk-hour-label">{hours[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        };
        export default HourChunkStatus;
        ```

  5.  **Navigation to Booking:**
      - Each service card in the final step has a "Book this Service" button.
      - Clicking this button navigates the user to the `ClientBookAppointmentPage.jsx` (`/client/book-appointment`).
      - Crucial information is passed via `location.state`:
        - The selected `branch` object.
        - A `service` object containing `serviceId` (actual service ID), `serviceName`, and importantly, `branchServiceId` (the ID of the `BranchService` link that connects this specific branch and service, required for creating the appointment).

- **State Management:**

  - `currentStep`: Tracks the current stage of selection ('province', 'district', 'branch', 'services').
  - `allDistrictsData`: Stores the raw district data from the API.
  - `selectableItems`: An array of items (provinces, districts, or branches) currently being displayed for selection.
  - `selectedProvince`, `selectedDistrict` (object), `selectedBranch` (object): Store the user's choices at each step.
  - `servicesWithTraffic`: An array of objects, where each object contains service details and its calculated `hourlyTraffic` array.
  - Various `isLoading` and `error` states for different API calls.

- **User Experience:**

  - The progressive disclosure aims to prevent overwhelming the user with too many options at once.
  - The traffic visualizer provides actionable insight for clients.
  - Clear path navigation allows users to easily backtrack and modify earlier selections.

- **Code Snippet (`ClientFindBranchPage.jsx` - highlighting `handleBranchSelect` for traffic calculation):**

  ```javascript
  // src/pages/client/ClientFindBranchPage.jsx (Illustrative handleBranchSelect)
  const handleBranchSelect = async (branch) => {
    setSelectedBranch(branch);
    // ... (set loading, clear errors, set current step) ...

    try {
      const [branchServiceLinksData, branchAppointmentsData] =
        await Promise.all([
          getBranchServicesByBranchId(branch.id, token),
          getTodaysAppointmentsForBranch(branch.id, token),
        ]);

      const branchServiceLinks = branchServiceLinksData || [];
      const allBranchAppointmentsToday = branchAppointmentsData || [];

      const processedServicesTraffic = branchServiceLinks.map((bsLink) => {
        const appointmentsForThisService = allBranchAppointmentsToday.filter(
          (app) => app.branchServiceId === bsLink.id
        );

        const hourlyCounts = Array(9).fill(0); // 8am-5pm
        appointmentsForThisService.forEach((app) => {
          if (app.time) {
            const appHour = parseInt(app.time.split(":")[0]);
            if (appHour >= 8 && appHour <= 16) hourlyCounts[appHour - 8]++;
          }
        });

        const hourlyTrafficStatus = hourlyCounts.map((count) => {
          if (count <= QUEUE_THRESHOLDS.LOW) return "green";
          if (count <= QUEUE_THRESHOLDS.MODERATE) return "yellow";
          return "red";
        });

        return {
          serviceId: bsLink.serviceId,
          branchServiceId: bsLink.id,
          serviceName: bsLink.serviceName,
          hourlyTraffic: hourlyTrafficStatus,
        };
      });
      setServicesWithTraffic(processedServicesTraffic);
    } catch (err) {
      /* ... setError ... */
    } finally {
      /* ... setIsLoading(false) ... */
    }
  };
  ```

This page is a cornerstone of the client's ability to interact with BQOMIS, combining information discovery with decision-support features like the traffic visualizer.

### II.4. Client Features - Appointment Booking (`ClientBookAppointmentPage.jsx`)

- **Purpose:** This page allows clients to finalize their appointment by selecting a specific date and time for a previously chosen service at a particular branch. It focuses on providing available slots and confirming the booking.
- **Accessibility:** Accessible via the `/client/book-appointment` route. Users are typically navigated here from the `ClientFindBranchPage.jsx` after selecting a branch and a specific service they wish to book. This route is protected and requires client authentication.

- **Prerequisites (Data from Previous Page):**

  - The component expects to receive `branch` and `service` information via `location.state` passed during navigation from `ClientFindBranchPage.jsx`.
  - **`branch` object:** Contains details of the selected branch (e.g., `id`, `name`, `address`).
  - **`service` object:** Contains details of the selected service, crucially including:
    - `id` (or `serviceId`): The unique ID of the service itself.
    - `name` (or `serviceName`): The name of the service.
    - `branchServiceId`: The unique ID of the `BranchService` link record that connects this specific branch and service. This `branchServiceId` is **essential** for the backend `POST /api/appointments` request.

- **Key UI Elements & Workflow:**

  1.  **Booking Summary Display:**

      - Prominently displays the selected branch name, address, and the chosen service name to confirm the context for the user.

  2.  **Date Selection:**

      - A date input field (`<input type="date">`) allows the client to choose their desired appointment date.
      - The date picker is typically constrained to prevent selecting past dates.
      - A default date (e.g., today or the next available day) is pre-selected.

  3.  **Time Slot Selection & Availability:**

      - **Dynamic Slot Display:** Once a date is selected (or changes), the system fetches actual appointment availability for that date and specific `branchServiceId`.
      - **API Call:** `GET /api/appointments?date=YYYY-MM-DD&branchServiceId=X` (via `getAppointmentsByDateAndBranchService` from `appointmentService.js`) is called. This endpoint returns all existing appointments for the given date and specific branch-service combination.
      - **Slot Generation & Filtering (Client-Side):**
        - A predefined list of potential time slots is generated (e.g., every 15 or 30 minutes within standard operating hours, like 9:00 AM to 4:45 PM).
        - The frontend then compares this list of potential slots with the `time` values from the fetched _booked_ appointments.
        - Additionally, if the selected date is today, time slots that have already passed are filtered out.
        - Only the remaining _available_ time slots are displayed to the user as clickable buttons.
      - **UI:** Available time slots are shown as a grid of buttons. The currently selected time slot is visually highlighted.
      - If no slots are available for the selected date, a message like "No available time slots for the selected date. Please try another date." is displayed.
      - A loading indicator is shown while fetching slot availability.

  4.  **Form Submission & Appointment Creation:**
      - After selecting a date and an available time slot, a "Confirm Appointment" button becomes active.
      - Upon clicking "Confirm Appointment":
        - Client-side validation ensures a date and time are selected.
        - The `user.id` (from `AuthContext`) is retrieved.
        - An API call is made to `POST /api/appointments` (via `createAppointment` from `appointmentService.js`).
        - **Payload to Backend:**
          ```json
          {
            "userId": /* current user's ID */,
            "branchServiceId": /* from location.state.service.branchServiceId */,
            "date": "YYYY-MM-DD" /* selectedDate */,
            "time": "HH:mm" /* selectedTime */,
            "status": "SCHEDULED" // Default status for new bookings
          }
          ```
      - **On Successful Booking:**
        - A success message is displayed (e.g., "Appointment booked successfully! Your appointment ID is [ID].").
        - The form is typically hidden or disabled.
        - The available time slots for the _current date_ are refreshed to reflect the new booking (the just-booked slot should no longer appear available).
        - A button like "Book Another Appointment" (linking back to `/client/branches`) might appear.
      - **On Failed Booking:**
        - An error message from the API is displayed (e.g., "Failed to book appointment. The slot might have just become unavailable or an error occurred."). This could happen due to race conditions if another user books the same slot simultaneously, or other backend validation failures.

- **State Management:**

  - `branch`, `service`: Store the context passed from the previous page.
  - `selectedDate`, `selectedTime`: Store the user's current selections.
  - `availableTimeSlots`: An array of strings representing the time slots open for booking on the `selectedDate`.
  - `isLoadingTimeSlots`: Boolean for loading state while fetching/calculating available slots.
  - `isSubmitting`: Boolean for loading state during form submission.
  - `error`, `successMessage`: Store feedback messages for the user.

- **Key Code Snippet (`ClientBookAppointmentPage.jsx` - illustrating slot availability logic):**

  ```javascript
  // src/pages/client/ClientBookAppointmentPage.jsx (Illustrative - focus on slot logic)
  import React, { useState, useEffect, useCallback } from "react";
  import { useLocation, useNavigate } from "react-router-dom";
  import { useAuth } from "../../contexts/AuthContext";
  import {
    createAppointment,
    getAppointmentsByDateAndBranchService,
  } from "../../api/appointmentService";
  // import './ClientBookAppointmentPage.scss';

  const generateTimeSlots = () => {
    /* ... returns array of "HH:mm" strings ... */
  };

  const ClientBookAppointmentPage = () => {
    const location = useLocation();
    const { user, token } = useAuth();
    const [service, setService] = useState(location.state?.service);
    const [selectedDate, setSelectedDate] = useState(/* initial date */);
    const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
    const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
    // ... other state ...

    const fetchAndSetAvailableTimeSlots = useCallback(async () => {
      if (!selectedDate || !service?.branchServiceId || !token) {
        setAvailableTimeSlots([]);
        return;
      }
      setIsLoadingTimeSlots(true);
      try {
        const bookedAppointments = await getAppointmentsByDateAndBranchService(
          selectedDate,
          service.branchServiceId,
          token
        );
        const bookedTimes = (bookedAppointments || []).map((app) => app.time);
        const allPossibleSlots = generateTimeSlots();
        const now = new Date();

        const available = allPossibleSlots.filter((slot) => {
          if (bookedTimes.includes(slot)) return false;
          if (selectedDate === now.toISOString().split("T")[0]) {
            // Today
            const [slotHour, slotMinute] = slot.split(":").map(Number);
            if (
              slotHour < now.getHours() ||
              (slotHour === now.getHours() && slotMinute < now.getMinutes())
            ) {
              return false; // Past slot today
            }
          }
          return true;
        });
        setAvailableTimeSlots(available);
      } catch (err) {
        /* ... setError ... */
      } finally {
        setIsLoadingTimeSlots(false);
      }
    }, [selectedDate, service, token]);

    useEffect(() => {
      fetchAndSetAvailableTimeSlots();
    }, [fetchAndSetAvailableTimeSlots]);

    // ... handleSubmit, handleDateChange, handleTimeSelect ...

    return (
      <div className="client-book-appointment-page">
        {/* ... Summary of branch & service ... */}
        {/* ... Form with date input ... */}
        {selectedDate && (
          <div className="form-group">
            <label>Select Available Time Slot:</label>
            {isLoadingTimeSlots && <p>Loading slots...</p>}
            {!isLoadingTimeSlots && availableTimeSlots.length > 0 && (
              <div className="time-slots-container">
                {availableTimeSlots.map((slot) => (
                  <button key={slot} /* ... onClick, className ... */>
                    {slot}
                  </button>
                ))}
              </div>
            )}
            {!isLoadingTimeSlots && availableTimeSlots.length === 0 && (
              <p>No slots available.</p>
            )}
          </div>
        )}
        {/* ... Confirm button ... */}
      </div>
    );
  };
  export default ClientBookAppointmentPage;
  ```

This page provides a focused experience for the final step of booking an appointment, dynamically showing available time slots to enhance the user's ability to secure a convenient time.

### II.5. Client Features - My Appointments Page (`ClientMyAppointmentsPage.jsx`)

- **Purpose:** The `ClientMyAppointmentsPage.jsx` allows authenticated clients to view a comprehensive list of their scheduled, past, and potentially active appointments. It provides details for each appointment and allows them to cancel upcoming scheduled appointments.
- **Accessibility:** Accessible via the `/client/appointments` route, typically linked from the client home page or main client navigation. This route is protected and requires client authentication.

- **Key UI Elements & Functionality:**

  1.  **Display Sections:**

      - **Upcoming Appointments:** Lists appointments that are scheduled for the current day or a future date and have a status of "SCHEDULED" or "ACTIVE" (if an appointment can be active on the same day it's viewed). Sorted chronologically, earliest first.
      - **Past Appointments:** Lists appointments that occurred on a previous date or have a terminal status (e.g., "COMPLETED", "CANCELLED", "NO_SHOW"). Sorted reverse chronologically, most recent past appointment first.

  2.  **Appointment Card Details:**

      - Each appointment is typically displayed as a card or list item showing:
        - **Service Name:** (e.g., "Account Opening," "Loan Consultation").
        - **Branch Name:** (e.g., "Main Street Branch").
        - **District Name:** (Often shown with the branch name, e.g., "Main Street Branch (Central District)").
        - **Date:** Formatted nicely (e.g., "Monday, July 15, 2024").
        - **Time:** (e.g., "10:30 AM").
        - **Status:** Displayed prominently, often with a visual indicator or badge (e.g., "SCHEDULED", "COMPLETED", "CANCELLED"). Styles for these badges (`.status-scheduled`, `.status-completed`, etc.) provide quick visual cues.
      - The `Appointment` DTO returned by `GET /api/appointments/user/{userId}` is expected to contain `branchName` and `serviceName` directly, simplifying data display.

  3.  **Appointment Cancellation:**

      - For upcoming appointments with a "SCHEDULED" status, a "Cancel Appointment" button is displayed.
      - Clicking this button opens a `ConfirmationDialog.jsx` to prevent accidental cancellations.
      - Upon confirmation:
        - An API call is made to `DELETE /api/appointments/{id}` (via `deleteAppointment` from `appointmentService.js`), where `{id}` is the ID of the appointment to be cancelled.
        - On successful cancellation, the appointment list is refreshed, and the cancelled appointment should either disappear from "Upcoming" or move to "Past" with a "CANCELLED" status (depending on how the backend handles the status update upon deletion, or if the frontend filters it out).
        - Error messages are displayed if cancellation fails.

  4.  **Data Fetching Logic:**
      - On component mount (or when user/token changes):
        1.  `GET /api/appointments/user/{userId}` (via `getAppointmentsByUserId`): Fetches all appointments specifically for the logged-in user. These appointment objects are expected to include `branchName` and `serviceName`.
        2.  _(Previously, this page also fetched all `BranchService` relationships to map `branchServiceId` to names. This step is **no longer needed** due to the enhanced `Appointment` DTO from the backend.)_
      - The fetched appointments are then processed client-side:
        - Each appointment object already contains necessary display names.
        - They are sorted and then filtered into "Upcoming" and "Past" arrays based on date and status.
      - Loading and error states are managed during data fetching.

- **State Management:**

  - `userAppointments`: An array storing all fetched and processed appointment objects for the user.
  - `isLoading`: Boolean for the main data loading state.
  - `error`: Stores error messages.
  - `isCancelConfirmOpen`: Boolean to control the visibility of the cancellation confirmation dialog.
  - `appointmentToCancel`: Stores the appointment object selected for potential cancellation.

- **User Experience:**

  - Clear separation of upcoming and past appointments.
  - Easy-to-understand status indicators.
  - Safe cancellation process with confirmation.
  - Informative loading and error messages.

- **Key Code Snippet (`ClientMyAppointmentsPage.jsx` - illustrating data fetching and list rendering):**

  ```javascript
  // src/pages/client/ClientMyAppointmentsPage.jsx (Illustrative Structure)
  import React, { useState, useEffect, useCallback } from "react";
  import { useAuth } from "../../contexts/AuthContext";
  import {
    getAppointmentsByUserId,
    deleteAppointment,
  } from "../../api/appointmentService";
  import ConfirmationDialog from "../../components/common/ConfirmationDialog";
  // import './ClientMyAppointmentsPage.scss';

  const ClientMyAppointmentsPage = () => {
    const { user, token, isAuthenticated } = useAuth();
    const [userAppointments, setUserAppointments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // ... state for cancellation modal ...

    const fetchData = useCallback(async () => {
      if (!isAuthenticated || !user?.id || !token) {
        /* ... handle not authenticated ... */ return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const userAppointmentsData = await getAppointmentsByUserId(
          user.id,
          token
        );
        const processedAppointments = (userAppointmentsData || [])
          .map((app) => ({
            ...app,
            branchName: app.branchName || "N/A",
            serviceName: app.serviceName || "N/A",
          }))
          .sort(
            (a, b) =>
              new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time)
          );
        setUserAppointments(processedAppointments);
      } catch (err) {
        setError(err.message || "Failed to fetch appointments.");
      } finally {
        setIsLoading(false);
      }
    }, [user, token, isAuthenticated]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    // ... handleCancelAppointment, confirmCancelAppointment ...

    // ... logic to split userAppointments into upcomingAppointments and pastAppointments ...
    const upcomingAppointments = userAppointments.filter(/* ... */);
    const pastAppointments = userAppointments.filter(/* ... */);

    return (
      <div className="client-my-appointments-page">
        <header className="page-header">
          <h1>My Appointments</h1>
        </header>
        {error && <div className="error-message">{error}</div>}
        {isLoading && <p>Loading appointments...</p>}

        <section className="appointments-section">
          <h2>Upcoming Appointments</h2>
          {upcomingAppointments.length > 0 ? (
            <ul className="appointments-list">
              {upcomingAppointments.map((app) => (
                <li
                  key={app.id}
                  className={`appointment-card status-${app.status?.toLowerCase()}`}
                >
                  <h3>{app.serviceName}</h3>
                  <p>
                    <strong>Branch:</strong> {app.branchName}
                  </p>
                  {/* ... Date, Time, Status ... */}
                  {app.status?.toUpperCase() === "SCHEDULED" && (
                    <button onClick={() => handleCancelAppointment(app)}>
                      Cancel
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No upcoming appointments.</p>
          )}
        </section>

        {/* ... Past Appointments Section ... */}
        {/* ... ConfirmationDialog for cancellation ... */}
      </div>
    );
  };
  export default ClientMyAppointmentsPage;
  ```

This page provides clients with full visibility and basic control over their appointments, leveraging the efficient data structure provided by the backend's updated `Appointment` DTO.

### II.6. Client Features - My Profile Page (`ClientProfilePage.jsx`)

- **Purpose:** The `ClientProfilePage.jsx` allows authenticated clients to view and manage their personal information, change their password, and access quick links to other parts of the application. It serves as the central hub for account-related settings.
- **Accessibility:** Accessible via the `/client/profile` route, typically linked from the client home page or main client navigation. This route is protected and requires client authentication.

- **Key UI Elements & Functionality:**

  1.  **Display User Information:**

      - **Profile Picture Placeholder:** A visual placeholder (e.g., using the user's initials) is displayed. Full profile picture upload functionality was considered but deferred for this version.
      - **Username:** Displays the user's current username. Editable when in "Edit Mode."
      - **Email:** Displays the user's email address. This field is read-only as email changes often involve more complex verification processes.
      - **Phone Number:** Displays the user's phone number. Editable when in "Edit Mode."
      - **Role:** Displays the user's role (e.g., "CLIENT"). This field is read-only.

  2.  **Profile Editing Mode:**

      - An "Edit Profile" button toggles the page into an editable state.
      - In edit mode:
        - Username and Phone Number fields become editable inputs.
        - "Save Changes" and "Cancel" buttons appear.
      - **Saving Changes:**
        - Upon clicking "Save Changes," client-side validation (if any) is performed.
        - An API call is made to `PUT /api/users/{id}` (or `PATCH`, using `updateUserProfile` from `userService.js`) with the updated `username` and `phoneNumber`.
        - On success:
          - A success message is shown.
          - The `refreshUserContext` function from `AuthContext` is called to ensure the global user state (and `localStorage`) is updated with the new details. This ensures changes are reflected immediately across the application (e.g., in the `TopNav` greeting).
          - The page exits edit mode.
        - On failure, an error message is displayed.
      - **Cancelling Edit:** Reverts any changes made in the form fields and exits edit mode.

  3.  **Security Section:**

      - **Change Password:**
        - A "Change Password" button opens a modal (`Modal.jsx`).
        - The modal contains a form with fields for: "Current Password," "New Password," and "Confirm New Password."
        - **Submission:**
          - Client-side validation checks if new passwords match and meet any complexity requirements (e.g., minimum length).
          - An API call is made to `POST /api/users/change-password` (via `changePassword` from `userService.js`). The payload includes `email` (of the current user), `oldPassword`, and `newPassword`.
          - On success:
            - A success message is displayed in the modal.
            - The user is automatically logged out (by calling `logout()` from `AuthContext`) and redirected to the `SignInPage` after a short delay. This is a security measure to ensure the new password takes effect for the session.
          - On failure (e.g., incorrect current password, new password doesn't meet backend criteria), an error message is shown in the modal.
      - **Delete Account:**
        - A "Delete Account" button.
        - Clicking it opens a `ConfirmationDialog.jsx` with a strong warning about the permanency of the action.
        - **Current Implementation:** This is a placeholder action. If fully implemented, confirming would trigger an API call to a backend endpoint to delete the user account, followed by logout and redirection. _Actual deletion API call is not implemented in the provided frontend code._

  4.  **Quick Links Section:**
      - Provides convenient navigation links to other relevant client pages:
        - "My Appointments" (links to `/client/appointments`).
        - "Book New Appointment" (links to `/client/branches`).

- **State Management:**

  - `isEditMode`: Boolean to toggle between view and edit states for profile information.
  - `formData`: Object to hold editable profile field values (`username`, `phoneNumber`).
  - `passwordData`: Object for the change password form inputs.
  - `isPasswordModalOpen`, `isDeleteConfirmOpen`: Booleans for modal visibility.
  - Various `isLoading`, `Error`, and `Success` states for profile updates and password changes.

- **Context Usage:**

  - `useAuth()`: To get the current `user` details, `token` for API calls, `logout` function, and the crucial `refreshUserContext` function.

- **Key Code Snippet (`ClientProfilePage.jsx` - illustrating edit mode and password change modal trigger):**

  ```javascript
  // src/pages/client/ClientProfilePage.jsx (Illustrative Structure)
  import React, { useState, useEffect } from "react";
  import { Link, useNavigate } from "react-router-dom";
  import { useAuth } from "../../contexts/AuthContext";
  import { updateUserProfile, changePassword } from "../../api/userService";
  import Modal from "../../components/common/Modal";
  // import './ClientProfilePage.scss';

  const ClientProfilePage = () => {
    const { user, token, logout, refreshUserContext } = useAuth();
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ username: "", phoneNumber: "" });
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    // ... other states for password form, errors, successes, loading ...

    useEffect(() => {
      if (user) {
        setFormData({
          username: user.username || "",
          phoneNumber: user.phoneNumber || "",
        });
      }
      // ... redirect if !user ...
    }, [user]);

    const handleProfileUpdate = async (e) => {
      e.preventDefault();
      // ... setIsLoading, clear errors ...
      try {
        await updateUserProfile(user.id, formData, token);
        if (refreshUserContext) await refreshUserContext();
        // ... setSuccess, setIsEditMode(false) ...
      } catch (err) {
        /* ... setError ... */
      } finally {
        /* ... setIsLoading(false) ... */
      }
    };

    const handleChangePassword = async (e) => {
      e.preventDefault();
      // ... validation, setIsLoading, clear errors ...
      try {
        await changePassword(
          { email: user.email /* ...passwordData */ },
          token
        );
        // ... setSuccess, close modal, prepare for logout ...
        setTimeout(() => {
          logout();
          navigate("/signin");
        }, 2000);
      } catch (err) {
        /* ... setPasswordError ... */
      } finally {
        /* ... setIsLoading(false) ... */
      }
    };

    if (!user) return <p>Loading...</p>;

    return (
      <div className="client-profile-page">
        <header className="page-header">
          <h1>My Profile</h1>
        </header>
        {/* ... Profile Info Section with form and edit/save buttons ... */}
        {/* Display user.email (read-only), user.role (read-only) */}
        {/* Inputs for formData.username, formData.phoneNumber (editable in isEditMode) */}

        <div className="profile-section security-section">
          <h2>Security</h2>
          <button onClick={() => setIsPasswordModalOpen(true)}>
            Change Password
          </button>
          {/* ... Delete Account button ... */}
        </div>

        <div className="profile-section quick-links-section">
          <h2>Quick Links</h2>
          {/* ... Links to My Appointments, Book New ... */}
        </div>

        {isPasswordModalOpen && (
          <Modal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            title="Change Password"
          >
            <form onSubmit={handleChangePassword}>
              {/* ... Password form fields ... */}
              <button type="submit">Change Password</button>
            </form>
          </Modal>
        )}
        {/* ... ConfirmationDialog for delete ... */}
      </div>
    );
  };
  export default ClientProfilePage;
  ```

This page empowers clients to manage their own account details and security settings within BQOMIS, ensuring their information is up-to-date and their account remains secure. The integration with `AuthContext` for refreshing user details is key for a seamless UX.

---

## III. Admin Application Features

The admin application provides a suite of tools for managing the BQOMIS system, its data, and its users (primarily staff and other administrators). A consistent layout is applied across all admin-facing pages to ensure a familiar and efficient user experience.

### 1. Core Admin Layout (`AdminLayout.jsx`, `TopNav.jsx`, `SidebarNav.jsx`, `Footer.jsx`)

- **Purpose:** The core admin layout components define the persistent structural elements of the admin interface, including the top navigation bar, a side navigation menu, and a footer. This structure frames the main content area where specific admin feature pages are rendered.
- **Accessibility:** All routes under `/admin/*` are wrapped by the `AdminLayout` (nested within an `AdminProtectedRoute` for authentication and role checking).

- **Key Components:**

  1.  **`AdminLayout.jsx` (`src/components/layout/AdminLayout.jsx`):**

      - This is the top-level layout component for the entire admin section.
      - It orchestrates the arrangement of `TopNav`, `SidebarNav`, the main content area (`<Outlet />`), and `Footer`.
      - **Structure:**
        ```
        <div class="admin-layout">
          <TopNav />
          <div class="admin-layout__main">  // Flex container for sidebar and content
            <SidebarNav navigationItems={adminNavItems} />
            <main class="admin-layout__content">
              <Outlet /> {/* Specific admin page content renders here */}
            </main>
          </div>
          <Footer />
        </div>
        ```
      - It defines the `adminNavItems` array (or imports it), which contains the configuration (paths, labels, icons) for the links displayed in the `SidebarNav`.

  2.  **`TopNav.jsx` (`src/components/layout/TopNav.jsx`):**

      - A reusable component shared with the `ClientLayout` but styled and behaving consistently.
      - **Displays:**
        - Application Title: "BQOMIS" (typically centered or left-aligned).
        - User Actions (right-aligned):
          - If an admin is authenticated (checked via `useAuth()`):
            - Displays a greeting (e.g., "Hi, [Admin Username]").
            - A "Sign Out" button, which triggers the `logout()` function from `AuthContext` and redirects to `/signin`.
      - It's fixed at the top of the viewport for admin pages.

  3.  **`SidebarNav.jsx` (`src/components/layout/SidebarNav.jsx`):**

      - A reusable vertical navigation menu displayed on the left side of the admin interface.
      - **Props:**
        - `navigationItems`: An array of objects, where each object defines a navigation link (e.g., `{ path: '/admin/dashboard', label: 'Dashboard', icon: '🏠' }`). This prop is supplied by `AdminLayout.jsx`.
      - **Displays:**
        - **Admin Profile Information (Placeholder/Basic):** At the top of the sidebar, it shows the logged-in admin's username and email (retrieved from `useAuth()`). A placeholder avatar (e.g., user's first initial) is also shown.
        - **Navigation Links:** Renders a list of navigation links based on the `navigationItems` prop.
          - Uses `<NavLink>` from `react-router-dom` to allow styling of the active link (e.g., different background color or text weight).
          - Each link typically has an icon and a text label.
      - **Example `adminNavItems` (defined in `AdminLayout.jsx`):**
        ```javascript
        const adminNavItems = [
          {
            path: "/admin/dashboard",
            label: "Dashboard & Analytics",
            icon: "📊",
          },
          {
            path: "/admin/appointments-management",
            label: "Appt. Management",
            icon: "📅",
          },
          { path: "/admin/branches", label: "Branch Management", icon: "🏢" },
          { path: "/admin/services", label: "Service Management", icon: "🛠️" },
          {
            path: "/admin/branch-services",
            label: "Branch Services",
            icon: "🔗",
          },
          { path: "/admin/users", label: "User Management", icon: "👥" },
          { path: "/admin/settings", label: "Settings", icon: "⚙️" },
          {
            path: "/admin/dev-data-tools",
            label: "Dev Data Tools",
            icon: "🧪",
          },
        ];
        ```

  4.  **`Footer.jsx` (`src/components/layout/Footer.jsx`):**
      - A reusable simple footer component.
      - Typically displays copyright information or other static text (e.g., "&copy; [Year] BQOMIS. All rights reserved.").
      - Fixed at the bottom or part of the main page flow.

- **Routing Integration (`App.jsx`):**

  - The `AdminLayout` is used as the `element` for a parent route that encompasses all specific admin page routes.
    ```javascript
    // src/App.jsx (Simplified admin routing section)
    // ...
    <Route path="/admin" element={<AdminProtectedRoute />}>
      {" "}
      {/* Auth & Role check */}
      <Route element={<AdminLayout />}>
        {" "}
        {/* Apply AdminLayout to all children */}
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="branches" element={<AdminBranchManagementPage />} />
        {/* ... other admin page routes ... */}
      </Route>
    </Route>
    // ...
    ```
  - The `<Outlet />` component within `AdminLayout.jsx` is where the `element` of the matched child route (e.g., `<AdminDashboardPage />`) will be rendered.

- **Styling:**
  - Each layout component (`AdminLayout.scss`, `TopNav.scss`, `SidebarNav.scss`, `Footer.scss`) has its own SCSS file defining its specific styles, colors, and layout (e.g., flexbox or grid for arranging sidebar and content).
  - These styles leverage the global SCSS variables from `_variables.scss` for consistency (e.g., background colors, text colors, spacing).

This core admin layout provides a consistent and professional framework for all administrative functionalities, making it easy for admins to navigate and manage the BQOMIS system. The reusability of `TopNav`, `SidebarNav`, and `Footer` (also used in `ClientLayout`) demonstrates efficient component design.

### III.2. Admin Features - Branch Management (`AdminBranchManagementPage.jsx`, `BranchForm.jsx`)

- **Purpose:** This feature allows administrators to manage bank branches within the BQOMIS system. Admins can create new branches, view a list of existing branches, edit their details (functionality planned for full implementation), and delete branches.
- **Accessibility:** Accessed via the `/admin/branches` route, typically from a "Branch Management" link in the admin sidebar. This route is protected and requires admin authentication.

- **Key UI Elements & Workflow (`AdminBranchManagementPage.jsx`):**

  1.  **Page Header:**

      - Displays the title "Branch Management."
      - Includes a "Create New Branch" button, which opens a modal containing the `BranchForm.jsx` in "create" mode.

  2.  **Branches Table:**

      - Displays a list of all existing bank branches in a tabular format.
      - **Columns typically include:**
        - Branch Name
        - Address
        - District (Name)
        - Province
        - Actions
      - If no branches exist or match filters (if filtering were implemented on this page), a "No branches found" message is shown.

  3.  **Actions per Branch Row:**

      - **Edit Button:**
        - Opens the `BranchForm.jsx` modal, pre-filled with the selected branch's data, in "edit" mode.
        - _Note: Full update functionality via the API (e.g., `PUT /api/branches/{id}`) was planned for later refinement. The form structure supports edit mode, but the API call for update might be a placeholder or not yet fully implemented in the provided code iterations._
      - **Delete Button:**
        - Opens a `ConfirmationDialog.jsx` to confirm the deletion of the branch.
        - Upon confirmation, an API call to `DELETE /api/branches/{id}` (via `deleteBranch` from `branchService.js`) is made.
        - On successful deletion, the branch list is refreshed.

  4.  **Data Fetching:**
      - On component mount (and after successful create/delete operations), the page fetches data:
        - `GET /api/branches` (via `getAllBranches`): Retrieves the list of all branches.
        - `GET /api/districts` (via `getAllDistricts` from `districtService.js`): Fetches all districts. This list is passed to the `BranchForm.jsx` to populate a dropdown for selecting a branch's district, which then auto-fills the province.
      - Loading and error states are managed and displayed.

- **`BranchForm.jsx` (`src/features/admin/branchManagement/BranchForm.jsx`):**

  - A reusable form component displayed within a `Modal.jsx` for both creating new branches and editing existing ones.
  - **Props:**
    - `mode`: String ("create" or "edit").
    - `initialData`: Object containing branch data (used to pre-fill the form in "edit" mode).
    - `districts`: Array of district objects for the district selection dropdown.
    - `onSuccess`: Callback function executed after successful form submission (typically closes the modal and refreshes the branch list).
    - `onCancel`: Callback function to close the modal without submitting.
  - **Form Fields:**
    - **Branch Name:** Text input, required.
    - **Address:** Text input, required.
    - **District:** Dropdown (`<select>`) populated with the names of available districts. Selecting a district automatically populates the Province field. Required.
    - **Province:** Text input, read-only. Its value is derived from the selected district. Required (by virtue of district selection).
  - **Submission Logic:**
    - **Create Mode:**
      - Constructs a payload: `{ name, address, district (name), province (name) }`.
      - Makes a `POST /api/branches` API call (via `createBranch` from `branchService.js`).
    - **Edit Mode (Structure in place, full API call pending refinement):**
      - Constructs a similar payload with updated values.
      - The API call to update (e.g., `PUT /api/branches/{id}`) was noted as pending full implementation in the backend and corresponding `updateBranch` function in `branchService.js`. The UI form supports pre-filling and changing values.
  - Displays submission loading state and any errors from the API.

- **Modals Used:**

  - `Modal.jsx`: To host the `BranchForm.jsx`.
  - `ConfirmationDialog.jsx`: For delete confirmations.

- **State Management (`AdminBranchManagementPage.jsx`):**

  - `branches`: Array to store the list of branches.
  - `districts`: Array to store the list of districts for the form.
  - `isLoading`, `error`: For data fetching and submission states.
  - `isFormModalOpen`, `isDeleteConfirmOpen`: Booleans to control modal visibility.
  - `selectedBranch`: Stores the branch object currently being edited or considered for deletion.
  - `formMode`: String ("create" or "edit") to control `BranchForm.jsx` behavior.

- **API Service Functions Used (from `branchService.js` and `districtService.js`):**

  - `getAllBranches(token)`
  - `createBranch(branchData, token)`
  - `deleteBranch(branchId, token)`
  - `(Future) updateBranch(branchId, branchData, token)`
  - `getAllDistricts(token)`

- **Key Code Snippet (`AdminBranchManagementPage.jsx` - simplified data fetching and modal trigger):**

  ```javascript
  // src/pages/admin/AdminBranchManagementPage.jsx (Illustrative)
  import React, { useState, useEffect, useCallback } from "react";
  import { useAuth } from "../../contexts/AuthContext";
  import {
    getAllBranches,
    deleteBranch,
    createBranch,
  } from "../../api/branchService";
  import { getAllDistricts } from "../../api/districtService";
  import BranchForm from "../../features/admin/branchManagement/BranchForm";
  import Modal from "../../components/common/Modal";
  // ... other imports ...

  const AdminBranchManagementPage = () => {
    const [branches, setBranches] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    // ... other states: error, modal states, selectedBranch, formMode ...
    const { token } = useAuth();

    const fetchData = useCallback(async () => {
      if (!token) return;
      setIsLoading(true); /* ... */
      try {
        const [branchesData, districtsData] = await Promise.all([
          getAllBranches(token),
          getAllDistricts(token),
        ]);
        setBranches(branchesData || []);
        setDistricts(districtsData || []);
      } catch (err) {
        /* ... setError ... */
      } finally {
        /* ... setIsLoading(false) ... */
      }
    }, [token]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    const handleCreateNew = () => {
      /* ... setSelectedBranch(null), setFormMode('create'), setIsFormModalOpen(true) ... */
    };
    const handleEdit = (branch) => {
      /* ... setSelectedBranch(branch), setFormMode('edit'), setIsFormModalOpen(true) ... */
    };
    const handleDelete = (branch) => {
      /* ... setSelectedBranch(branch), setIsDeleteConfirmOpen(true) ... */
    };
    const confirmDeleteBranch = async () => {
      /* ... call deleteBranch, fetchData ... */
    };
    const handleFormSuccess = () => {
      /* ... setIsFormModalOpen(false), fetchData ... */
    };

    return (
      <div className="admin-branch-management-page">
        <header className="page-header">
          <h1>Branch Management</h1>
          <button onClick={handleCreateNew}>Create New Branch</button>
        </header>
        {/* ... Error display ... */}
        {/* ... Table rendering branches with Edit/Delete buttons ... */}
        {isFormModalOpen && (
          <Modal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            title={formMode === "create" ? "Create Branch" : "Edit Branch"}
          >
            <BranchForm
              mode={formMode}
              initialData={selectedBranch}
              districts={districts}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormModalOpen(false)}
            />
          </Modal>
        )}
        {/* ... ConfirmationDialog for delete ... */}
      </div>
    );
  };
  export default AdminBranchManagementPage;
  ```

This feature provides administrators with the essential tools to manage the bank's branch network, which is fundamental to the BQOMIS system's operation. The use of a reusable form component and modals ensures a consistent UI for these management tasks.

### III.3. Admin Features - Service Management (`AdminServiceManagementPage.jsx`, `ServiceForm.jsx`)

- **Purpose:** This feature enables administrators to manage the various banking services offered by the institution (e.g., "Account Opening," "Loan Application," "Cash Deposit," "Withdrawal"). Admins can create new services, view existing ones, edit their details (functionality planned for full implementation), and delete services. These defined services are then available to be linked to specific branches via the Branch-Service Relationship Management feature.
- **Accessibility:** Accessed via the `/admin/services` route, typically from a "Service Management" link in the admin sidebar. This route is protected and requires admin authentication.

- **Key UI Elements & Workflow (`AdminServiceManagementPage.jsx`):**

  1.  **Page Header:**

      - Displays the title "Service Management."
      - Includes a "Create New Service" button, which opens a modal containing the `ServiceForm.jsx` in "create" mode.

  2.  **Services Table:**

      - Displays a list of all available banking services in a tabular format.
      - **Columns typically include:**
        - Service ID
        - Service Name
        - Description
        - Actions
      - If no services exist, a "No services found" message is shown.

  3.  **Actions per Service Row:**

      - **Edit Button:**
        - Opens the `ServiceForm.jsx` modal, pre-filled with the selected service's data, in "edit" mode.
        - _Note: Full update functionality via an API (e.g., `PUT /api/services/{id}`) was planned for later refinement. The form structure supports edit mode._
      - **Delete Button:**
        - Opens a `ConfirmationDialog.jsx` to confirm the deletion of the service.
        - Upon confirmation, an API call to `DELETE /api/services/{id}` (via `deleteService` from `serviceService.js`) is made.
        - On successful deletion, the service list is refreshed.

  4.  **Data Fetching:**
      - On component mount (and after successful create/delete operations), the page fetches data:
        - `GET /api/services` (via `getAllServices` from `serviceService.js`): Retrieves the list of all services.
      - Loading and error states are managed and displayed.

- **`ServiceForm.jsx` (`src/features/admin/serviceManagement/ServiceForm.jsx`):**

  - A reusable form component displayed within a `Modal.jsx` for both creating new services and editing existing ones.
  - **Props:**
    - `mode`: String ("create" or "edit").
    - `initialData`: Object containing service data (used to pre-fill the form in "edit" mode).
    - `onSuccess`: Callback function executed after successful form submission.
    - `onCancel`: Callback function to close the modal without submitting.
  - **Form Fields:**
    - **Service Name:** Text input, required.
    - **Description:** Textarea, required, for a more detailed explanation of the service.
  - **Submission Logic:**
    - **Create Mode:**
      - Constructs a payload: `{ name, description }`.
      - Makes a `POST /api/services` API call (via `createService` from `serviceService.js`).
    - **Edit Mode (Structure in place, API call pending refinement):**
      - Constructs a similar payload with updated values.
      - The API call to update (e.g., `PUT /api/services/{id}`) and the corresponding `updateService` function in `serviceService.js` were noted as pending full implementation.
  - Displays submission loading state and any errors from the API.

- **Modals Used:**

  - `Modal.jsx`: To host the `ServiceForm.jsx`.
  - `ConfirmationDialog.jsx`: For delete confirmations.

- **State Management (`AdminServiceManagementPage.jsx`):**

  - `services`: Array to store the list of services.
  - `isLoading`, `error`: For data fetching and submission states.
  - `isFormModalOpen`, `isDeleteConfirmOpen`: Booleans to control modal visibility.
  - `selectedService`: Stores the service object currently being edited or considered for deletion.
  - `formMode`: String ("create" or "edit") to control `ServiceForm.jsx` behavior.

- **API Service Functions Used (from `serviceService.js`):**

  - `getAllServices(token)`
  - `createService(serviceData, token)`
  - `deleteService(serviceId, token)`
  - `(Future) updateService(serviceId, serviceData, token)`

- **Key Code Snippet (`AdminServiceManagementPage.jsx` - simplified structure):**

  ```javascript
  // src/pages/admin/AdminServiceManagementPage.jsx (Illustrative)
  import React, { useState, useEffect, useCallback } from "react";
  import { useAuth } from "../../contexts/AuthContext";
  import {
    getAllServices,
    deleteService,
    createService,
  } from "../../api/serviceService";
  import ServiceForm from "../../features/admin/serviceManagement/ServiceForm";
  import Modal from "../../components/common/Modal";
  // ... other imports ...

  const AdminServiceManagementPage = () => {
    const [services, setServices] = useState([]);
    // ... other states: isLoading, error, modal states, selectedService, formMode ...
    const { token } = useAuth();

    const fetchData = useCallback(async () => {
      if (!token) return;
      // ... setIsLoading, setError(null) ...
      try {
        const servicesData = await getAllServices(token);
        setServices(servicesData || []);
      } catch (err) {
        /* ... setError ... */
      } finally {
        /* ... setIsLoading(false) ... */
      }
    }, [token]);

    useEffect(() => {
      fetchData();
    }, [fetchData]);

    const handleCreateNew = () => {
      /* ... setSelectedService(null), setFormMode('create'), setIsFormModalOpen(true) ... */
    };
    const handleEdit = (service) => {
      /* ... setSelectedService(service), setFormMode('edit'), setIsFormModalOpen(true) ... */
    };
    const handleDelete = (service) => {
      /* ... setSelectedService(service), setIsDeleteConfirmOpen(true) ... */
    };
    const confirmDeleteService = async () => {
      /* ... call deleteService, fetchData ... */
    };
    const handleFormSuccess = () => {
      /* ... setIsFormModalOpen(false), fetchData ... */
    };

    return (
      <div className="admin-service-management-page">
        <header className="page-header">
          <h1>Service Management</h1>
          <button onClick={handleCreateNew}>Create New Service</button>
        </header>
        {/* ... Error display ... */}
        {/* ... Table rendering services with Edit/Delete buttons ... */}
        {isFormModalOpen && (
          <Modal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            title={formMode === "create" ? "Create Service" : "Edit Service"}
          >
            <ServiceForm
              mode={formMode}
              initialData={selectedService}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormModalOpen(false)}
            />
          </Modal>
        )}
        {/* ... ConfirmationDialog for delete ... */}
      </div>
    );
  };
  export default AdminServiceManagementPage;
  ```

This feature allows administrators to define the portfolio of services the bank offers, which is a prerequisite for linking services to branches and for clients to book appointments. The implementation follows the established CRUD pattern used for Branch Management, ensuring consistency in the admin interface.

### III.4. Admin Features - Branch-Service Relationships (`AdminBranchServiceManagementPage.jsx`)

- **Purpose:** This crucial feature allows administrators to define which banking services are offered at which specific bank branches. It manages the many-to-many relationship between branches and services, effectively controlling the service catalog available to clients when they select a particular branch.
- **Accessibility:** Accessed via the `/admin/branch-services` route, typically from a "Branch Services" link in the admin sidebar. This route is protected and requires admin authentication.

- **Key UI Elements & Workflow (`AdminBranchServiceManagementPage.jsx`):**

  1.  **Page Header:**

      - Displays the title "Branch-Service Management."

  2.  **Branch Selector:**

      - A dropdown menu allows the admin to select a specific branch for which they want to manage service assignments.
      - The dropdown is populated by fetching all branches using `GET /api/branches`.

  3.  **Service Management Area (Displays once a branch is selected):**

      - This area is typically divided into two main lists or sections:
        - **Assigned Services:**
          - Lists all services currently assigned to (offered by) the selected branch.
          - Each item displays the service name.
          - Next to each assigned service, a "Remove" button is provided.
        - **Available Services to Add:**
          - Lists all services that exist in the system but are _not_ currently assigned to the selected branch.
          - Each item displays the service name.
          - Next to each available service, an "Add" button is provided.
      - If no services are assigned or no services are available to add, appropriate messages are displayed.

  4.  **Data Fetching and Processing:**

      - **Initial Load:**
        - `GET /api/branches` (via `getAllBranches`): Fetches all branches to populate the branch selector dropdown.
        - `GET /api/services` (via `getAllServices`): Fetches all services available in the system. This master list is used to determine which services are "available to add."
      - **On Branch Selection:**
        - `GET /api/branch-services/branch/{branchId}` (via `getBranchServicesByBranchId` from `branchLinkService.js` or your equivalent): Fetches all `BranchService` link objects specifically for the selected branch. These objects contain `id` (the ID of the link itself), `branchId`, `serviceId`, and importantly `serviceName` and `branchName`.
        - The fetched `BranchService` links for the selected branch constitute the "Assigned Services" list.
        - The "Available Services to Add" list is then derived by taking the master list of all services and filtering out those whose IDs are present in the "Assigned Services" list for the current branch.
      - Loading and error states are managed for these data fetching operations.

  5.  **Actions:**
      - **Adding a Service to a Branch:**
        - Admin clicks the "Add" button next to a service in the "Available Services to Add" list.
        - An API call is made to `POST /api/branch-services` (via `createBranchServiceRelationship`).
        - **Payload:** `{ "branchId": selectedBranchId, "serviceId": serviceIdToAdd }`.
        - On success, the "Assigned Services" and "Available Services to Add" lists are refreshed to reflect the change.
      - **Removing a Service from a Branch:**
        - Admin clicks the "Remove" button next to a service in the "Assigned Services" list.
        - The ID required for deletion is the `id` of the `BranchService` link object itself (which was fetched when loading assigned services).
        - An API call is made to `DELETE /api/branch-services/{branchServiceRelationshipId}` (via `deleteBranchServiceRelationship`).
        - On success, the lists are refreshed.

- **State Management (`AdminBranchServiceManagementPage.jsx`):**

  - `branches`: Array of all branches for the selector.
  - `allServices`: Array of all services in the system.
  - `selectedBranchId`: Stores the ID of the currently selected branch.
  - `assignedServices`: Array of `BranchService` link objects for the selected branch.
  - `availableServicesToAdd`: Array of service objects not yet assigned to the selected branch.
  - `isLoadingBranches`, `isLoadingServices` (for services of a selected branch), `error`.

- **API Service Functions Used:**

  - From `branchService.js`: `getAllBranches(token)`
  - From `serviceService.js`: `getAllServices(token)`
  - From `branchLinkService.js` (your name for `branchServiceRelationshipService.js`):
    - `getBranchServicesByBranchId(branchId, token)`
    - `createBranchServiceRelationship(data, token)`
    - `deleteBranchServiceRelationship(branchServiceRelationshipId, token)`

- **Key Code Snippet (`AdminBranchServiceManagementPage.jsx` - simplified interaction logic):**

  ```javascript
  // src/pages/admin/AdminBranchServiceManagementPage.jsx (Illustrative)
  import React, { useState, useEffect, useCallback } from "react";
  import { useAuth } from "../../contexts/AuthContext";
  import { getAllBranches } from "../../api/branchService";
  import { getAllServices as getAllSystemServices } from "../../api/serviceService"; // Aliased
  import {
    getBranchServicesByBranchId,
    createBranchServiceRelationship,
    deleteBranchServiceRelationship,
  } from "../../api/branchLinkService";
  // import './AdminBranchServiceManagementPage.scss';

  const AdminBranchServiceManagementPage = () => {
    const [branches, setBranches] = useState([]);
    const [allSystemServices, setAllSystemServices] = useState([]);
    const [selectedBranchId, setSelectedBranchId] = useState("");
    const [assignedServices, setAssignedServices] = useState([]);
    const [availableServicesToAdd, setAvailableServicesToAdd] = useState([]);
    // ... isLoading states, error state ...
    const { token } = useAuth();

    // Fetch branches and all system services on mount
    useEffect(() => {
      /* ... fetch branches and allSystemServices ... */
    }, [token]);

    // Fetch/update assigned and available services when selectedBranchId or allSystemServices change
    const updateServiceListsForBranch = useCallback(async () => {
      if (!selectedBranchId || !token || allSystemServices.length === 0) {
        setAssignedServices([]);
        setAvailableServicesToAdd(allSystemServices); // Or empty if no branch selected
        return;
      }
      // ... setIsLoadingServices(true) ...
      try {
        const currentBranchServices = await getBranchServicesByBranchId(
          selectedBranchId,
          token
        );
        setAssignedServices(currentBranchServices || []);
        const assignedServiceIds = (currentBranchServices || []).map(
          (bs) => bs.serviceId
        );
        setAvailableServicesToAdd(
          allSystemServices.filter((s) => !assignedServiceIds.includes(s.id))
        );
      } catch (err) {
        /* ... setError ... */
      } finally {
        /* ... setIsLoadingServices(false) ... */
      }
    }, [selectedBranchId, token, allSystemServices]);

    useEffect(() => {
      updateServiceListsForBranch();
    }, [updateServiceListsForBranch]);

    const handleAddService = async (serviceIdToAdd) => {
      // ... call createBranchServiceRelationship ...
      // ... then call updateServiceListsForBranch() to refresh ...
    };
    const handleRemoveService = async (branchServiceRelationshipId) => {
      // ... call deleteBranchServiceRelationship ...
      // ... then call updateServiceListsForBranch() to refresh ...
    };

    return (
      <div className="admin-bs-management-page">
        <header className="page-header">
          <h1>Branch-Service Management</h1>
        </header>
        {/* ... Error display ... */}
        {/* ... Branch Selector Dropdown ... */}

        {selectedBranchId && (
          <div className="services-management-container">
            {/* Assigned Services List with "Remove" buttons */}
            {/* Available Services to Add List with "Add" buttons */}
          </div>
        )}
      </div>
    );
  };
  export default AdminBranchServiceManagementPage;
  ```

This feature is vital for tailoring the service offerings at each branch location, directly impacting what clients can see and book. The UI design with two lists (assigned vs. available) provides a clear and intuitive way for administrators to manage these complex relationships.

### III.5. Admin Features - User Management (`AdminUserManagementPage.jsx`, `UserForm.jsx`)

- **Purpose:** This feature provides administrators with the tools to manage user accounts within the BQOMIS system, specifically focusing on users with "STAFF" and "ADMIN" roles. Client accounts are typically self-registered. Admins can create new staff/admin users, view a list of these users, edit their details (like username, phone number, and role), and delete user accounts.
- **Accessibility:** Accessed via the `/admin/users` route, linked from the "User Management" item in the admin sidebar. This route is protected and requires admin authentication.

- **Key UI Elements & Workflow (`AdminUserManagementPage.jsx`):**

  1.  **Page Header:**

      - Displays the title "User Management (Staff & Admins)."
      - Includes a "Create New User" button, which opens a modal containing the `UserForm.jsx` in "create" mode.

  2.  **Users Table:**

      - Displays a list of users, filtered to show only those with "STAFF" or "ADMIN" roles.
      - **Columns typically include:**
        - User ID
        - Username
        - Email
        - Phone Number
        - Role (e.g., "STAFF", "ADMIN")
        - Actions
      - If no users match the criteria, a "No staff or admin users found" message is shown.

  3.  **Actions per User Row:**

      - **Edit Button:**
        - Opens the `UserForm.jsx` modal, pre-filled with the selected user's data, in "edit" mode.
        - Admins can typically modify username, phone number, and role. Email is usually not editable directly by an admin for an existing user. Password changes are handled separately or not directly by admins (except initial password for new users).
      - **Delete Button:**
        - Opens a `ConfirmationDialog.jsx` to confirm user deletion.
        - An admin cannot delete their own account via this interface (the delete button is disabled for the currently logged-in admin's row).
        - Upon confirmation, an API call to `DELETE /api/users/{id}` (via `deleteUserById` from `userService.js`) is made.
        - On successful deletion, the user list is refreshed.

  4.  **Data Fetching:**
      - On component mount (and after successful create/edit/delete operations):
        - `GET /api/users?roles=STAFF,ADMIN` (via `getAdminAndStaffUsers`): Retrieves the list of users filtered by these roles.
        - `GET /api/roles` (via `getAllRoles`): Fetches all available system roles (e.g., ADMIN, STAFF, CLIENT). This list is passed to the `UserForm.jsx` to populate a dropdown for role assignment, though the form filters it further to only show assignable admin/staff roles.
      - Loading and error states are managed.

- **`UserForm.jsx` (`src/features/admin/userManagement/UserForm.jsx`):**

  - A reusable form component displayed within a `Modal.jsx` for creating and editing staff/admin users.
  - **Props:**
    - `mode`: String ("create" or "edit").
    - `initialData`: Object containing user data (for pre-filling in "edit" mode). It's important that this `initialData` (derived from the selected user) correctly maps the user's current role name to a `roleId` if the form uses `roleId` for the select input.
    - `roles`: Array of all role objects (`{id, name, description}`) for the role selection dropdown.
    - `onSuccess`, `onCancel`: Callback functions.
  - **Form Fields:**
    - **Username:** Text input, required.
    - **Email:** Email input, required. Read-only in "edit" mode.
    - **Temporary Password:** (Only in "create" mode) Password input, required. Admins set an initial temporary password.
    - **Phone Number:** Text input (tel type).
    - **Role:** Dropdown (`<select>`) populated with "STAFF" and "ADMIN" roles from the `roles` prop. Required.
  - **Submission Logic:**
    - **Create Mode:**
      - Constructs a payload: `{ username, email, phoneNumber, password, role (name or ID, as expected by backend) }`. The current implementation sends the role _name_.
      - Makes a `POST /api/users` API call (via `createUserByAdmin` from `userService.js`).
    - **Edit Mode:**
      - Constructs a payload with fields allowed for update: `{ username, phoneNumber, role (name or ID) }`.
      - Makes a `PATCH /api/users/{id}` API call (via `updateUserByAdmin`).
  - Displays submission loading state and any API errors.

- **Modals Used:**

  - `Modal.jsx`: To host the `UserForm.jsx`.
  - `ConfirmationDialog.jsx`: For delete confirmations.

- **State Management (`AdminUserManagementPage.jsx`):**

  - `users`: Array for the list of staff/admin users.
  - `roles`: Array for all system roles.
  - `isLoading`, `error`, modal visibility states, `selectedUser`, `formMode`.

- **API Service Functions Used (from `userService.js`):**

  - `getAdminAndStaffUsers(token)`
  - `getAllRoles(token)`
  - `createUserByAdmin(userData, token)`
  - `updateUserByAdmin(userId, userData, token)`
  - `deleteUserById(userId, token)`

- **Key Code Snippet (`AdminUserManagementPage.jsx` - simplified):**

  ```javascript
  // src/pages/admin/AdminUserManagementPage.jsx (Illustrative)
  import React, { useState, useEffect, useCallback } from 'react';
  import { useAuth } from '../../contexts/AuthContext';
  import { getAdminAndStaffUsers, deleteUserById, getAllRoles } from '../../api/userService';
  import UserForm from '../../features/admin/userManagement/UserForm';
  // ... Modal, ConfirmationDialog imports ...

  const AdminUserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    // ... other states (isLoading, error, modals, selectedUser, formMode) ...
    const { token, user: currentAdminUser } = useAuth();

    const fetchData = useCallback(async () => {
      if (!token) return;
      // ... setIsLoading, setError ...
      try {
        const [usersData, rolesData] = await Promise.all([
          getAdminAndStaffUsers(token),
          getAllRoles(token)
        ]);
        setUsers(usersData || []);
        setRoles(rolesData || []);
      } catch (err) { /* ... setError ... */ }
      finally { /* ... setIsLoading(false) ... */ }
    }, [token]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleEdit = (userToEdit) => {
      const roleObject = roles.find(r => r.name === userToEdit.role);
      setSelectedUser({...userToEdit, roleId: roleObject ? roleObject.id : '' });
      setFormMode('edit');
      setIsFormModalOpen(true);
    };

    const handleDelete = (userToDelete) => {
      if (currentAdminUser && userToDelete.id === currentAdminUser.id) {
          alert("Cannot delete self."); return;
      }
      // ... open confirmation dialog ...
    };
    // ... handleCreateNew, confirmDeleteUser, handleFormSuccess ...

    return (
      <div className="admin-user-management-page">
        <header className="page-header">
          <h1>User Management (Staff & Admins)</h1>
          <button onClick={handleCreateNew}>Create New User</button>
        </header>
        {/* ... Error display ... */}
        {/* ... Table rendering users with Edit/Delete buttons (disable delete for self) ... */}
        {isFormModalOpen && (
          <Modal /* ... */ title={formMode === 'create' ? 'Create User' : 'Edit User'}>
            <UserForm
              mode={formMode}
              initialData={selectedUser}
              roles={roles}
              onSuccess={/* ... */}
              onCancel={/* ... */}
            />
          </Modal>
        )}
        {/* ... ConfirmationDialog for delete ... */}
      </div>
    );
  };
  export default AdminUserManagementPage;
  ```

This feature ensures that administrators can effectively manage the accounts and roles of personnel who will operate or oversee the BQOMIS system, distinct from the client users who self-register. The use of role filtering (`?roles=STAFF,ADMIN`) in the API call is key to focusing this page on relevant user types.

### III.6. Admin Features - Appointment Management (`AdminAppointmentManagementPage.jsx`)

- **Purpose:** This feature provides administrators with a comprehensive view of all appointments across the BQOMIS system. It allows them to search, filter, view details, update the status of appointments (e.g., mark as "CHECKED_IN", "COMPLETED", "NO_SHOW"), and cancel appointments if necessary. This serves as a central operational tool for overseeing appointment activities.
- **Accessibility:** Accessed via a route like `/admin/appointments-management` (or similar), typically linked from "Appt. Management" in the admin sidebar. This route is protected and requires admin authentication.

- **Key UI Elements & Workflow (`AdminAppointmentManagementPage.jsx`):**

  1.  **Page Header:**

      - Displays the title "Appointment Management."

  2.  **Filters Container:**

      - A dedicated section for filtering the list of appointments. Common filters include:
        - **Date Range:** "Date From" and "Date To" date pickers.
        - **District:** Dropdown populated with all districts (`GET /api/districts`).
        - **Branch:** Dropdown populated with all branches (`GET /api/branches`). (Could be dynamically filtered by selected district if desired).
        - **Service:** Dropdown populated with all services (`GET /api/services`).
        - **Status:** Dropdown with predefined appointment statuses (e.g., "SCHEDULED", "CHECKED_IN", "COMPLETED", "CANCELLED", "NO_SHOW").
      - An "Apply Filters" button to trigger fetching appointments based on the selected criteria.

  3.  **Appointments Table:**

      - Displays a list of appointments matching the current filter criteria. Pagination would be necessary if the number of appointments can be large.
      - **Columns typically include:**
        - Appointment ID
        - Date
        - Time
        - Service Name (available directly from the enhanced `Appointment` DTO)
        - Branch Name (available directly from the enhanced `Appointment` DTO)
        - Client User ID (or could be enhanced to show client username/email if user details are joined/fetched)
        - Status (with a visual status badge)
        - Actions
      - If no appointments match, a relevant message is shown.

  4.  **Actions per Appointment Row:**

      - **Details Button:** Opens a modal (`Modal.jsx`) displaying more comprehensive details of the selected appointment (all fields from the `Appointment` object).
      - **Status Button (or "Update Status"):** Opens a modal allowing the admin to change the status of the appointment.
        - The modal shows current appointment details and a dropdown with all possible statuses.
        - Upon selecting a new status and confirming, an API call is made to `PUT /api/appointments/{id}/status` (via `updateAppointmentStatus` from `appointmentService.js`) with the payload `{ "status": "NEW_STATUS" }`.
        - The appointment list is refreshed on success.
      - **Cancel Button:**
        - Visible for appointments that are cancellable (e.g., "SCHEDULED", "CHECKED_IN").
        - Opens a `ConfirmationDialog.jsx`.
        - Upon confirmation, an API call to `DELETE /api/appointments/{id}` (via `deleteAppointment` from `appointmentService.js`) is made.
        - The list is refreshed on success.

  5.  **Data Fetching:**
      - **Filter Options:** On component mount, fetches data for filter dropdowns:
        - `GET /api/branches` (via `getAllBranches`)
        - `GET /api/services` (via `getAllServices`)
        - `GET /api/districts` (via `getAllDistricts`)
      - **Appointments List:**
        - Triggered by initial load or when filters are applied (or pagination changes).
        - `GET /api/appointments` with query parameters based on the `filters` state (e.g., `?dateFrom=...&branchId=...&status=...`). This is handled by `getFilteredAppointments`.
        - The `Appointment` DTOs returned by this endpoint are expected to include `branchName` and `serviceName` directly, simplifying display.
      - Loading and error states are managed.

- **Modals Used:**

  - `Modal.jsx`: For displaying appointment details and for the update status form.
  - `ConfirmationDialog.jsx`: For cancellation confirmations.

- **State Management (`AdminAppointmentManagementPage.jsx`):**

  - `appointments`: Array to store the fetched list of appointments.
  - `isLoading`, `error`.
  - `filters`: Object to hold current filter values.
  - `branches`, `services`, `districts`: Arrays for populating filter dropdowns.
  - `selectedAppointment`: Stores the appointment object for detail view, status update, or cancellation.
  - `isDetailModalOpen`, `isStatusModalOpen`, `isCancelConfirmOpen`: Booleans for modal visibility.
  - `newStatus`: String to hold the new status selected in the update status modal.

- **API Service Functions Used (from `appointmentService.js`, `branchService.js`, etc.):**

  - `getFilteredAppointments(filters, token)`
  - `getAppointmentById(appointmentId, token)` (Potentially for a more detailed view if list data is minimal)
  - `updateAppointmentStatus(appointmentId, status, token)`
  - `deleteAppointment(appointmentId, token)`
  - `getAllBranches(token)`
  - `getAllServices(token)`
  - `getAllDistricts(token)`

- **Key Code Snippet (`AdminAppointmentManagementPage.jsx` - simplified structure):**

  ```javascript
  // src/pages/admin/AdminAppointmentManagementPage.jsx (Illustrative)
  import React, { useState, useEffect, useCallback } from "react";
  import { useAuth } from "../../contexts/AuthContext";
  import {
    getFilteredAppointments,
    updateAppointmentStatus,
    deleteAppointment,
  } from "../../api/appointmentService";
  // ... imports for branch, service, district services, Modal, ConfirmationDialog ...
  // import './AdminAppointmentManagementPage.scss';

  const APPOINTMENT_STATUSES = [
    "SCHEDULED",
    "CHECKED_IN",
    "COMPLETED",
    "CANCELLED",
    "NO_SHOW",
  ];

  const AdminAppointmentManagementPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [filters, setFilters] = useState({
      /* ... initial filter values ... */
    });
    // ... states for isLoading, error, filter options (branches, services, districts) ...
    // ... states for modals (isDetailModalOpen, isStatusModalOpen, etc.) and selectedAppointment ...
    const { token } = useAuth();

    // Fetch filter dropdown data (branches, services, districts)
    useEffect(() => {
      /* ... fetch filter data ... */
    }, [token]);

    const fetchAppointments = useCallback(async () => {
      // ... setIsLoading, clear error ...
      try {
        const activeFilters = {
          /* ... construct active filters from state ... */
        };
        const data = await getFilteredAppointments(activeFilters, token);
        setAppointments(Array.isArray(data) ? data : data?.content || []);
      } catch (err) {
        /* ... setError ... */
      } finally {
        /* ... setIsLoading(false) ... */
      }
    }, [token, filters]);

    useEffect(() => {
      fetchAppointments();
    }, [fetchAppointments]);

    // ... handlers: handleFilterChange, handleApplyFilters, handleViewDetails,
    // handleOpenUpdateStatus, handleUpdateStatus, handleOpenCancel, confirmCancelAppointment ...

    return (
      <div className="admin-appointment-management-page">
        <header className="page-header">
          <h1>Appointment Management</h1>
        </header>
        {/* ... Error display ... */}
        <div className="filters-container">
          {/* ... Filter inputs/selects for date, district, branch, service, status ... */}
          <button onClick={handleApplyFilters}>Apply Filters</button>
        </div>
        {/* ... Loading message ... */}
        {/* ... Table rendering appointments ... */}
        {/* Each row has app.serviceName, app.branchName directly */}
        {/* Action buttons: Details, Status, Cancel */}

        {/* ... Modals for Details, Update Status ... */}
        {/* ... ConfirmationDialog for Cancel ... */}
      </div>
    );
  };
  export default AdminAppointmentManagementPage;
  ```

This page serves as a critical operational interface for admins, allowing them to monitor and manage the flow of appointments throughout the BQOMIS system. The ability to filter and update statuses is key to handling daily operations and exceptions.

### III.7. Admin Features - Analytics Dashboard (`AdminDashboardPage.jsx`)

- **Purpose:** The Admin Dashboard & Analytics page provides administrators with a visual overview of key performance indicators (KPIs) and trends within the BQOMIS system. It utilizes charts and summaries to help understand appointment volumes, service popularity, branch performance, and peak operational times, enabling data-driven decision-making.
- **Accessibility:** Accessed via the `/admin/dashboard` route, typically the default landing page for authenticated admins and linked from "Dashboard & Analytics" in the admin sidebar. This route is protected and requires admin authentication.
- **Charting Library:** The dashboard uses **Recharts**, a composable charting library for React, to render various types of charts (Bar, Line, Pie).

- **Key UI Elements & Functionality (`AdminDashboardPage.jsx`):**

  1.  **Page Header:**

      - Displays the title "Admin Dashboard & Analytics."

  2.  **Global Filters Area:**

      - **Period Selector:** A dropdown to select the time period for which analytics are displayed (e.g., "Today," "Last 7 Days," "Last 30 Days"). This selection updates a `selectedPeriod` state variable (e.g., in the format "YYYY-MM-DD_to_YYYY-MM-DD") which is then passed to the analytics API calls.

  3.  **Dashboard Grid / Chart Cards:**

      - The main content area is typically a grid displaying various "chart cards." Each card focuses on a specific metric or data dimension.
      - Loading and error states are managed for the overall dashboard data fetching. Each chart card might also implicitly handle "no data" states.

  4.  **Specific Analytics Charts & Data:**

      - **A. Overall Peak Times:**

        - **Purpose:** Shows when appointment demand is highest, either by hour of the day or by day of the week.
        - **UI:** A Line Chart. An inline dropdown allows the admin to switch the `groupBy` parameter between "hour" and "dayOfWeek".
        - **API Call:** `GET /api/analytics/peak-times?period=...&groupBy=hour|dayOfWeek` (via `getPeakTimesAnalytics` from `analyticsService.js`).
        - **Data Transformation:** API response (e.g., `[{ "hour": 10, "count": 12 }, ...]`) is transformed for Recharts (e.g., `name` for X-axis label like "10:00-11:00" or "Tuesday", `Appointments` for Y-axis value).

      - **B. Branch Performance / Appointments by Branch:**

        - **Purpose:** Shows appointment distribution and status breakdown (Completed, Cancelled, No-Show) per service for a selected branch.
        - **UI:** A Bar Chart. A dropdown allows the admin to select a specific branch. Branches are populated from `GET /api/branches`.
        - **API Call:** `GET /api/analytics/appointments-by-branch?branchId=...&period=...` (via `getAppointmentsByBranchAnalytics`).
        - **Data Display:** If a branch is selected, a sub-header shows the branch name and total appointments. The Bar Chart then displays services offered by that branch on the X-axis and bars for "Completed," "Cancelled," and "No-Show" counts for each service.

      - **C. Service Performance by District:**

        - **Purpose:** Shows the performance (Completed, Cancelled, No-Show ratio) of a specific service within a selected district.
        - **UI:** A Pie Chart. Two dropdowns allow selection of a District (from `GET /api/districts`) and then a Service (from `GET /api/services`).
        - **API Call:** `GET /api/analytics/appointments-by-service?district=...&serviceId=...&period=...` (via `getAppointmentsByServiceAnalytics`).
        - **Data Display:** If district and service are selected, a sub-header shows their names and total appointments. The Pie Chart visualizes the breakdown of `completed`, `cancelled`, and `no_show` counts for that specific service in that district.

      - **D. Peak Times by District:**
        - **Purpose:** Similar to overall peak times but filtered for a specific district, allowing for analysis of localized demand patterns.
        - **UI:** A Line Chart. A dropdown to select a district. An inline dropdown to switch `groupBy` ("hour" or "dayOfWeek").
        - **API Call:** `GET /api/analytics/peak-times-by-district?district=...&period=...&groupBy=hour|dayOfWeek` (via `getPeakTimesByDistrictAnalytics`).
        - **Data Transformation:** Similar to overall peak times.

  5.  **Data Fetching Strategy:**
      - When the page loads or when global filters (like `selectedPeriod`) or chart-specific filters (like `selectedBranchIdForAnalytics`) change, the `fetchAllAnalytics` function is triggered.
      - This function uses `Promise.allSettled` to make multiple API calls to the various analytics endpoints concurrently. This ensures that even if one analytics API call fails, others can still succeed and display their data.
      - The results are then set into their respective state variables (`branchAnalytics`, `serviceAnalytics`, `peakTimes`, `peakTimesDistrict`).

- **State Management (`AdminDashboardPage.jsx`):**

  - Filter states: `selectedPeriod`, `selectedBranchIdForAnalytics`, `selectedDistrictForAnalytics`, `selectedServiceIdForAnalytics`, `peakTimeGroupBy`, `peakTimeDistrictGroupBy`.
  - Data states for each chart: `branchAnalytics`, `serviceAnalytics`, `peakTimes`, `peakTimesDistrict`.
  - Dropdown options: `branches`, `districts`, `allServices`.
  - `isLoading`, `error`.

- **API Service Functions Used (from `analyticsService.js`, `branchService.js`, etc.):**

  - All functions from `analyticsService.js`.
  - `getAllBranches(token)`
  - `getAllDistricts(token)`
  - `getAllServices(token)` (aliased as `getAllBankingServices`)

- **Recharts Components Used:**

  - `BarChart`, `Bar`, `LineChart`, `Line`, `PieChart`, `Pie`, `Cell`
  - `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, `ResponsiveContainer`

- **Key Code Snippet (`AdminDashboardPage.jsx` - illustrative structure for fetching and one chart):**

  ```javascript
  // src/pages/admin/AdminDashboardPage.jsx (Illustrative)
  import React, { useState, useEffect, useCallback } from "react";
  import { useAuth } from "../../contexts/AuthContext";
  // ... API service imports ...
  import {
    LineChart,
    Line,
    XAxis,
    YAxis /* ... other Recharts imports */,
  } from "recharts";
  // import './AdminDashboardPage.scss';

  const formatDatePeriod = (days) => {
    /* ... returns "YYYY-MM-DD_to_YYYY-MM-DD" ... */
  };
  const DAY_OF_WEEK_MAP = {
    /* ... */
  };
  HOUR_MAP = (h) => {
    /* ... */
  };

  const AdminDashboardPage = () => {
    const { token } = useAuth();
    const [selectedPeriod, setSelectedPeriod] = useState(formatDatePeriod(7));
    const [peakTimes, setPeakTimes] = useState(null);
    const [peakTimeGroupBy, setPeakTimeGroupBy] = useState("hour");
    // ... other states for filters, data, loading, error ...

    const fetchAllAnalytics = useCallback(async () => {
      if (!token) return;
      // ... setIsLoading, setError(null) ...
      try {
        const ptData = await getPeakTimesAnalytics(
          selectedPeriod,
          peakTimeGroupBy,
          token
        );
        setPeakTimes(ptData);
        // ... fetch other analytics data using Promise.allSettled ...
      } catch (err) {
        /* ... setError ... */
      } finally {
        /* ... setIsLoading(false) ... */
      }
    }, [
      token,
      selectedPeriod,
      peakTimeGroupBy /* ... other filter dependencies ... */,
    ]);

    useEffect(() => {
      fetchAllAnalytics();
    }, [fetchAllAnalytics]);

    const peakTimesData =
      peakTimes?.peakTimes?.map((pt) => ({
        name:
          peakTimeGroupBy === "hour"
            ? HOUR_MAP(pt.hour)
            : DAY_OF_WEEK_MAP[pt.dayOfWeek],
        Appointments: pt.count,
      })) || [];

    return (
      <div className="admin-dashboard-page">
        <header className="page-header">
          <h1>Admin Dashboard & Analytics</h1>
        </header>
        {/* ... Filters Area ... */}
        {/* ... Loading/Error messages ... */}

        <div className="dashboard-grid">
          <div className="chart-card">
            <h3>Overall Peak Times ({peakTimeGroupBy})</h3>
            <select
              value={peakTimeGroupBy}
              onChange={(e) => setPeakTimeGroupBy(e.target.value)}
            >
              <option value="hour">By Hour</option>
              <option value="dayOfWeek">By Day of Week</option>
            </select>
            {peakTimesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={peakTimesData}>
                  {/* ... Chart components (XAxis, YAxis, Line, Tooltip, etc.) ... */}
                  <XAxis dataKey="name" /> <YAxis /> <Line dataKey="Appointments" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>No data.</p>
            )}
          </div>
          {/* ... Other chart cards for Branch Performance, Service Performance, etc. ... */}
        </div>
      </div>
    );
  };
  export default AdminDashboardPage;
  ```

This analytics dashboard leverages the dedicated backend analytics endpoints to provide valuable insights with clear visualizations, aiding administrators in monitoring and optimizing the bank's queue management operations. The use of filters allows for targeted analysis of different aspects of the system.

### III.8. Admin Features - Settings Page (`AdminSettingsPage.jsx`)

- **Purpose:** The Admin Settings page allows administrators to configure system-wide default parameters and branch-specific overrides for various operational aspects of the BQOMIS application. This provides flexibility in tailoring the system's behavior to meet specific business needs or branch capacities.
- **Accessibility:** Accessed via the `/admin/settings` route, linked from "Settings" in the admin sidebar. This route is protected and requires admin authentication.

- **Key UI Elements & Workflow (`AdminSettingsPage.jsx`):**

  1.  **Page Header:**

      - Displays the title "Application Settings."

  2.  **Global Default Settings Section:**

      - **Purpose:** Allows configuration of default values that apply system-wide unless overridden at a branch level.
      - **UI:** A form containing input fields for each global setting. Examples include:
        - **Booking Window (Days):** Number input (e.g., how many days in advance clients can book).
        - **Default Queue Threshold (Low):** Number input (max appointments per hour for "Low" traffic indicator).
        - **Default Queue Threshold (Moderate):** Number input (max appointments per hour for "Moderate" traffic).
        - **Default Slot Duration (Minutes):** Number input.
        - **Maintenance Mode:** Checkbox to enable/disable.
        - Other settings like `minBookingNoticeHours`, `defaultAllowCancellationHours`.
      - **Action:** A "Save Global Settings" button.
        - On click, an API call is made to `PUT /api/settings/global` (via `updateGlobalSettings` from `settingsService.js`) with all current global setting values.
        - Success or error messages are displayed.

  3.  **Branch-Specific Setting Overrides Section:**

      - **Purpose:** Allows administrators to define settings for individual branches that will override the global defaults.
      - **UI:**
        - **Branch Selector:** A dropdown menu to select a specific branch. Populated by fetching all branches (`GET /api/branches`).
        - **Override Form (appears when a branch is selected):**
          - Input fields for each setting that can be overridden at the branch level (e.g., "Queue Threshold (Low)," "Queue Threshold (Moderate)," "Slot Duration (Minutes)," "Max Appointments Per Slot").
          - **Placeholders & Effective Values:** Each input field often shows a placeholder indicating the current global default (e.g., "Global: 30"). The page also displays the "Effective" value for the selected branch (which is either its specific override or the global default if no override is set).
          - **Clearing an Override:** To revert a branch-specific setting back to the global default, the admin typically clears the input field. The frontend then sends `null` (or an empty string that the backend interprets as "use default") for that setting in the update payload.
      - **Action:** A "Save Branch Settings" button for the selected branch.
        - On click, an API call is made to `PUT /api/branches/{branchId}/settings` (via `updateBranchSettings`) with only the override values (or `null` to clear an override).
        - Success or error messages are displayed. The effective settings display is updated.

  4.  **Data Fetching Strategy:**
      - **Initial Load:**
        - `GET /api/settings/global` (via `getGlobalSettings`): Fetches the current global configuration.
        - `GET /api/branches` (via `getAllBranches`): Fetches all branches for the branch selector dropdown.
      - **On Branch Selection (for overrides):**
        - `GET /api/branches/{branchId}/settings` (via `getBranchSettings`): Fetches any existing overrides for the selected branch. The response might be an object with only the overridden fields, or specific DTO. The frontend merges this with its knowledge of global defaults to show "effective" settings.
      - Loading and error states are managed for these operations.

- **State Management (`AdminSettingsPage.jsx`):**

  - `globalSettings`: Object storing the values for global configuration.
  - `branches`: Array of branch objects for the selector.
  - `selectedBranchIdForSettings`: Stores the ID of the branch currently selected for override configuration.
  - `branchSpecificSettings`: Object storing the _override_ values for the selected branch. Fields can be `null` if no override is set for that specific setting.
  - `effectiveBranchSettings`: Object derived from `globalSettings` and `branchSpecificSettings` to show the actual settings in effect for the selected branch.
  - Various `isLoading`, `isSaving`, `Error`, and `Success` states for both global and branch-specific sections.

- **API Service Functions Used (from `settingsService.js` and `branchService.js`):**

  - `getGlobalSettings(token)`
  - `updateGlobalSettings(settingsData, token)`
  - `getBranchSettings(branchId, token)`
  - `updateBranchSettings(branchId, settingsData, token)`
  - `getAllBranches(token)` (to populate branch selector)

- **Backend Data Model Implication:**

  - This design implies two main tables on the backend:
    - `GlobalApplicationConfiguration`: A single-row table for global defaults.
    - `BranchConfigurationOverrides`: A table where each row links a `branch_id` to specific override values (with `NULL` indicating no override for a particular setting).

- **Key Code Snippet (`AdminSettingsPage.jsx` - illustrative structure):**

  ```javascript
  // src/pages/admin/AdminSettingsPage.jsx (Illustrative)
  import React, { useState, useEffect, useCallback } from "react";
  import { useAuth } from "../../contexts/AuthContext";
  import {
    getGlobalSettings,
    updateGlobalSettings,
    getBranchSettings,
    updateBranchSettings,
  } from "../../api/settingsService";
  import { getAllBranches } from "../../api/branchService";
  // import './AdminSettingsPage.scss';

  const AdminSettingsPage = () => {
    const { token } = useAuth();
    const [globalSettings, setGlobalSettings] = useState({
      /* ... initial defaults ... */
    });
    const [branches, setBranches] = useState([]);
    const [selectedBranchIdForSettings, setSelectedBranchIdForSettings] =
      useState("");
    const [branchSpecificSettings, setBranchSpecificSettings] = useState({
      /* ... initial nulls ... */
    });
    const [effectiveBranchSettings, setEffectiveBranchSettings] = useState({});
    // ... loading, saving, error, success states ...

    // Fetch global settings and branches on mount
    useEffect(() => {
      /* ... fetch global settings and all branches ... */
    }, [token]);

    // Fetch branch-specific settings when selectedBranchIdForSettings changes
    const fetchBranchOverrides = useCallback(async () => {
      if (!selectedBranchIdForSettings || !token) {
        /* reset states */ return;
      }
      // ... setIsLoadingBranch ...
      try {
        const overrides = await getBranchSettings(
          selectedBranchIdForSettings,
          token
        );
        setBranchSpecificSettings((prev) => ({
          /* merge overrides with prev structure, ensuring all keys exist */
        }));
      } catch (err) {
        /* ... setBranchError ... */
      } finally {
        /* ... setIsLoadingBranch(false) ... */
      }
    }, [selectedBranchIdForSettings, token]);
    useEffect(() => {
      fetchBranchOverrides();
    }, [fetchBranchOverrides]);

    // Calculate effective settings
    useEffect(() => {
      if (selectedBranchIdForSettings) {
        setEffectiveBranchSettings({
          queueThresholdLow:
            branchSpecificSettings.queueThresholdLow ??
            globalSettings.defaultQueueThresholdLow,
          // ... other settings ...
        });
      } else {
        setEffectiveBranchSettings({});
      }
    }, [globalSettings, branchSpecificSettings, selectedBranchIdForSettings]);

    // ... handleGlobalSettingChange, handleBranchSettingChange ...
    // ... handleSaveGlobalSettings, handleSaveBranchSettings ...
    // ... getInputPlaceholder for branch override form ...

    return (
      <div className="admin-settings-page">
        <header className="page-header">
          <h1>Application Settings</h1>
        </header>

        <section className="settings-section global-settings">
          <h2>Global Default Settings</h2>
          {/* ... Global settings form ... */}
          <form onSubmit={handleSaveGlobalSettings}>
            {/* Input for globalSettings.bookingWindowDays etc. */}
            <button type="submit">Save Global Settings</button>
          </form>
        </section>

        <section className="settings-section branch-settings">
          <h2>Branch-Specific Setting Overrides</h2>
          <select
            value={selectedBranchIdForSettings}
            onChange={(e) => setSelectedBranchIdForSettings(e.target.value)}
          >
            {/* ... options for branches ... */}
          </select>
          {selectedBranchIdForSettings && (
            <form onSubmit={handleSaveBranchSettings}>
              {/* Input for branchSpecificSettings.queueThresholdLow etc., showing effective value and placeholder */}
              <button type="submit">Save Branch Settings</button>
            </form>
          )}
        </section>
      </div>
    );
  };
  export default AdminSettingsPage;
  ```

This settings page provides granular control over key operational parameters of BQOMIS, allowing administrators to fine-tune the system for optimal performance and user experience based on both general policies and specific branch needs. The separation of global defaults and branch-specific overrides offers a flexible and powerful configuration model.

---

## IV. Appendix

### 1. API Endpoint Summary

This section provides a summary of the backend API endpoints that the BQOMIS Frontend interacts with. All endpoints are assumed to be prefixed with the `VITE_API_BASE_URL` (e.g., `http://localhost:8080/api`). Authentication (via JWT Bearer token) is required for most admin endpoints and client-specific data endpoints.

**User Management (`UserController`)**

- **`GET /users`**
  - Description: Retrieves users. The frontend uses this with query parameters for specific roles.
  - Frontend Usage:
    - Admin User Management: `GET /users?roles=STAFF,ADMIN` (to list staff and admin users).
    - Dev Data Tools: `GET /users?role=TESTER` (to fetch test users for data generation).
- **`GET /users/{id}`**
  - Description: Retrieves a specific user by ID.
  - Frontend Usage:
    - `AuthContext`: To refresh user details after profile updates.
- **`POST /users`**
  - Description: Creates a new user.
  - Frontend Usage:
    - Client Sign Up: Payload includes `{ username, email, phoneNumber, password, role: "CLIENT" }`.
    - Admin User Management: Admin creates STAFF/ADMIN users, setting a temporary password. Payload includes role.
- **`PATCH /users/{id}`** (Assumed, as `PUT` was also considered)
  - Description: Updates specific fields of an existing user.
  - Frontend Usage:
    - Admin User Management: To update user's `username`, `phoneNumber`, `role`.
    - Client Profile Page: To update `username`, `phoneNumber` (using `PUT` in earlier discussion, but `PATCH` is suitable for partial updates).
- **`DELETE /users/{id}`**
  - Description: Deletes a user by ID.
  - Frontend Usage:
    - Admin User Management: To delete STAFF/ADMIN users.
- **`POST /users/change-password`**
  - Description: Allows a user to change their password.
  - Frontend Usage:
    - Client Profile Page: Payload includes `{ email, oldPassword, newPassword }`.

**Role Management (`RoleController`)**

- **`GET /roles`**
  - Description: Retrieves all available roles.
  - Frontend Usage:
    - Admin User Management: To populate role selection dropdown when creating/editing users.

**District Management (`DistrictController`)**

- **`GET /districts`**
  - Description: Retrieves all districts (each includes province information).
  - Frontend Usage:
    - Client Branch & Service Discovery: To populate province and district selection.
    - Admin Branch Management (`BranchForm`): To populate district selection.
    - Admin Analytics Dashboard: To populate district filter dropdowns.
- **`GET /districts/{provinceName}`** (Available, but frontend currently derives provinces from `GET /districts`)
  - Description: Gets districts by province name.
- **(Other `POST`, `DELETE` for districts are backend-managed, not directly used by current frontend admin forms).**

**Branch Management (`BranchController`)**

- **`GET /branches`**
  - Description: Gets all branches.
  - Frontend Usage:
    - Admin Branch Management: To list branches.
    - Admin Settings Page: To populate branch selector for overrides.
    - Admin Analytics Dashboard: To populate branch filter dropdowns.
- **`GET /branches/district/{districtName}`**
  - Description: Gets branches by district name.
  - Frontend Usage:
    - Client Branch & Service Discovery: To list branches after a district is selected.
- **`POST /branches`**
  - Description: Creates a new branch.
  - Frontend Usage:
    - Admin Branch Management (`BranchForm`): Payload includes `{ name, address, district (name), province (name) }`.
- **`DELETE /branches/{id}`**
  - Description: Deletes a branch by ID.
  - Frontend Usage:
    - Admin Branch Management.
- **(`PUT /branches/{id}` for updates was discussed as a future refinement for Admin Branch Management).**

**Service Management (`ServiceController`)**

- **`GET /services`**
  - Description: Gets all available banking services.
  - Frontend Usage:
    - Admin Service Management: To list services.
    - Admin Branch-Service Relationships: To list all system services.
    - Admin Analytics Dashboard: To populate service filter dropdowns.
- **`POST /services`**
  - Description: Creates a new service.
  - Frontend Usage:
    - Admin Service Management (`ServiceForm`): Payload includes `{ name, description }`.
- **`DELETE /services/{id}`**
  - Description: Deletes a service by ID.
  - Frontend Usage:
    - Admin Service Management.
- **(Backend endpoint `GET /services/branch/{branchId}` exists but frontend primarily uses `GET /branch-services/branch/{branchId}` for client view).**

**Branch-Service Relationship Management (`BranchServiceController` or `BranchLinkController`)**

- **`GET /branch-services`**
  - Description: Gets all branch-service relationships.
  - Frontend Usage:
    - Admin Branch-Service Relationships: To get a complete list of all `BranchService` links for initial data or if needed for complex views.
    - Client My Appointments Page: (Previously used, now less critical due to enhanced `Appointment` DTO) To map `branchServiceId` to branch/service names.
- **`GET /branch-services/branch/{branchId}`**
  - Description: Gets services available at (linked to) a specific branch. Returns `BranchService` link objects.
  - Frontend Usage:
    - Client Branch & Service Discovery: To list services for a selected branch.
    - Admin Branch-Service Relationships: To list services currently assigned to a selected branch.
- **`POST /branch-services`**
  - Description: Creates a new branch-service relationship.
  - Frontend Usage:
    - Admin Branch-Service Relationships: Payload typically `{ branchId, serviceId }`.
- **`DELETE /branch-services/{id}`**
  - Description: Deletes a branch-service relationship by its _own unique ID_ (the ID of the link/row in the `BranchService` table).
  - Frontend Usage:
    - Admin Branch-Service Relationships.

**Appointment Management (`AppointmentController`)**

- **`GET /appointments`**
  - Description: Gets all appointments. Can be enhanced with query parameters for filtering.
  - Frontend Usage:
    - Admin Appointment Management (`getFilteredAppointments`): Used with various filters (`dateFrom`, `dateTo`, `branchId`, `serviceId`, `status`, `districtName`).
- **`GET /appointments/{id}`**
  - Description: Gets a specific appointment by ID.
  - Frontend Usage:
    - Admin Appointment Management (potentially for a detailed view modal).
- **`GET /appointments/user/{userId}`**
  - Description: Gets all appointments for a specific user. (Returns enhanced `Appointment` DTO with branch/service names).
  - Frontend Usage:
    - Client My Appointments Page.
    - Client Home Page (to show next upcoming appointment).
- **`GET /appointments?date=YYYY-MM-DD&branchServiceId=X`** (Used as a specific query on `/appointments`)
  - Description: Gets appointments for a specific date and branch-service link.
  - Frontend Usage:
    - Client Appointment Booking: To determine available time slots.
- **`GET /appointments/today/branch/{branchId}`**
  - Description: Gets today's appointments at a specific branch.
  - Frontend Usage:
    - Client Branch & Service Discovery: To fetch all appointments for a branch today, then client-side filter per `branchServiceId` for traffic calculation.
- **(Backend also has `/api/appointments/date/{date}` and `/api/appointments/today/district/{districtName}/service/{serviceId}`, which the frontend could use if more specific pre-filtered data is preferred over client-side processing in some cases).**
- **`POST /api/appointments`**
  - Description: Creates a new appointment.
  - Frontend Usage:
    - Client Appointment Booking: Payload `{ userId, branchServiceId, date, time, status: "SCHEDULED" }`.
- **`POST /api/appointments/batch`**
  - Description: Creates multiple appointments in a single request.
  - Frontend Usage:
    - Admin Dev Data Tools: Payload is an array of appointment objects.
- **`PUT /api/appointments/{id}/status`**
  - Description: Updates the status of an existing appointment.
  - Frontend Usage:
    - Admin Appointment Management: Payload `{ "status": "NEW_STATUS" }`.
- **`DELETE /api/appointments/{id}`**
  - Description: Deletes/Cancels an appointment by ID.
  - Frontend Usage:
    - Client My Appointments Page (client cancels own appointment).
    - Admin Appointment Management (admin cancels any appointment).

**Analytics (`AnalyticsController`)**

- **`GET /analytics/appointments-by-branch?branchId=...&period=YYYY-MM-DD_to_YYYY-MM-DD`**
- **`GET /analytics/appointments-by-service?district=...&serviceId=...&period=...`**
- **`GET /analytics/peak-times?period=...&groupBy=hour|dayOfWeek`**
- **`GET /analytics/peak-times-by-district?district=...&period=...&groupBy=hour|dayOfWeek`**
  - Description: These endpoints provide aggregated data for the admin analytics dashboard.
  - Frontend Usage:
    - Admin Dashboard Page: To populate various charts.

**Settings (`SettingsController`)**

- **`GET /settings/global`**
  - Description: Retrieves global application settings.
  - Frontend Usage:
    - Admin Settings Page.
- **`PUT /settings/global`**
  - Description: Updates global application settings.
  - Frontend Usage:
    - Admin Settings Page.
- **`GET /branches/{branchId}/settings`**
  - Description: Retrieves branch-specific setting overrides.
  - Frontend Usage:
    - Admin Settings Page.
- **`PUT /branches/{branchId}/settings`**
  - Description: Updates or creates branch-specific setting overrides.
  - Frontend Usage:
    - Admin Settings Page.

This summary covers the primary interactions between the BQOMIS frontend and backend based on the features developed. Specific query parameters and request/response payloads have been implemented as discussed during each feature's development.

### IV.2. Appendix - Key SCSS Variables Overview (`_variables.scss`)

The BQOMIS Frontend utilizes a centralized SCSS variables file (`src/assets/styles/_variables.scss`) to manage its design tokens. This approach ensures visual consistency, facilitates easy theming, and promotes maintainability. Below is an overview of the key categories and examples of variables defined.

_(Note: The exact values are illustrative examples based on a dark theme context from our discussions. Actual values are in the `_variables.scss` file.)_

**A. Color Palette**

This forms the foundation of the application's look and feel.

1.  **Primary Colors (Brand Colors):**

    - `$primary-color: #646cff;` (e.g., Vite purple, used for main interactive elements, links, active states)
    - `$primary-color-dark: #535bf2;` (Darker shade for hover/active states on primary elements)
    - `$primary-color-light: #787eff;` (Lighter shade, potentially for borders or subtle highlights)

2.  **Secondary Colors (Supporting Colors):**

    - `$secondary-color: #4CAF50;` (Example: Green, used for alternative actions or accents)
    - `$secondary-color-dark: #388E3C;`
    - `$secondary-color-light: #81C784;`

3.  **Accent/Highlight Colors:**

    - `$accent-color: #FFC107;` (Example: Amber/Yellow, for specific highlights or calls to action)

4.  **Neutral/Grayscale Colors (Crucial for backgrounds, text, borders):**

    - `$neutral-darkest: #1a1a1a;` (Very dark, near black)
    - `$neutral-darker: #242424;` (Default main background)
    - `$neutral-dark: #2c2c2e;` (Slightly lighter, e.g., sidebar background)
    - `$neutral-medium-dark: #3a3a3a;` (e.g., for card backgrounds, form containers)
    - `$neutral-medium: #555555;` (Borders, less important text, disabled states)
    - `$neutral-medium-light: #777777;` (Muted text)
    - `$neutral-light: #aaaaaa;` (Secondary text on dark backgrounds)
    - `$neutral-lighter: #cccccc;` (Lighter text)
    - `$neutral-lightest: #f0f0f0;` (Primary text color on dark backgrounds)
    - `$neutral-white: #ffffff;` (Pure white, for text on very dark or colored backgrounds)

5.  **Semantic Colors (For UI states and feedback):**
    - `$success-color: #28a745;` (Green for success messages, positive indicators)
    - `$error-color: #dc3545;` (Red for error messages, destructive actions)
    - `$warning-color: #ffc107;` (Yellow/Amber for warnings, moderate traffic indicators)
    - `$info-color: #17a2b8;` (Blue for informational messages or accents)

**B. UI Element Color Mappings**

These variables map the abstract color palette to specific UI components and contexts.

- **Backgrounds:**
  - `$bg-primary: $neutral-darker;` (Main page background)
  - `$bg-secondary: $neutral-dark;` (e.g., Sidebars, cards, modals)
  - `$bg-tertiary: $neutral-medium-dark;` (e.g., Input fields, nested containers)
- **Text:**
  - `$text-primary: $neutral-lightest;` (Default text color)
  - `$text-secondary: $neutral-light;` (Subtler text, descriptions)
  - `$text-muted: $neutral-medium-light;` (Placeholder text, disabled text)
  - `$text-link: $primary-color;`
  - `$text-link-hover: $primary-color-dark;`
  - `$text-on-primary-bg: $neutral-white;` (Text color for elements with `$primary-color` background)
- **Borders:**
  - `$border-color: $neutral-medium;` (Default border color for inputs, table cells)
  - `$border-color-strong: $neutral-medium-dark;`
- **Buttons (Examples):**
  - `$btn-primary-bg: $primary-color;`
  - `$btn-primary-text: $text-on-primary-bg;`
  - `$btn-primary-hover-bg: $primary-color-dark;`
  - `$btn-danger-bg: $error-color;`
  - `$btn-danger-text: $neutral-white;`

**C. Typography (Examples)**

- `$font-family-sans-serif: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;` (Main font stack)
- `$font-size-base: 1rem;` (Default font size, e.g., 16px)
- `$font-size-sm: 0.875rem;`
- `$font-size-lg: 1.25rem;`
- `$line-height-base: 1.5;`

**D. Spacing Units (Examples)**

Used for consistent margins, paddings, and gaps.

- `$spacing-xs: 4px;`
- `$spacing-sm: 8px;`
- `$spacing-md: 16px;`
- `$spacing-lg: 24px;`
- `$spacing-xl: 32px;`

**E. Borders & Shadows (Examples)**

- `$border-radius-sm: 4px;` (For buttons, inputs)
- `$border-radius-md: 8px;` (For cards, modals)
- `$box-shadow-sm: 0 1px 3px rgba(0,0,0,0.1);`
- `$box-shadow-md: 0 2px 8px rgba(0,0,0,0.15);`

**F. Other UI Primitives**

- Variables for specific component heights (e.g., `$header-height`), widths (e.g., `$sidebar-width`), z-indexes, etc., may also be defined.

**Usage:**

These variables are imported globally via `@use 'variables' as *;` in `src/assets/styles/main.scss`. This makes them directly accessible in all component-specific SCSS files without needing to re-import `_variables.scss` in each file. For instance, a component style can directly use `$primary-color` or `$spacing-md`.

This centralized variable system is fundamental to maintaining a consistent and easily adaptable visual theme for the BQOMIS frontend. Modifying these variables in `_variables.scss` will propagate changes throughout the entire application.

### IV.3. Appendix - Potential Future Enhancements

While the current BQOMIS frontend implements a robust set of core features, several enhancements could be considered for future iterations to further improve functionality, user experience, and technical architecture.

**A. Client-Facing Enhancements:**

1.  **Real-Time Queue Updates & Notifications:**
    - Implement WebSockets or Server-Sent Events (SSE) to provide clients with real-time updates on their queue position after check-in.
    - Push notifications (web or mobile if a PWA/native app is considered) for appointment reminders, when their turn is approaching, or for status changes.
2.  **Profile Picture Upload:**
    - Allow clients to upload and manage their profile pictures instead of just a placeholder.
    - Requires backend storage (e.g., S3) and an upload endpoint.
3.  **Service Ratings & Feedback:**
    - Allow clients to rate services or provide feedback after an appointment is completed.
4.  **Branch Details Page:**
    - A dedicated page for each branch showing more details: map location, full operating hours (if dynamic), contact information, photos, specific amenities.
5.  **Advanced Appointment Search/Filtering (Client-Side):**
    - Allow clients to search their "My Appointments" list by service name, branch, or date range.
6.  **Multi-Language Support (i18n):**
    - Implement internationalization to support multiple languages in the UI.
7.  **Accessibility (WCAG) Enhancements:**
    - Conduct a thorough accessibility audit and implement improvements to meet WCAG AA or AAA standards (more ARIA attributes, enhanced keyboard navigation, focus management).
8.  **Progressive Web App (PWA) Features:**
    - Add a service worker, manifest file, and other PWA capabilities for offline access (e.g., viewing booked appointments) and "add to home screen" functionality.
9.  **Passwordless Login Options:**
    - Consider magic links or social logins (Google, etc.) for alternative authentication methods.

**B. Admin-Facing Enhancements:**

1.  **Full CRUD "Update" Functionality:**
    - Complete the "Edit/Update" API calls and frontend logic for Branch Management, Service Management, and User Management.
2.  **Advanced User Management:**
    - Admin-initiated password resets for users.
    - Ability to activate/deactivate user accounts.
    - Audit logs for user actions.
3.  **Advanced Appointment Management:**
    - Ability for admins to reschedule appointments on behalf of clients (complex, involves finding new slots).
    - Bulk actions on appointments (e.g., bulk status updates).
4.  **More Sophisticated Analytics & Reporting:**
    - Export analytics data (CSV, PDF).
    - More chart types and customizable dashboards.
    - Drill-down capabilities in charts.
    - Alerts for specific KPI thresholds (e.g., unusually long wait times).
5.  **Branch Operating Hours Management:**
    - Allow admins to define default operating hours and then override them per branch, including special holiday hours. This would make the time slot generation more dynamic and accurate.
6.  **Resource Management (Staff Allocation):**
    - Assign staff members to specific services or branches.
    - (Very Advanced) Link appointment availability to staff availability for particular services.
7.  **Customizable Email/Notification Templates:**
    - Allow admins to edit the content of automated emails (confirmations, reminders) sent by the system.
8.  **Audit Trail for Admin Actions:**
    - Log significant actions performed by administrators for security and accountability.

**C. Technical & Architectural Enhancements:**

1.  **Dedicated Data Fetching/Caching Library:**
    - Integrate React Query (TanStack Query) or SWR for more robust server state management, caching, automatic refetching, and optimistic updates. This can significantly improve UI responsiveness and reduce redundant API calls.
2.  **State Management Review:**
    - If global state complexity increases beyond `AuthContext` and simple settings, consider a more structured global state management solution like Zustand or Recoil for specific shared states.
3.  **Comprehensive Unit and Integration Testing:**
    - Increase test coverage using libraries like Jest and React Testing Library.
4.  **End-to-End (E2E) Testing:**
    - Implement E2E tests with Cypress or Playwright for critical user flows.
5.  **Code Splitting and Performance Optimization:**
    - Further optimize bundle sizes using route-based code splitting and lazy loading of components.
    - Image optimization.
6.  **Storybook for Component Development:**
    - Use Storybook to develop and document UI components in isolation, improving reusability and testing.
7.  **GraphQL (Alternative API Layer):**
    - For very complex data fetching requirements or to give the frontend more control over the data it requests, consider exploring GraphQL as an alternative or addition to REST APIs for certain parts of the application.
8.  **Continuous Integration/Continuous Deployment (CI/CD):**
    - Automate testing and deployment pipelines.

These potential enhancements range from small UX improvements to significant architectural changes. Prioritization would depend on evolving business requirements, user feedback, and resource availability. The current foundation is designed to be extensible to accommodate many of these future developments.
