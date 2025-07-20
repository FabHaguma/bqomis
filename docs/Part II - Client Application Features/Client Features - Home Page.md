
### II.2. Client Features - Home Page (`ClientHomePage.jsx`)

*   **Purpose:** The `ClientHomePage.jsx` serves as the primary landing page for authenticated clients. It aims to provide a personalized welcome, quick access to key functionalities, and a summary of important information, such as their next upcoming appointment.
*   **Accessibility:** Accessible via the `/client/home` route. It's typically the page users are redirected to after a successful client login. This route is protected and requires authentication.

*   **Key UI Elements & Functionality:**

    1.  **Personalized Greeting:**
        *   Displays a welcome message that includes the logged-in user's username (e.g., "Welcome back, [Username]!").
        *   The username is retrieved from the `user` object provided by the `AuthContext`.

    2.  **Upcoming Appointment Summary:**
        *   Shows details of the user's *next* scheduled or active appointment, if one exists.
        *   Information displayed includes:
            *   Service Name
            *   Branch Name
            *   Full Date (e.g., "Monday, July 15, 2024")
            *   Time (e.g., "10:30 AM")
            *   Current Status (e.g., "SCHEDULED", "ACTIVE") with a visual status badge.
        *   Provides a link/button ("View All My Appointments") that navigates the user to the `ClientMyAppointmentsPage.jsx`.
        *   If no upcoming appointments are found, a message indicating this is shown.
        *   **Data Fetching:**
            *   On component mount (or when user/token changes), it calls the `getAppointmentsByUserId` function from `appointmentService.js` using the logged-in user's ID and token.
            *   The fetched appointments (which, thanks to the enhanced `Appointment` DTO, include `serviceName` and `branchName`) are then filtered client-side to find only those that are "SCHEDULED" or "ACTIVE" and occur on or after the current date.
            *   The list is sorted chronologically, and the first appointment is selected as the "next upcoming."
        *   Displays loading and error states during data fetching.

    3.  **Quick Actions Section:**
        *   Provides prominent links or "cards" for common client tasks:
            *   **"Book New Appointment":** Links to `ClientFindBranchPage.jsx` (`/client/branches`) to start the process of finding a branch and booking a new service.
            *   **"My Appointments":** Links to `ClientMyAppointmentsPage.jsx` (`/client/appointments`).
            *   **"My Profile":** Links to `ClientProfilePage.jsx` (`/client/profile`).
        *   Each action card typically includes an icon, a title, and a brief description.

*   **State Management:**
    *   `nextUpcomingAppointment`: Stores the fetched upcoming appointment object or `null`.
    *   `isLoadingAppointment`: Boolean to indicate if appointment data is being fetched.
    *   `appointmentError`: Stores any error message related to fetching appointment data.

*   **Key Code Snippet (`ClientHomePage.jsx` - illustrating data fetching and display logic):**
    ```javascript
    // src/pages/client/ClientHomePage.jsx (Illustrative Structure)
    import React, { useState, useEffect, useCallback } from 'react';
    import { Link } from 'react-router-dom';
    import { useAuth } from '../../contexts/AuthContext';
    import { getAppointmentsByUserId } from '../../api/appointmentService';
    // import './ClientHomePage.scss'; // Styles

    const ClientHomePage = () => {
      const { user, token, isAuthenticated } = useAuth();
      const [nextUpcomingAppointment, setNextUpcomingAppointment] = useState(null);
      const [isLoadingAppointment, setIsLoadingAppointment] = useState(false);
      // ... other state like appointmentError ...

      const fetchNextAppointment = useCallback(async () => {
        if (!isAuthenticated || !user?.id || !token) return;
        setIsLoadingAppointment(true);
        try {
          const userAppointments = await getAppointmentsByUserId(user.id, token);
          const todayStr = new Date().toISOString().split('T')[0];
          const upcoming = (userAppointments || [])
            .filter(app => app.date >= todayStr && (app.status?.toUpperCase() === 'SCHEDULED' || app.status?.toUpperCase() === 'ACTIVE'))
            .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
          setNextUpcomingAppointment(upcoming.length > 0 ? upcoming[0] : null);
        } catch (err) { /* ... setError ... */ }
        finally { setIsLoadingAppointment(false); }
      }, [user, token, isAuthenticated]);

      useEffect(() => {
        fetchNextAppointment();
      }, [fetchNextAppointment]);

      return (
        <div className="client-home-page">
          <header className="home-header">
            <h1>Welcome back, {user?.username || 'Guest'}!</h1>
            {/* ... intro paragraph ... */}
          </header>

          <section className="upcoming-appointment-section">
            <h2>Your Next Appointment</h2>
            {isLoadingAppointment && <p>Loading...</p>}
            {/* ... Display nextUpcomingAppointment details if present, else "No upcoming..." ... */}
            {nextUpcomingAppointment && (
              <div className="appointment-summary-card">
                <h3>{nextUpcomingAppointment.serviceName}</h3>
                <p><strong>Branch:</strong> {nextUpcomingAppointment.branchName}</p>
                {/* ... Date, Time, Status ... */}
                <Link to="/client/appointments" className="btn btn-secondary">View All</Link>
              </div>
            )}
            {!isLoadingAppointment && !nextUpcomingAppointment && <p>No upcoming appointments.</p>}
          </section>

          <section className="quick-actions-section">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <Link to="/client/branches" className="action-card">{/* ... Book New ... */}</Link>
              <Link to="/client/appointments" className="action-card">{/* ... My Appointments ... */}</Link>
              <Link to="/client/profile" className="action-card">{/* ... My Profile ... */}</Link>
            </div>
          </section>
        </div>
      );
    };
    export default ClientHomePage;
    ```

The `ClientHomePage.jsx` acts as a welcoming and functional dashboard for clients, providing immediate value by highlighting relevant information and offering easy navigation to core features of the BQOMIS system.