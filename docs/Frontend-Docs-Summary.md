**BQOMIS Frontend Documentation**

**Part I: BQOMIS Frontend Documentation - Overview**

`I.1. Introduction & Purpose`
`I.2. Project Setup & Structure`
`I.3.1. Core Concepts - Routing`
`I.3.2. Core Concepts - Authentication & Authorization`
`I.3.3. Core Concepts - Styling & Theming`
`I.3.4. Core Concepts - API Interaction`
`I.3.5. Core Concepts - State Management`
`I.3.6. Core Concepts - Common Reusable Components`

**Part II: Client Application Features**
`II.1. Client Features - Authentication (Sign In, Sign Up)`
`II.2. Client Features - Home Page`
`II.3. Client Features - Branch & Service Discovery`
`II.4. Client Features - Appointment Booking`
`II.5. Client Features - My Appointments Page`
`II.6. Client Features - My Profile Page`

**Part III: Admin Application Features**
`III.1. Admin Features - Core Admin Layout`
`III.2. Admin Features - Branch Management`
`III.3. Admin Features - Service Management`
`III.4. Admin Features - Branch-Service Relationships`
`III.5. Admin Features - User Management`
`III.6. Admin Features - Appointment Management`
`III.7. Admin Features - Analytics Dashboard`
`III.8. Admin Features - Settings Page`

**Part IV: Appendix**
`IV.1. Appendix - API Endpoint Summary`
`IV.2. Appendix - Key SCSS Variables Overview`
`IV.3. Appendix - Potential Future Enhancements`

---

## I. BQOMIS Frontend Documentation - Overview

### 1. Introduction & Purpose

**Introduction**

The Bank Queue Optimizing Management Information System (BQOMIS) Frontend is a responsive React web application (using Vite and SCSS) serving clients and administrative staff. It interacts with BQOMIS backend services.

**Purpose**

To digitize and optimize bank queue management.

- **Clients:** Discover branches/services, view queue traffic, book/manage appointments, manage profiles.
- **Admins:** Manage districts, branches, services, branch-service links, users, appointments. Access analytics, configure settings, use developer tools.

The frontend consumes RESTful APIs from the BQOMIS Backend, with separate interfaces for client and admin roles.

**Key Technologies:** React, Vite, JavaScript (ES6+), SCSS, React Router DOM, Recharts, Fetch API.

### 2. Project Setup & Structure

**2.1. Development Environment Setup**

1.  **Prerequisites:** Node.js (16.x+), npm/yarn.
2.  **Create Project (if new):** `npm create vite@latest bqomis-frontend -- --template react-swc`
3.  **Install Dependencies:** `npm install` (then `npm install react-router-dom sass recharts`)
4.  **Environment Variables:** Create `.env` with `VITE_API_BASE_URL=http://localhost:8080/api`.
5.  **Run Dev Server:** `npm run dev`.

**2.2. High-Level Folder Structure (`src`)**

```
src/
├── api/                     # API call functions
├── assets/                  # Static assets, global SCSS (_variables.scss, main.scss)
├── components/              # Reusable UI (common/, layout/)
├── contexts/                # React Context (AuthContext.jsx)
├── features/                # Feature-specific components/logic (admin/, client/)
├── hooks/                   # Custom global hooks
├── pages/                   # Top-level page components (admin/, client/, shared)
├── routes/                  # Route definitions (currently in App.jsx)
└── utils/                   # Utility functions
```

- **`api/`**: Modules for backend HTTP requests.
- **`assets/styles/`**: Global SCSS (`_variables.scss` for theming, `main.scss` for global styles).
- **`components/common/`**: Generic UI (Modal, ConfirmationDialog).
- **`components/layout/`**: Structural components (AdminLayout, ClientLayout, TopNav, SidebarNav, Footer).
- **`contexts/`**: Global state management (e.g., `AuthContext.jsx` for authentication).
- **`features/`**: Feature-specific logic/UI.
- **`pages/`**: Route-mapped page components.
- **`App.jsx`**: Main app component, routing structure, global context providers.
- **`main.jsx`**: React app entry point, renders `App`, imports global styles.

