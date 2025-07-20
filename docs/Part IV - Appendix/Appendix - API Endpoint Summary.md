
## IV. Appendix

### 1. API Endpoint Summary

This section provides a summary of the backend API endpoints that the BQOMIS Frontend interacts with. All endpoints are assumed to be prefixed with the `VITE_API_BASE_URL` (e.g., `http://localhost:8080/api`). Authentication (via JWT Bearer token) is required for most admin endpoints and client-specific data endpoints.

**User Management (`UserController`)**

*   **`GET /users`**
    *   Description: Retrieves users. The frontend uses this with query parameters for specific roles.
    *   Frontend Usage:
        *   Admin User Management: `GET /users?roles=STAFF,ADMIN` (to list staff and admin users).
        *   Dev Data Tools: `GET /users?role=TESTER` (to fetch test users for data generation).
*   **`GET /users/{id}`**
    *   Description: Retrieves a specific user by ID.
    *   Frontend Usage:
        *   `AuthContext`: To refresh user details after profile updates.
*   **`POST /users`**
    *   Description: Creates a new user.
    *   Frontend Usage:
        *   Client Sign Up: Payload includes `{ username, email, phoneNumber, password, role: "CLIENT" }`.
        *   Admin User Management: Admin creates STAFF/ADMIN users, setting a temporary password. Payload includes role.
*   **`PATCH /users/{id}`** (Assumed, as `PUT` was also considered)
    *   Description: Updates specific fields of an existing user.
    *   Frontend Usage:
        *   Admin User Management: To update user's `username`, `phoneNumber`, `role`.
        *   Client Profile Page: To update `username`, `phoneNumber` (using `PUT` in earlier discussion, but `PATCH` is suitable for partial updates).
*   **`DELETE /users/{id}`**
    *   Description: Deletes a user by ID.
    *   Frontend Usage:
        *   Admin User Management: To delete STAFF/ADMIN users.
*   **`POST /users/change-password`**
    *   Description: Allows a user to change their password.
    *   Frontend Usage:
        *   Client Profile Page: Payload includes `{ email, oldPassword, newPassword }`.

**Role Management (`RoleController`)**

*   **`GET /roles`**
    *   Description: Retrieves all available roles.
    *   Frontend Usage:
        *   Admin User Management: To populate role selection dropdown when creating/editing users.

**District Management (`DistrictController`)**

*   **`GET /districts`**
    *   Description: Retrieves all districts (each includes province information).
    *   Frontend Usage:
        *   Client Branch & Service Discovery: To populate province and district selection.
        *   Admin Branch Management (`BranchForm`): To populate district selection.
        *   Admin Analytics Dashboard: To populate district filter dropdowns.
*   **`GET /districts/{provinceName}`** (Available, but frontend currently derives provinces from `GET /districts`)
    *   Description: Gets districts by province name.
*   **(Other `POST`, `DELETE` for districts are backend-managed, not directly used by current frontend admin forms).**

**Branch Management (`BranchController`)**

*   **`GET /branches`**
    *   Description: Gets all branches.
    *   Frontend Usage:
        *   Admin Branch Management: To list branches.
        *   Admin Settings Page: To populate branch selector for overrides.
        *   Admin Analytics Dashboard: To populate branch filter dropdowns.
*   **`GET /branches/district/{districtName}`**
    *   Description: Gets branches by district name.
    *   Frontend Usage:
        *   Client Branch & Service Discovery: To list branches after a district is selected.
*   **`POST /branches`**
    *   Description: Creates a new branch.
    *   Frontend Usage:
        *   Admin Branch Management (`BranchForm`): Payload includes `{ name, address, district (name), province (name) }`.
*   **`DELETE /branches/{id}`**
    *   Description: Deletes a branch by ID.
    *   Frontend Usage:
        *   Admin Branch Management.
*   **(`PUT /branches/{id}` for updates was discussed as a future refinement for Admin Branch Management).**

**Service Management (`ServiceController`)**

*   **`GET /services`**
    *   Description: Gets all available banking services.
    *   Frontend Usage:
        *   Admin Service Management: To list services.
        *   Admin Branch-Service Relationships: To list all system services.
        *   Admin Analytics Dashboard: To populate service filter dropdowns.
*   **`POST /services`**
    *   Description: Creates a new service.
    *   Frontend Usage:
        *   Admin Service Management (`ServiceForm`): Payload includes `{ name, description }`.
*   **`DELETE /services/{id}`**
    *   Description: Deletes a service by ID.
    *   Frontend Usage:
        *   Admin Service Management.
*   **(Backend endpoint `GET /services/branch/{branchId}` exists but frontend primarily uses `GET /branch-services/branch/{branchId}` for client view).**

**Branch-Service Relationship Management (`BranchServiceController` or `BranchLinkController`)**

