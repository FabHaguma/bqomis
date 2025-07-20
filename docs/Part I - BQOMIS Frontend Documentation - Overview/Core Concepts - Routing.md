
### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.1. Core Concepts - Routing

Client-side routing in the BQOMIS Frontend is managed by the `react-router-dom` library (version 6.x). This library enables navigation between different views or "pages" within the single-page application (SPA) without requiring a full page reload from the server.

**A. Setup and Configuration (`main.jsx` and `App.jsx`)**

1.  **`BrowserRouter` (`src/main.jsx`):**
    *   The entire application, starting from the `<App />` component, is wrapped with `<BrowserRouter>`. This component uses the HTML5 history API (pushState, replaceState, and the popstate event) to keep the UI in sync with the URL.

    ```javascript
    // src/main.jsx (Relevant part)
    import { BrowserRouter } from 'react-router-dom';
    import App from './App';
    // ... other imports ...

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <BrowserRouter>
          <AuthProvider> {/* AuthProvider wraps App */}
            <App />
          </AuthProvider>
        </BrowserRouter>
      </React.StrictMode>
    );
    ```

2.  **Route Definitions (`src/App.jsx`):**
    *   The main `<App />` component is responsible for defining the application's routes using the `<Routes>` and `<Route>` components.
    *   `<Routes>` acts as a container for a collection of `<Route>` elements.
    *   Each `<Route>` maps a URL path to a specific React component that should be rendered when the path matches.
        *   `path`: The URL path pattern (e.g., `/signin`, `/admin/dashboard`, `/client/branches`).
        *   `element`: The React component to render for that path.
        *   `index`: Used for default child routes within a nested route structure.

    ```javascript
    // src/App.jsx (Simplified structure)
    import React from 'react';
    import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
    import AdminLayout from './components/layout/AdminLayout';
    import ClientLayout from './components/layout/ClientLayout';
    import SignInPage from './pages/SignInPage';
    import AdminDashboardPage from './pages/admin/AdminDashboardPage';
    import ClientHomePage from './pages/client/ClientHomePage';
    // ... other page imports

    function App() {
      // ... (useAuth hook for protected routes) ...

      return (
        <Routes>
          {/* Public Routes */}
          <Route path="/signin" element={<SignInPage />} />
          {/* ... other public routes like /signup ... */}

          {/* Client Protected Routes with ClientLayout */}
          <Route path="/client" element={<ClientProtectedRoute />}> {/* Wrapper for auth check */}
            <Route element={<ClientLayout />}> {/* Layout for nested client routes */}
              <Route index element={<Navigate to="home" replace />} /> {/* Default /client to /client/home */}
              <Route path="home" element={<ClientHomePage />} />
              {/* ... other nested client routes ... */}
            </Route>
          </Route>

          {/* Admin Protected Routes with AdminLayout */}
          <Route path="/admin" element={<AdminProtectedRoute />}> {/* Wrapper for auth & role check */}
            <Route element={<AdminLayout />}> {/* Layout for nested admin routes */}
              <Route index element={<Navigate to="dashboard" replace />} /> {/* Default /admin to /admin/dashboard */}
              <Route path="dashboard" element={<AdminDashboardPage />} />
              {/* ... other nested admin routes ... */}
            </Route>
          </Route>
          
          <Route path="/" element={<Navigate to="/signin" replace />} /> {/* Default root to signin */}
          <Route path="*" element={<NotFoundPage />} /> {/* Catch-all for 404 */}
        </Routes>
      );
    }
    export default App;
    ```

**B. Key Routing Concepts Used**

1.  **Layout Routes & `Outlet`:**
    *   The application uses layout routes to provide a consistent structure (header, sidebar, footer) for different sections (Client and Admin).
    *   A parent `<Route>` defines the layout component in its `element` prop (e.g., `<Route element={<ClientLayout />}>`).
    *   Nested `<Route>` elements define the content specific to sub-paths.
    *   The layout component (`ClientLayout.jsx`, `AdminLayout.jsx`) uses the `<Outlet />` component from `react-router-dom`. The `<Outlet />` acts as a placeholder where the matched child route's component will be rendered.

    ```javascript
    // src/components/layout/ClientLayout.jsx (Illustrative)
    import { Outlet } from 'react-router-dom';
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
    *   Custom components like `AdminProtectedRoute` and `ClientProtectedRoute` are used to guard routes.
    *   These components use the `useAuth()` hook (from `AuthContext`) to check if the user is authenticated and (for admin routes) if they have the correct role.
    *   If the checks fail, the user is redirected to the `/signin` page using the `<Navigate to="/signin" replace />` component.
    *   If the checks pass, they render an `<Outlet />`, allowing the nested child routes to be rendered.

3.  **Navigation:**
    *   **`<Link>` Component:** Used for declarative navigation, similar to an `<a>` tag but for client-side routing. It prevents full page reloads.
        ```javascript
        import { Link } from 'react-router-dom';
        // <Link to="/client/appointments">My Appointments</Link>
        ```
    *   **`<NavLink>` Component:** A special version of `<Link>` that can apply an "active" class or style when its `to` prop matches the current URL. This is used in `SidebarNav.jsx` for highlighting the active menu item.
        ```javascript
        import { NavLink } from 'react-router-dom';
        // <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
        ```
    *   **`useNavigate` Hook:** Used for programmatic navigation (e.g., after a form submission or a successful login/logout).
        ```javascript
        import { useNavigate } from 'react-router-dom';
        const navigate = useNavigate();
        // navigate('/some-path');
        // navigate('/signin', { state: { from: location } }); // Pass state during navigation
        ```
    *   **`<Navigate>` Component:** Used for declarative redirection within the route configuration (e.g., redirecting from `/` to `/signin` or from `/admin` to `/admin/dashboard`).

4.  **Index Routes:**
    *   An `index` route is a child route that renders at the parent route's path when no other child route matches. For example, in the admin section, `/admin` defaults to showing the content of `/admin/dashboard`.
        ```javascript
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} /> {/* Default */}
          <Route path="dashboard" element={<AdminDashboardPage />} />
        </Route>
        ```

5.  **"Not Found" Route (404):**
    *   A catch-all route with `path="*"` is defined to render a `NotFoundPage.jsx` component when no other route matches the current URL.

This routing setup provides a clear and organized way to manage navigation and access control within the BQOMIS frontend application, separating concerns for public, client-only, and admin-only sections.