**2.3. Entry Point and Main Application Component**

- **`src/main.jsx`:** Renders `<App />` within `<BrowserRouter>` and `<AuthProvider>`. Imports `main.scss`.
- **`src/App.jsx`:** Defines routing with `react-router-dom`. Implements protected routes (`ClientProtectedRoute`, `AdminProtectedRoute`) using `AuthContext`. Uses layout components.

### I.3. Core Concepts / Cross-Cutting Concerns

#### I.3.1. Routing

Managed by `react-router-dom` (v6.x) for SPA navigation.

- **Setup:** `<BrowserRouter>` in `main.jsx` wraps `<App />`. Routes defined in `App.jsx` using `<Routes>` and `<Route path=".." element={...} />`.
- **Layout Routes & `Outlet`:** Parent routes define layouts (e.g., `<ClientLayout />`), which use `<Outlet />` to render child route components.
- **Protected Routes:** Custom components (`AdminProtectedRoute`, `ClientProtectedRoute`) use `AuthContext` to check auth/role, redirecting to `/signin` if unauthorized, otherwise rendering `<Outlet />`.
- **Navigation:** `<Link>` and `<NavLink>` for declarative navigation. `useNavigate()` hook for programmatic navigation. `<Navigate>` component for route-based redirection.
- **Index Routes:** Default child routes for a parent path (e.g., `/admin` defaults to `/admin/dashboard`).
- **Not Found Route:** `path="*"` renders a `NotFoundPage.jsx`.

#### I.3.2. Authentication & Authorization

Token-based authentication (JWT) with role-based access control (RBAC).

- **Authentication Flow:**
  1.  **Login (`SignInPage.jsx`):** Credentials sent to backend. On success, backend returns JWT and user info.
  2.  **Token Storage:** JWT and user info stored in `localStorage` and `AuthContext`.
  3.  **Authenticated Requests:** JWT included in `Authorization: Bearer <token>` header.
  4.  **Logout:** Clears token/user info from `localStorage` and `AuthContext`, redirects to sign-in.
- **`AuthContext.jsx`:**
  - Manages global auth state: `user`, `token`, `isAuthenticated`, `isAdmin`, `isClient`, `loading`.
  - Provides `login()`, `logout()`, `refreshUserContext()` functions.
  - Initializes from `localStorage`.
- **Authorization (RBAC):**
  1.  **Protected Routes:** In `App.jsx`, guard admin/client sections.
  2.  **Conditional UI Rendering:** Show/hide elements based on `user.role`.
  3.  **Backend Enforcement:** Backend APIs must validate JWT and user permissions.
- **Client Sign-Up (`SignUpPage.jsx`):** Collects details, `POST /api/users` with `role: "CLIENT"`. Redirects to sign-in.

#### I.3.3. Styling & Theming

SCSS (Sassy CSS) for organized, maintainable styling. Global theming via SCSS variables.

- **SCSS:** Enables variables, nesting, partials (`_variables.scss`), mixins. Vite handles compilation.
- **Global Theming (`_variables.scss`):**
  - Central file in `src/assets/styles/` for design tokens: color palette (primary, neutral, semantic), typography, spacing, border-radius.
  - Ensures visual consistency and easy theme changes.
- **Global Stylesheet (`main.scss`):**
  - Imports `_variables.scss` (e.g., `@use "variables" as *;`).
  - Applies global resets, base styles for HTML elements (`body`, `a`, headings).
  - Imported once in `src/main.jsx`.
- **Component-Specific Styles:**
  - Components can have dedicated SCSS files (e.g., `MyComponent.scss`) that use global variables.

#### I.3.4. API Interaction

Frontend communicates with the backend via RESTful API calls.

