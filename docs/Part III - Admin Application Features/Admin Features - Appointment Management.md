
### III.6. Admin Features - Appointment Management (`AdminAppointmentManagementPage.jsx`)

*   **Purpose:** This feature provides administrators with a comprehensive view of all appointments across the BQOMIS system. It allows them to search, filter, view details, update the status of appointments (e.g., mark as "CHECKED_IN", "COMPLETED", "NO_SHOW"), and cancel appointments if necessary. This serves as a central operational tool for overseeing appointment activities.
*   **Accessibility:** Accessed via a route like `/admin/appointments-management` (or similar), typically linked from "Appt. Management" in the admin sidebar. This route is protected and requires admin authentication.

*   **Key UI Elements & Workflow (`AdminAppointmentManagementPage.jsx`):**

    1.  **Page Header:**
        *   Displays the title "Appointment Management."

    2.  **Filters Container:**
        *   A dedicated section for filtering the list of appointments. Common filters include:
            *   **Date Range:** "Date From" and "Date To" date pickers.
            *   **District:** Dropdown populated with all districts (`GET /api/districts`).
            *   **Branch:** Dropdown populated with all branches (`GET /api/branches`). (Could be dynamically filtered by selected district if desired).
            *   **Service:** Dropdown populated with all services (`GET /api/services`).
            *   **Status:** Dropdown with predefined appointment statuses (e.g., "SCHEDULED", "CHECKED_IN", "COMPLETED", "CANCELLED", "NO_SHOW").
        *   An "Apply Filters" button to trigger fetching appointments based on the selected criteria.

    3.  **Appointments Table:**
        *   Displays a list of appointments matching the current filter criteria. Pagination would be necessary if the number of appointments can be large.
        *   **Columns typically include:**
            *   Appointment ID
            *   Date
            *   Time
            *   Service Name (available directly from the enhanced `Appointment` DTO)
            *   Branch Name (available directly from the enhanced `Appointment` DTO)
            *   Client User ID (or could be enhanced to show client username/email if user details are joined/fetched)
            *   Status (with a visual status badge)
            *   Actions
        *   If no appointments match, a relevant message is shown.

    4.  **Actions per Appointment Row:**
        *   **Details Button:** Opens a modal (`Modal.jsx`) displaying more comprehensive details of the selected appointment (all fields from the `Appointment` object).
        *   **Status Button (or "Update Status"):** Opens a modal allowing the admin to change the status of the appointment.
            *   The modal shows current appointment details and a dropdown with all possible statuses.
            *   Upon selecting a new status and confirming, an API call is made to `PUT /api/appointments/{id}/status` (via `updateAppointmentStatus` from `appointmentService.js`) with the payload `{ "status": "NEW_STATUS" }`.
            *   The appointment list is refreshed on success.
        *   **Cancel Button:**
            *   Visible for appointments that are cancellable (e.g., "SCHEDULED", "CHECKED_IN").
            *   Opens a `ConfirmationDialog.jsx`.
            *   Upon confirmation, an API call to `DELETE /api/appointments/{id}` (via `deleteAppointment` from `appointmentService.js`) is made.
            *   The list is refreshed on success.

    5.  **Data Fetching:**
        *   **Filter Options:** On component mount, fetches data for filter dropdowns:
            *   `GET /api/branches` (via `getAllBranches`)
            *   `GET /api/services` (via `getAllServices`)
            *   `GET /api/districts` (via `getAllDistricts`)
        *   **Appointments List:**
            *   Triggered by initial load or when filters are applied (or pagination changes).
            *   `GET /api/appointments` with query parameters based on the `filters` state (e.g., `?dateFrom=...&branchId=...&status=...`). This is handled by `getFilteredAppointments`.
            *   The `Appointment` DTOs returned by this endpoint are expected to include `branchName` and `serviceName` directly, simplifying display.
        *   Loading and error states are managed.

*   **Modals Used:**
    *   `Modal.jsx`: For displaying appointment details and for the update status form.
    *   `ConfirmationDialog.jsx`: For cancellation confirmations.

*   **State Management (`AdminAppointmentManagementPage.jsx`):**
    *   `appointments`: Array to store the fetched list of appointments.
    *   `isLoading`, `error`.
    *   `filters`: Object to hold current filter values.
    *   `branches`, `services`, `districts`: Arrays for populating filter dropdowns.
    *   `selectedAppointment`: Stores the appointment object for detail view, status update, or cancellation.
    *   `isDetailModalOpen`, `isStatusModalOpen`, `isCancelConfirmOpen`: Booleans for modal visibility.
    *   `newStatus`: String to hold the new status selected in the update status modal.

*   **API Service Functions Used (from `appointmentService.js`, `branchService.js`, etc.):**
    *   `getFilteredAppointments(filters, token)`
    *   `getAppointmentById(appointmentId, token)` (Potentially for a more detailed view if list data is minimal)
    *   `updateAppointmentStatus(appointmentId, status, token)`
    *   `deleteAppointment(appointmentId, token)`
    *   `getAllBranches(token)`
    *   `getAllServices(token)`
    *   `getAllDistricts(token)`

*   **Key Code Snippet (`AdminAppointmentManagementPage.jsx` - simplified structure):**
    ```javascript
    // src/pages/admin/AdminAppointmentManagementPage.jsx (Illustrative)
    import React, { useState, useEffect, useCallback } from 'react';
    import { useAuth } from '../../contexts/AuthContext';
    import { getFilteredAppointments, updateAppointmentStatus, deleteAppointment } from '../../api/appointmentService';
    // ... imports for branch, service, district services, Modal, ConfirmationDialog ...
    // import './AdminAppointmentManagementPage.scss';

    const APPOINTMENT_STATUSES = ["SCHEDULED", "CHECKED_IN", "COMPLETED", "CANCELLED", "NO_SHOW"];

    const AdminAppointmentManagementPage = () => {
      const [appointments, setAppointments] = useState([]);
      const [filters, setFilters] = useState({ /* ... initial filter values ... */ });
      // ... states for isLoading, error, filter options (branches, services, districts) ...
      // ... states for modals (isDetailModalOpen, isStatusModalOpen, etc.) and selectedAppointment ...
      const { token } = useAuth();

      // Fetch filter dropdown data (branches, services, districts)
      useEffect(() => { /* ... fetch filter data ... */ }, [token]);

      const fetchAppointments = useCallback(async () => {
        // ... setIsLoading, clear error ...
        try {
          const activeFilters = { /* ... construct active filters from state ... */ };
          const data = await getFilteredAppointments(activeFilters, token);
          setAppointments(Array.isArray(data) ? data : (data?.content || []));
        } catch (err) { /* ... setError ... */ }
        finally { /* ... setIsLoading(false) ... */ }
      }, [token, filters]);

      useEffect(() => { fetchAppointments(); }, [fetchAppointments]);
      
      // ... handlers: handleFilterChange, handleApplyFilters, handleViewDetails, 
      // handleOpenUpdateStatus, handleUpdateStatus, handleOpenCancel, confirmCancelAppointment ...

      return (
        <div className="admin-appointment-management-page">
          <header className="page-header"><h1>Appointment Management</h1></header>
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