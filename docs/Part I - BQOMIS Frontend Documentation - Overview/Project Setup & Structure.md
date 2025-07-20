
### 2. Project Setup & Structure

**2.1. Development Environment Setup**

The BQOMIS Frontend is built using Vite with React (using the SWC compiler for speed). To set up the development environment:

1.  **Prerequisites:**
    *   Node.js (version 16.x or higher recommended) and npm (or yarn/pnpm).
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
    *   Create a `.env` file in the root of the project.
    *   Add the base URL for the backend API:
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
│   │   ├── devDataTools/    # (Includes generatorUtils.js)
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

*   **`api/`**: Contains JavaScript modules responsible for making HTTP requests to the backend API. Each module typically corresponds to a backend controller or resource (e.g., `branchService.js` for branch-related endpoints).
*   **`assets/styles/`**: Holds global SCSS files.
    *   `_variables.scss`: Defines global SCSS variables for colors, fonts, spacing, etc., enabling consistent theming.
    *   `main.scss`: Imports variables, applies global resets/base styles, and serves as the main stylesheet entry point.
*   **`components/common/`**: Houses small, highly reusable UI components like `Modal.jsx`, `ConfirmationDialog.jsx`, buttons, inputs, etc., that can be used anywhere in the application.
*   **`components/layout/`**: Defines the main structural components of the application, such as `AdminLayout.jsx` and `ClientLayout.jsx`, which provide the consistent header, sidebar, and footer for their respective sections. Includes `TopNav.jsx`, `SidebarNav.jsx`, and `Footer.jsx`.
*   **`contexts/`**: Manages global state using React's Context API. The primary context is `AuthContext.jsx`, which handles user authentication state, session information, and provides login/logout functionalities.
*   **`features/`**: Organizes code by specific application features, particularly for more complex UI or logic related to a domain. For example, `features/admin/devDataTools/generatorUtils.js` contains logic for the data generator.
*   **`pages/`**: Contains top-level components that are mapped to specific routes. These components compose layouts and feature-specific UIs to form complete views. They are further organized into `admin/` and `client/` subdirectories. Shared pages like `SignInPage.jsx` are at the root of `pages/`.
*   **`App.jsx` (in `src/`)**: The main application component. It sets up the primary routing structure using `react-router-dom` and wraps the application with global context providers (like `AuthProvider`).
*   **`main.jsx` (in `src/`)**: The entry point of the React application. It renders the `App` component into the DOM and imports global stylesheets (`main.scss`).

**2.3. Entry Point and Main Application Component**

*   **`src/main.jsx`:**
    *   This is the JavaScript entry point for the Vite build.
    *   It uses `ReactDOM.createRoot()` to render the application.
    *   It wraps the `<App />` component with `<React.StrictMode>`, `<BrowserRouter>` (from `react-router-dom`), and the global `<AuthProvider>`.
    *   Crucially, it imports the global stylesheet: `import './assets/styles/main.scss';`.

    ```javascript
    // src/main.jsx (Illustrative)
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import { BrowserRouter } from 'react-router-dom';
    import App from './App';
    import { AuthProvider } from './contexts/AuthContext';
    import './assets/styles/main.scss'; // Global styles entry point

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
    ```

*   **`src/App.jsx`:**
    *   Defines the application's routing hierarchy using `<Routes>` and `<Route>` components from `react-router-dom`.
    *   Implements protected routes for client and admin sections using custom wrapper components (`ClientProtectedRoute`, `AdminProtectedRoute`) that leverage the `AuthContext`.
    *   Uses layout components (`ClientLayout`, `AdminLayout`) to provide consistent structure for different parts of the application.
    *   Handles redirection logic based on authentication status and user roles.

This structure aims for a balance between feature-based organization and type-based organization (e.g., all API services in `api/`), promoting maintainability and scalability.