- **API Service Modules (`src/api/`)**: Centralize API call logic (e.g., `userService.js`).
- **Base URL:** Configured via `VITE_API_BASE_URL` in `.env`.
- **HTTP Requests:** Uses browser's `fetch` API (`GET`, `POST`, `PUT`, `DELETE`).
- **Headers:** `Content-Type: application/json` for requests with body. `Authorization: Bearer <token>` for protected endpoints (token from `AuthContext`).
- **Request Body:** JavaScript objects converted to JSON using `JSON.stringify()`.
- **Response Handling (`handleResponse` utility):**
  - Checks `response.ok`. Throws error for non-2xx responses (parses backend error message if possible).
  - Parses JSON for successful responses or handles `204 No Content`.
- **Asynchronous Operations:** `async/await` used extensively. Components use `try...catch` for error handling.

#### I.3.5. State Management

Relies on React's built-in mechanisms:

- **Local Component State (`useState`, `useReducer`):**
  - `useState`: For UI state (form inputs, modal visibility, loading indicators) local to components.
  - `useReducer`: For more complex local state logic (less used in current examples).
- **Global/Shared State (React Context API):**
  - `AuthContext.jsx`: Primary example, manages auth user, token, status, login/logout functions. Uses `createContext`, `<AuthProvider>`, and `useAuth()` hook.
- **Server State Management:**
  - Data fetched from API typically stored in local component state (`useState`).
  - `useEffect` fetches data on mount/dependency change. `useCallback` memoizes fetch functions.
  - **Future:** Libraries like React Query (TanStack Query) or SWR could be used for advanced caching and server state synchronization.
- **Prop Drilling vs. Context:** Props for direct parent-child. Context for global or deeply shared state.

#### I.3.6. Common Reusable Components

Promote consistency, reduce duplication, streamline development.

- **Layout Components (`src/components/layout/`):**
  - `AdminLayout.jsx`, `ClientLayout.jsx`: Define page structure for admin/client sections. Include TopNav, SidebarNav, Footer. Use `<Outlet />`.
  - `TopNav.jsx`: App title, user info/sign-out.
  - `SidebarNav.jsx`: Vertical navigation menu, takes `navigationItems` prop. Uses `<NavLink>`.
  - `Footer.jsx`: Copyright info.
- **Common UI Elements (`src/components/common/`):**
  - `Modal.jsx`: Generic modal dialog (props: `isOpen`, `onClose`, `title`, `children`). Used for forms, detail views.
  - `ConfirmationDialog.jsx`: Specialized modal for user confirmations (delete actions). Props: `isOpen`, `onClose`, `onConfirm`, `title`, `message`.
  - Buttons, Inputs are styled globally via SCSS for consistency.
- **Feature-Specific Reusable Components (e.g., `src/features/client/common/`):**
  - `HourChunkStatus.jsx`: Displays 8-chunk hourly traffic visualizer.
  - Forms like `BranchForm.jsx`, `ServiceForm.jsx`, `UserForm.jsx` are reusable for create/edit modes within modals.

---

## II. Client Application Features

### 1. Authentication (`SignInPage.jsx`, `SignUpPage.jsx`)

- **Sign In (`/signin`):** Allows existing users to log in. Uses `AuthContext.login()`. Redirects to admin/client dashboard or intended route.
- **Sign Up (`/signup`):** Allows new users to register for a "CLIENT" account. `POST /api/users` with `role: "CLIENT"`. Redirects to sign-in.
  _(Detailed logic covered in I.3.2. Core Concepts - Authentication & Authorization)_

### 2. Home Page (`ClientHomePage.jsx`)

- **Route:** `/client/home` (Protected). Landing page post-login.
- **UI/Workflow:**
  - Personalized greeting (username from `AuthContext`).
  - **Upcoming Appointment Summary:** Displays next "SCHEDULED" or "ACTIVE" appointment (service, branch, date, time, status). Fetches via `getAppointmentsByUserId`, filters/sorts client-side. Links to "My Appointments". Shows "No upcoming appointments" if none.
  - **Quick Actions:** Links/cards for "Book New Appointment" (to `/client/branches`), "My Appointments," "My Profile."
- **State:** `nextUpcomingAppointment`, `isLoadingAppointment`, `appointmentError`.

