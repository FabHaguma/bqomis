
### II.5. Client Features - My Appointments Page (`ClientMyAppointmentsPage.jsx`)

*   **Purpose:** The `ClientMyAppointmentsPage.jsx` allows authenticated clients to view a comprehensive list of their scheduled, past, and potentially active appointments. It provides details for each appointment and allows them to cancel upcoming scheduled appointments.
*   **Accessibility:** Accessible via the `/client/appointments` route, typically linked from the client home page or main client navigation. This route is protected and requires client authentication.

*   **Key UI Elements & Functionality:**

    1.  **Display Sections:**
        *   **Upcoming Appointments:** Lists appointments that are scheduled for the current day or a future date and have a status of "SCHEDULED" or "ACTIVE" (if an appointment can be active on the same day it's viewed). Sorted chronologically, earliest first.
        *   **Past Appointments:** Lists appointments that occurred on a previous date or have a terminal status (e.g., "COMPLETED", "CANCELLED", "NO_SHOW"). Sorted reverse chronologically, most recent past appointment first.

    2.  **Appointment Card Details:**
        *   Each appointment is typically displayed as a card or list item showing:
            *   **Service Name:** (e.g., "Account Opening," "Loan Consultation").
            *   **Branch Name:** (e.g., "Main Street Branch").
            *   **District Name:** (Often shown with the branch name, e.g., "Main Street Branch (Central District)").
            *   **Date:** Formatted nicely (e.g., "Monday, July 15, 2024").
            *   **Time:** (e.g., "10:30 AM").
            *   **Status:** Displayed prominently, often with a visual indicator or badge (e.g., "SCHEDULED", "COMPLETED", "CANCELLED"). Styles for these badges (`.status-scheduled`, `.status-completed`, etc.) provide quick visual cues.
        *   The `Appointment` DTO returned by `GET /api/appointments/user/{userId}` is expected to contain `branchName` and `serviceName` directly, simplifying data display.

    3.  **Appointment Cancellation:**
        *   For upcoming appointments with a "SCHEDULED" status, a "Cancel Appointment" button is displayed.
        *   Clicking this button opens a `ConfirmationDialog.jsx` to prevent accidental cancellations.
        *   Upon confirmation:
            *   An API call is made to `DELETE /api/appointments/{id}` (via `deleteAppointment` from `appointmentService.js`), where `{id}` is the ID of the appointment to be cancelled.
            *   On successful cancellation, the appointment list is refreshed, and the cancelled appointment should either disappear from "Upcoming" or move to "Past" with a "CANCELLED" status (depending on how the backend handles the status update upon deletion, or if the frontend filters it out).
            *   Error messages are displayed if cancellation fails.

    4.  **Data Fetching Logic:**
        *   On component mount (or when user/token changes):
            1.  `GET /api/appointments/user/{userId}` (via `getAppointmentsByUserId`): Fetches all appointments specifically for the logged-in user. These appointment objects are expected to include `branchName` and `serviceName`.
            2.  *(Previously, this page also fetched all `BranchService` relationships to map `branchServiceId` to names. This step is **no longer needed** due to the enhanced `Appointment` DTO from the backend.)*
        *   The fetched appointments are then processed client-side:
            *   Each appointment object already contains necessary display names.
            *   They are sorted and then filtered into "Upcoming" and "Past" arrays based on date and status.
        *   Loading and error states are managed during data fetching.

*   **State Management:**
    *   `userAppointments`: An array storing all fetched and processed appointment objects for the user.
    *   `isLoading`: Boolean for the main data loading state.
    *   `error`: Stores error messages.
    *   `isCancelConfirmOpen`: Boolean to control the visibility of the cancellation confirmation dialog.
    *   `appointmentToCancel`: Stores the appointment object selected for potential cancellation.

*   **User Experience:**
    *   Clear separation of upcoming and past appointments.
    *   Easy-to-understand status indicators.
    *   Safe cancellation process with confirmation.
    *   Informative loading and error messages.

*   **Key Code Snippet (`ClientMyAppointmentsPage.jsx` - illustrating data fetching and list rendering):**
    ```javascript
    // src/pages/client/ClientMyAppointmentsPage.jsx (Illustrative Structure)
    import React, { useState, useEffect, useCallback } from 'react';
    import { useAuth } from '../../contexts/AuthContext';
    import { getAppointmentsByUserId, deleteAppointment } from '../../api/appointmentService';
    import ConfirmationDialog from '../../components/common/ConfirmationDialog';
    // import './ClientMyAppointmentsPage.scss';

    const ClientMyAppointmentsPage = () => {
      const { user, token, isAuthenticated } = useAuth();
      const [userAppointments, setUserAppointments] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      const [error, setError] = useState(null);
      // ... state for cancellation modal ...

      const fetchData = useCallback(async () => {
        if (!isAuthenticated || !user?.id || !token) { /* ... handle not authenticated ... */ return; }
        setIsLoading(true); setError(null);
        try {
          const userAppointmentsData = await getAppointmentsByUserId(user.id, token);
          const processedAppointments = (userAppointmentsData || []).map(app => ({
            ...app,
            branchName: app.branchName || 'N/A', 
            serviceName: app.serviceName || 'N/A',
          })).sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
          setUserAppointments(processedAppointments);
        } catch (err) { setError(err.message || 'Failed to fetch appointments.'); }
        finally { setIsLoading(false); }
      }, [user, token, isAuthenticated]);

      useEffect(() => { fetchData(); }, [fetchData]);

      // ... handleCancelAppointment, confirmCancelAppointment ...

      // ... logic to split userAppointments into upcomingAppointments and pastAppointments ...
      const upcomingAppointments = userAppointments.filter(/* ... */);
      const pastAppointments = userAppointments.filter(/* ... */);


      return (
        <div className="client-my-appointments-page">
          <header className="page-header"><h1>My Appointments</h1></header>
          {error && <div className="error-message">{error}</div>}
          {isLoading && <p>Loading appointments...</p>}

          <section className="appointments-section">
            <h2>Upcoming Appointments</h2>
            {upcomingAppointments.length > 0 ? (
              <ul className="appointments-list">
                {upcomingAppointments.map(app => (
                  <li key={app.id} className={`appointment-card status-${app.status?.toLowerCase()}`}>
                    <h3>{app.serviceName}</h3>
                    <p><strong>Branch:</strong> {app.branchName}</p>
                    {/* ... Date, Time, Status ... */}
                    {app.status?.toUpperCase() === 'SCHEDULED' && (
                      <button onClick={() => handleCancelAppointment(app)}>Cancel</button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (<p>No upcoming appointments.</p>)}
          </section>

          {/* ... Past Appointments Section ... */}
          {/* ... ConfirmationDialog for cancellation ... */}
        </div>
      );
    };
    export default ClientMyAppointmentsPage;
    ```

This page provides clients with full visibility and basic control over their appointments, leveraging the efficient data structure provided by the backend's updated `Appointment` DTO.