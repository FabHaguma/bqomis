
## III. Admin Application Features

The admin application provides a suite of tools for managing the BQOMIS system, its data, and its users (primarily staff and other administrators). A consistent layout is applied across all admin-facing pages to ensure a familiar and efficient user experience.

### 1. Core Admin Layout (`AdminLayout.jsx`, `TopNav.jsx`, `SidebarNav.jsx`, `Footer.jsx`)

*   **Purpose:** The core admin layout components define the persistent structural elements of the admin interface, including the top navigation bar, a side navigation menu, and a footer. This structure frames the main content area where specific admin feature pages are rendered.
*   **Accessibility:** All routes under `/admin/*` are wrapped by the `AdminLayout` (nested within an `AdminProtectedRoute` for authentication and role checking).

*   **Key Components:**

    1.  **`AdminLayout.jsx` (`src/components/layout/AdminLayout.jsx`):**
        *   This is the top-level layout component for the entire admin section.
        *   It orchestrates the arrangement of `TopNav`, `SidebarNav`, the main content area (`<Outlet />`), and `Footer`.
        *   **Structure:**
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
        *   It defines the `adminNavItems` array (or imports it), which contains the configuration (paths, labels, icons) for the links displayed in the `SidebarNav`.

    2.  **`TopNav.jsx` (`src/components/layout/TopNav.jsx`):**
        *   A reusable component shared with the `ClientLayout` but styled and behaving consistently.
        *   **Displays:**
            *   Application Title: "BQOMIS" (typically centered or left-aligned).
            *   User Actions (right-aligned):
                *   If an admin is authenticated (checked via `useAuth()`):
                    *   Displays a greeting (e.g., "Hi, [Admin Username]").
                    *   A "Sign Out" button, which triggers the `logout()` function from `AuthContext` and redirects to `/signin`.
        *   It's fixed at the top of the viewport for admin pages.

    3.  **`SidebarNav.jsx` (`src/components/layout/SidebarNav.jsx`):**
        *   A reusable vertical navigation menu displayed on the left side of the admin interface.
        *   **Props:**
            *   `navigationItems`: An array of objects, where each object defines a navigation link (e.g., `{ path: '/admin/dashboard', label: 'Dashboard', icon: '🏠' }`). This prop is supplied by `AdminLayout.jsx`.
        *   **Displays:**
            *   **Admin Profile Information (Placeholder/Basic):** At the top of the sidebar, it shows the logged-in admin's username and email (retrieved from `useAuth()`). A placeholder avatar (e.g., user's first initial) is also shown.
            *   **Navigation Links:** Renders a list of navigation links based on the `navigationItems` prop.
                *   Uses `<NavLink>` from `react-router-dom` to allow styling of the active link (e.g., different background color or text weight).
                *   Each link typically has an icon and a text label.
        *   **Example `adminNavItems` (defined in `AdminLayout.jsx`):**
            ```javascript
            const adminNavItems = [
              { path: '/admin/dashboard', label: 'Dashboard & Analytics', icon: '📊' },
              { path: '/admin/appointments-management', label: 'Appt. Management', icon: '📅' },
              { path: '/admin/branches', label: 'Branch Management', icon: '🏢' },
              { path: '/admin/services', label: 'Service Management', icon: '🛠️' },
              { path: '/admin/branch-services', label: 'Branch Services', icon: '🔗' },
              { path: '/admin/users', label: 'User Management', icon: '👥' },
              { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
              { path: '/admin/dev-data-tools', label: 'Dev Data Tools', icon: '🧪' },
            ];
            ```

    4.  **`Footer.jsx` (`src/components/layout/Footer.jsx`):**
        *   A reusable simple footer component.
        *   Typically displays copyright information or other static text (e.g., "&copy; [Year] BQOMIS. All rights reserved.").
        *   Fixed at the bottom or part of the main page flow.

*   **Routing Integration (`App.jsx`):**
    *   The `AdminLayout` is used as the `element` for a parent route that encompasses all specific admin page routes.
        ```javascript
        // src/App.jsx (Simplified admin routing section)
        // ...
        <Route path="/admin" element={<AdminProtectedRoute />}> {/* Auth & Role check */}
          <Route element={<AdminLayout />}> {/* Apply AdminLayout to all children */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="branches" element={<AdminBranchManagementPage />} />
            {/* ... other admin page routes ... */}
          </Route>
        </Route>
        // ...
        ```
    *   The `<Outlet />` component within `AdminLayout.jsx` is where the `element` of the matched child route (e.g., `<AdminDashboardPage />`) will be rendered.

*   **Styling:**
    *   Each layout component (`AdminLayout.scss`, `TopNav.scss`, `SidebarNav.scss`, `Footer.scss`) has its own SCSS file defining its specific styles, colors, and layout (e.g., flexbox or grid for arranging sidebar and content).
    *   These styles leverage the global SCSS variables from `_variables.scss` for consistency (e.g., background colors, text colors, spacing).

This core admin layout provides a consistent and professional framework for all administrative functionalities, making it easy for admins to navigate and manage the BQOMIS system. The reusability of `TopNav`, `SidebarNav`, and `Footer` (also used in `ClientLayout`) demonstrates efficient component design.