### 3. Branch & Service Discovery (`ClientFindBranchPage.jsx`)

- **Route:** `/client/branches` (Protected). For finding branches, services, and viewing queue traffic.
- **UI/Workflow:**
  1.  **Progressive Selection:** Province -> District -> Branch. Breadcrumbs for navigation.
  2.  **Data Fetching:** `GET /api/districts` (for province/district lists), `GET /api/branches/district/{districtName}`.
  3.  **View Services & Traffic (on branch select):**
      - Fetches services for selected branch (`GET /branch-services/branch/{branchId}`).
      - Fetches today's appointments for the branch (`GET /appointments/today/branch/{branchId}`).
      - **Client-side Traffic Calculation:** For each service, counts appointments per hour, compares to thresholds (`QUEUE_THRESHOLDS.LOW`, `.MODERATE`) to generate 9 hourly status strings ("green", "yellow", "red").
      - `HourChunkStatus.jsx` visualizes this hourly traffic.
      - "Book this Service" button navigates to `/client/book-appointment` with `branch` and `service` (including `branchServiceId`) in `location.state`.
- **State:** `currentStep`, `allDistrictsData`, `selectedProvince/District/Branch`, `servicesWithTraffic`.

### 4. Appointment Booking (`ClientBookAppointmentPage.jsx`)

- **Route:** `/client/book-appointment` (Protected). Finalizes booking.
- **Prerequisites:** Expects `branch` and `service` (with `service.branchServiceId`) from `location.state`.
- **UI/Workflow:**
  - Booking summary (branch, service name).
  - **Date Selection:** `<input type="date">`.
  - **Time Slot Selection:** On date change, fetches existing appointments (`GET /api/appointments?date=...&branchServiceId=...`).
    - Client-side generates potential slots, filters out booked and past slots. Displays available slots as buttons.
  - **Confirm Appointment:**
    - `POST /api/appointments` with `{ userId, branchServiceId, date, time, status: "SCHEDULED" }`.
    - On success, shows message, refreshes slots.
- **State:** `branch`, `service`, `selectedDate`, `selectedTime`, `availableTimeSlots`, `isLoadingTimeSlots`.

### 5. My Appointments Page (`ClientMyAppointmentsPage.jsx`)

- **Route:** `/client/appointments` (Protected). View and manage appointments.
- **UI/Workflow:**
  - **Sections:** "Upcoming Appointments" and "Past Appointments" (based on date and status: SCHEDULED, ACTIVE, COMPLETED, CANCELLED, NO_SHOW).
  - **Appointment Card:** Shows Service Name, Branch Name, Date, Time, Status (with visual badge). Data from enhanced `Appointment` DTO.
  - **Cancellation:** "Cancel Appointment" button for "SCHEDULED" upcoming appointments. Uses `ConfirmationDialog`. `DELETE /api/appointments/{id}`. Refreshes list.
- **Data Fetching:** `GET /api/appointments/user/{userId}`. Appointments sorted/filtered client-side.
- **State:** `userAppointments`, `isLoading`, `error`, cancellation modal states.

### 6. My Profile Page (`ClientProfilePage.jsx`)

- **Route:** `/client/profile` (Protected). Manage personal info and security.
- **UI/Workflow:**
  - **User Information:** Displays username (editable), email (read-only), phone number (editable), role (read-only). "Edit Profile" toggles edit mode.
  - **Saving Changes:** `PATCH /api/users/{id}` with updated username/phone. Calls `refreshUserContext()` from `AuthContext`.
  - **Security Section:**
    - **Change Password:** Button opens modal with "Current," "New," "Confirm New" password fields. `POST /api/users/change-password`. On success, auto-logout and redirect to sign-in.
    - **Delete Account:** Placeholder button with confirmation. (Full API not implemented).
  - **Quick Links:** To "My Appointments," "Book New Appointment."
- **State:** `isEditMode`, `formData` (profile), `passwordData`, modal visibility states.
- **Context:** `useAuth()` for `user`, `token`, `logout`, `refreshUserContext`.

---

## III. Admin Application Features