*   **`GET /branch-services`**
    *   Description: Gets all branch-service relationships.
    *   Frontend Usage:
        *   Admin Branch-Service Relationships: To get a complete list of all `BranchService` links for initial data or if needed for complex views.
        *   Client My Appointments Page: (Previously used, now less critical due to enhanced `Appointment` DTO) To map `branchServiceId` to branch/service names.
*   **`GET /branch-services/branch/{branchId}`**
    *   Description: Gets services available at (linked to) a specific branch. Returns `BranchService` link objects.
    *   Frontend Usage:
        *   Client Branch & Service Discovery: To list services for a selected branch.
        *   Admin Branch-Service Relationships: To list services currently assigned to a selected branch.
*   **`POST /branch-services`**
    *   Description: Creates a new branch-service relationship.
    *   Frontend Usage:
        *   Admin Branch-Service Relationships: Payload typically `{ branchId, serviceId }`.
*   **`DELETE /branch-services/{id}`**
    *   Description: Deletes a branch-service relationship by its *own unique ID* (the ID of the link/row in the `BranchService` table).
    *   Frontend Usage:
        *   Admin Branch-Service Relationships.

**Appointment Management (`AppointmentController`)**

*   **`GET /appointments`**
    *   Description: Gets all appointments. Can be enhanced with query parameters for filtering.
    *   Frontend Usage:
        *   Admin Appointment Management (`getFilteredAppointments`): Used with various filters (`dateFrom`, `dateTo`, `branchId`, `serviceId`, `status`, `districtName`).
*   **`GET /appointments/{id}`**
    *   Description: Gets a specific appointment by ID.
    *   Frontend Usage:
        *   Admin Appointment Management (potentially for a detailed view modal).
*   **`GET /appointments/user/{userId}`**
    *   Description: Gets all appointments for a specific user. (Returns enhanced `Appointment` DTO with branch/service names).
    *   Frontend Usage:
        *   Client My Appointments Page.
        *   Client Home Page (to show next upcoming appointment).
*   **`GET /appointments?date=YYYY-MM-DD&branchServiceId=X`** (Used as a specific query on `/appointments`)
    *   Description: Gets appointments for a specific date and branch-service link.
    *   Frontend Usage:
        *   Client Appointment Booking: To determine available time slots.
*   **`GET /appointments/today/branch/{branchId}`**
    *   Description: Gets today's appointments at a specific branch.
    *   Frontend Usage:
        *   Client Branch & Service Discovery: To fetch all appointments for a branch today, then client-side filter per `branchServiceId` for traffic calculation.
*   **(Backend also has `/api/appointments/date/{date}` and `/api/appointments/today/district/{districtName}/service/{serviceId}`, which the frontend could use if more specific pre-filtered data is preferred over client-side processing in some cases).**
*   **`POST /api/appointments`**
    *   Description: Creates a new appointment.
    *   Frontend Usage:
        *   Client Appointment Booking: Payload `{ userId, branchServiceId, date, time, status: "SCHEDULED" }`.
*   **`POST /api/appointments/batch`**
    *   Description: Creates multiple appointments in a single request.
    *   Frontend Usage:
        *   Admin Dev Data Tools: Payload is an array of appointment objects.
*   **`PUT /api/appointments/{id}/status`**
    *   Description: Updates the status of an existing appointment.
    *   Frontend Usage:
        *   Admin Appointment Management: Payload `{ "status": "NEW_STATUS" }`.
*   **`DELETE /api/appointments/{id}`**
    *   Description: Deletes/Cancels an appointment by ID.
    *   Frontend Usage:
        *   Client My Appointments Page (client cancels own appointment).
        *   Admin Appointment Management (admin cancels any appointment).

**Analytics (`AnalyticsController`)**

*   **`GET /analytics/appointments-by-branch?branchId=...&period=YYYY-MM-DD_to_YYYY-MM-DD`**
*   **`GET /analytics/appointments-by-service?district=...&serviceId=...&period=...`**
*   **`GET /analytics/peak-times?period=...&groupBy=hour|dayOfWeek`**
*   **`GET /analytics/peak-times-by-district?district=...&period=...&groupBy=hour|dayOfWeek`**
    *   Description: These endpoints provide aggregated data for the admin analytics dashboard.
    *   Frontend Usage:
        *   Admin Dashboard Page: To populate various charts.

**Settings (`SettingsController`)**

*   **`GET /settings/global`**
    *   Description: Retrieves global application settings.
    *   Frontend Usage:
        *   Admin Settings Page.
*   **`PUT /settings/global`**
    *   Description: Updates global application settings.
    *   Frontend Usage:
        *   Admin Settings Page.
*   **`GET /branches/{branchId}/settings`**
    *   Description: Retrieves branch-specific setting overrides.
    *   Frontend Usage:
        *   Admin Settings Page.
*   **`PUT /branches/{branchId}/settings`**
    *   Description: Updates or creates branch-specific setting overrides.
    *   Frontend Usage:
        *   Admin Settings Page.

This summary covers the primary interactions between the BQOMIS frontend and backend based on the features developed. Specific query parameters and request/response payloads have been implemented as discussed during each feature's development.