### 1. Core Admin Layout (`AdminLayout.jsx`, `TopNav.jsx`, `SidebarNav.jsx`, `Footer.jsx`)

- **Purpose:** Consistent structure for all admin pages (`/admin/*`).
- **Components:**
  - `AdminLayout.jsx`: Orchestrates `TopNav`, `SidebarNav`, main content (`<Outlet />`), `Footer`. Defines `adminNavItems`.
  - `TopNav.jsx`: App title, admin user greeting, "Sign Out" button.
  - `SidebarNav.jsx`: Admin profile info, navigation links from `adminNavItems` (using `<NavLink>`).
  - `Footer.jsx`: Copyright.
- **Routing:** `AdminLayout` used as parent route element in `App.jsx` for admin section.

### 2. Branch Management (`AdminBranchManagementPage.jsx`, `BranchForm.jsx`)

- **Route:** `/admin/branches` (Admin Protected). CRUD for bank branches.
- **`AdminBranchManagementPage.jsx`:**
  - UI: Header with "Create New Branch" button. Table listing branches (Name, Address, District, Province, Actions).
  - Actions: "Edit" (opens `BranchForm` pre-filled), "Delete" (uses `ConfirmationDialog`).
  - Data: `GET /api/branches`, `GET /api/districts` (for form dropdown).
- **`BranchForm.jsx` (in Modal):**
  - Mode: "create" or "edit".
  - Fields: Branch Name, Address, District (select), Province (auto-filled).
  - Submission: `POST /api/branches` (create). `PUT /api/branches/{id}` (edit - planned).
- **State:** `branches`, `districts`, modal states, `selectedBranch`, `formMode`.

### 3. Service Management (`AdminServiceManagementPage.jsx`, `ServiceForm.jsx`)

- **Route:** `/admin/services` (Admin Protected). CRUD for banking services.
- **`AdminServiceManagementPage.jsx`:**
  - UI: Header with "Create New Service". Table of services (ID, Name, Description, Actions).
  - Actions: "Edit" (opens `ServiceForm` pre-filled), "Delete" (with confirmation).
  - Data: `GET /api/services`.
- **`ServiceForm.jsx` (in Modal):**
  - Mode: "create" or "edit".
  - Fields: Service Name, Description.
  - Submission: `POST /api/services` (create). `PUT /api/services/{id}` (edit - planned).
- **State:** `services`, modal states, `selectedService`, `formMode`.

### 4. Branch-Service Relationships (`AdminBranchServiceManagementPage.jsx`)

- **Route:** `/admin/branch-services` (Admin Protected). Links services to branches.
- **UI/Workflow:**
  - Branch selector dropdown (`GET /api/branches`).
  - Once branch selected:
    - **Assigned Services list:** Services offered by the branch (`GET /branch-services/branch/{branchId}`). Each has a "Remove" button.
    - **Available Services to Add list:** All system services (`GET /api/services`) not yet assigned to this branch. Each has an "Add" button.
  - **Actions:**
    - Add: `POST /api/branch-services` with `{ branchId, serviceIdToAdd }`.
    - Remove: `DELETE /api/branch-services/{branchServiceRelationshipId}`.
    - Lists refresh on action.
- **State:** `branches`, `allServices`, `selectedBranchId`, `assignedServices`, `availableServicesToAdd`.

### 5. User Management (`AdminUserManagementPage.jsx`, `UserForm.jsx`)

- **Route:** `/admin/users` (Admin Protected). Manages STAFF and ADMIN users.
- **`AdminUserManagementPage.jsx`:**
  - UI: Header with "Create New User". Table of STAFF/ADMIN users (ID, Username, Email, Phone, Role, Actions).
  - Actions: "Edit" (opens `UserForm`), "Delete" (with confirmation; cannot delete self).
  - Data: `GET /api/users?roles=STAFF,ADMIN`, `GET /api/roles` (for form dropdown).
- **`UserForm.jsx` (in Modal):**
  - Mode: "create" or "edit".
  - Fields: Username, Email (read-only in edit), Temporary Password (create mode), Phone Number, Role (select: STAFF/ADMIN).
  - Submission: `POST /api/users` (create), `PATCH /api/users/{id}` (edit).
- **State:** `users`, `roles`, modal states, `selectedUser`, `formMode`.

### 6. Appointment Management (`AdminAppointmentManagementPage.jsx`)

- **Route:** `/admin/appointments-management` (Admin Protected). View and manage all system appointments.
- **UI/Workflow:**
  - Filters: Date Range, District, Branch, Service, Status. "Apply Filters" button.
  - Appointments Table: Lists filtered appointments (ID, Date, Time, Service Name, Branch Name, Client User ID, Status, Actions). Uses enhanced `Appointment` DTO.
  - **Actions per row:**
    - "Details": Opens modal with full appointment info.
    - "Status" / "Update Status": Opens modal to change status (`PUT /api/appointments/{id}/status`).
    - "Cancel": Opens confirmation, then `DELETE /api/appointments/{id}`.
- **Data Fetching:** `GET /api/branches`, `/services`, `/districts` for filters. `getFilteredAppointments` for main list.
- **State:** `appointments`, `filters`, filter options data, modal states, `selectedAppointment`.

### 7. Analytics Dashboard (`AdminDashboardPage.jsx`)

- **Route:** `/admin/dashboard` (Admin Protected). Visual overview of KPIs. Uses Recharts.
- **UI/Workflow:**
  - Global Filters: Period Selector (e.g., "Last 7 Days").
  - Dashboard Grid of Chart Cards:
    - **Overall Peak Times:** Line chart (Appointments vs. Hour/DayOfWeek). `groupBy` selectable. API: `/analytics/peak-times`.
    - **Branch Performance:** Bar chart (Appointments by status: Completed, Cancelled, No-Show vs. Service) for a selected branch. API: `/analytics/appointments-by-branch`.
    - **Service Performance by District:** Pie chart (Status breakdown) for a selected service in a selected district. API: `/analytics/appointments-by-service`.
    - **Peak Times by District:** Line chart (similar to overall, but for selected district). API: `/analytics/peak-times-by-district`.
  - Data for dropdowns (branches, districts, services) fetched.
  - All analytics API calls made concurrently (e.g., via `Promise.allSettled`).
- **State:** Filter states, data states for each chart (`branchAnalytics`, etc.), dropdown options data.

### 8. Settings Page (`AdminSettingsPage.jsx`)

- **Route:** `/admin/settings` (Admin Protected). Configure system/branch operational parameters.
- **UI/Workflow:**
  - **Global Default Settings Section:** Form for system-wide defaults (Booking Window, Queue Thresholds, Slot Duration, Maintenance Mode, etc.). "Save Global Settings" button (`PUT /api/settings/global`).
  - **Branch-Specific Setting Overrides Section:**
    - Branch selector (`GET /api/branches`).
    - Override form (for selected branch): Fields for overridable settings. Placeholders show global defaults; effective values displayed. Clear input to revert to global. "Save Branch Settings" button (`PUT /api/branches/{branchId}/settings`).
- **Data Fetching:** `GET /api/settings/global`. On branch select: `GET /api/branches/{branchId}/settings`.
- **State:** `globalSettings`, `branches`, `selectedBranchIdForSettings`, `branchSpecificSettings`, `effectiveBranchSettings`.

---

## IV. Appendix

### 1. API Endpoint Summary

(Prefix: `VITE_API_BASE_URL`)

- **Users & Roles:**
  - `GET /users` (Optional: `?roles=STAFF,ADMIN` or `?role=TESTER`): List users.
  - `GET /users/{id}`: Get user by ID.
  - `POST /users`: Create user (client signup or admin create staff/admin).
  - `PATCH /users/{id}`: Update user (admin edit staff/admin, client profile update).
  - `DELETE /users/{id}`: Delete user.
  - `POST /users/change-password`: Client changes own password.
  - `GET /roles`: List all roles.
- **Districts, Branches, Services:**
  - `GET /districts`: List all districts.
  - `GET /branches`: List all branches.
  - `GET /branches/district/{districtName}`: List branches in a district.
  - `POST /branches`: Create branch.
  - `DELETE /branches/{id}`: Delete branch.
  - `GET /services`: List all services.
  - `POST /services`: Create service.
  - `DELETE /services/{id}`: Delete service.
- **Branch-Service Relationships:**
  - `GET /branch-services/branch/{branchId}`: List services for a branch.
  - `POST /branch-services`: Link a service to a branch.
  - `DELETE /branch-services/{id}`: Unlink service from branch (by relationship ID).
- **Appointments:**
  - `GET /appointments` (with filters like `dateFrom`, `branchId`, `status`): List appointments (admin).
  - `GET /appointments/user/{userId}`: List appointments for a user (client).
  - `GET /appointments?date=YYYY-MM-DD&branchServiceId=X`: Get appointments for slot checking (client booking).
  - `GET /appointments/today/branch/{branchId}`: Today's appointments for a branch (client traffic view).
  - `POST /appointments`: Create appointment.
  - `POST /appointments/batch`: Batch create appointments (dev tools).
  - `PUT /appointments/{id}/status`: Update appointment status.
  - `DELETE /appointments/{id}`: Cancel/delete appointment.
- **Analytics:**
  - `GET /analytics/appointments-by-branch?branchId=...&period=...`
  - `GET /analytics/appointments-by-service?district=...&serviceId=...&period=...`
  - `GET /analytics/peak-times?period=...&groupBy=...`
  - `GET /analytics/peak-times-by-district?district=...&period=...&groupBy=...`
- **Settings:**
  - `GET /settings/global`: Get global settings.
  - `PUT /settings/global`: Update global settings.
  - `GET /branches/{branchId}/settings`: Get branch-specific settings.
  - `PUT /branches/{branchId}/settings`: Update branch-specific settings.

### 2. Key SCSS Variables Overview (`_variables.scss`)

Located in `src/assets/styles/_variables.scss`, defines design tokens for consistency.

- **Color Palette:**
  - Primary: `$primary-color: #646cff;`
  - Neutral/Grayscale: `$neutral-darker: #242424;` (bg), `$neutral-lightest: #f0f0f0;` (text).
  - Semantic: `$success-color: #28a745;`, `$error-color: #dc3545;`
- **UI Element Color Mappings:**
  - Backgrounds: `$bg-primary`, `$bg-secondary`.
  - Text: `$text-primary`, `$text-link`.
  - Borders: `$border-color`.
- **Typography:** `$font-family-sans-serif`, `$font-size-base`.
- **Spacing Units:** `$spacing-sm: 8px;`, `$spacing-md: 16px;`
- **Borders & Shadows:** `$border-radius-md: 8px;`

Variables are globally available in SCSS files after `main.scss` imports `_variables.scss`.

### 3. Potential Future Enhancements

**A. Client-Facing:**

- Real-time queue updates/notifications (WebSockets/SSE).
- Profile picture upload.
- Service ratings/feedback.
- Dedicated branch details page (map, hours).
- Advanced "My Appointments" search/filtering.
- Multi-language support (i18n).
- Accessibility (WCAG) audit & improvements.
- PWA features.
- Passwordless login options.

**B. Admin-Facing:**

- Complete "Update" for Branch/Service/User Management.
- Advanced User Management (password resets, activate/deactivate, audit logs).
- Advanced Appointment Management (rescheduling, bulk actions).
- Enhanced Analytics (export, custom dashboards, alerts).
- Branch operating hours management.
- Resource/Staff management (basic).
- Customizable email/notification templates.
- Admin action audit trail.

**C. Technical & Architectural:**

- Data fetching/caching library (React Query/SWR).
- Review global state management if complexity grows (Zustand/Recoil).
- Comprehensive unit/integration testing (Jest, RTL).
- End-to-end testing (Cypress/Playwright).
- Further code splitting/performance optimization.
- Storybook for UI component development.
- CI/CD pipelines.
