
### II.4. Client Features - Appointment Booking (`ClientBookAppointmentPage.jsx`)

*   **Purpose:** This page allows clients to finalize their appointment by selecting a specific date and time for a previously chosen service at a particular branch. It focuses on providing available slots and confirming the booking.
*   **Accessibility:** Accessible via the `/client/book-appointment` route. Users are typically navigated here from the `ClientFindBranchPage.jsx` after selecting a branch and a specific service they wish to book. This route is protected and requires client authentication.

*   **Prerequisites (Data from Previous Page):**
    *   The component expects to receive `branch` and `service` information via `location.state` passed during navigation from `ClientFindBranchPage.jsx`.
    *   **`branch` object:** Contains details of the selected branch (e.g., `id`, `name`, `address`).
    *   **`service` object:** Contains details of the selected service, crucially including:
        *   `id` (or `serviceId`): The unique ID of the service itself.
        *   `name` (or `serviceName`): The name of the service.
        *   `branchServiceId`: The unique ID of the `BranchService` link record that connects this specific branch and service. This `branchServiceId` is **essential** for the backend `POST /api/appointments` request.

*   **Key UI Elements & Workflow:**

    1.  **Booking Summary Display:**
        *   Prominently displays the selected branch name, address, and the chosen service name to confirm the context for the user.

    2.  **Date Selection:**
        *   A date input field (`<input type="date">`) allows the client to choose their desired appointment date.
        *   The date picker is typically constrained to prevent selecting past dates.
        *   A default date (e.g., today or the next available day) is pre-selected.

    3.  **Time Slot Selection & Availability:**
        *   **Dynamic Slot Display:** Once a date is selected (or changes), the system fetches actual appointment availability for that date and specific `branchServiceId`.
        *   **API Call:** `GET /api/appointments?date=YYYY-MM-DD&branchServiceId=X` (via `getAppointmentsByDateAndBranchService` from `appointmentService.js`) is called. This endpoint returns all existing appointments for the given date and specific branch-service combination.
        *   **Slot Generation & Filtering (Client-Side):**
            *   A predefined list of potential time slots is generated (e.g., every 15 or 30 minutes within standard operating hours, like 9:00 AM to 4:45 PM).
            *   The frontend then compares this list of potential slots with the `time` values from the fetched *booked* appointments.
            *   Additionally, if the selected date is today, time slots that have already passed are filtered out.
            *   Only the remaining *available* time slots are displayed to the user as clickable buttons.
        *   **UI:** Available time slots are shown as a grid of buttons. The currently selected time slot is visually highlighted.
        *   If no slots are available for the selected date, a message like "No available time slots for the selected date. Please try another date." is displayed.
        *   A loading indicator is shown while fetching slot availability.

    4.  **Form Submission & Appointment Creation:**
        *   After selecting a date and an available time slot, a "Confirm Appointment" button becomes active.
        *   Upon clicking "Confirm Appointment":
            *   Client-side validation ensures a date and time are selected.
            *   The `user.id` (from `AuthContext`) is retrieved.
            *   An API call is made to `POST /api/appointments` (via `createAppointment` from `appointmentService.js`).
            *   **Payload to Backend:**
                ```json
                {
                  "userId": /* current user's ID */,
                  "branchServiceId": /* from location.state.service.branchServiceId */,
                  "date": "YYYY-MM-DD" /* selectedDate */,
                  "time": "HH:mm" /* selectedTime */,
                  "status": "SCHEDULED" // Default status for new bookings
                }
                ```
        *   **On Successful Booking:**
            *   A success message is displayed (e.g., "Appointment booked successfully! Your appointment ID is [ID].").
            *   The form is typically hidden or disabled.
            *   The available time slots for the *current date* are refreshed to reflect the new booking (the just-booked slot should no longer appear available).
            *   A button like "Book Another Appointment" (linking back to `/client/branches`) might appear.
        *   **On Failed Booking:**
            *   An error message from the API is displayed (e.g., "Failed to book appointment. The slot might have just become unavailable or an error occurred."). This could happen due to race conditions if another user books the same slot simultaneously, or other backend validation failures.

*   **State Management:**
    *   `branch`, `service`: Store the context passed from the previous page.
    *   `selectedDate`, `selectedTime`: Store the user's current selections.
    *   `availableTimeSlots`: An array of strings representing the time slots open for booking on the `selectedDate`.
    *   `isLoadingTimeSlots`: Boolean for loading state while fetching/calculating available slots.
    *   `isSubmitting`: Boolean for loading state during form submission.
    *   `error`, `successMessage`: Store feedback messages for the user.

*   **Key Code Snippet (`ClientBookAppointmentPage.jsx` - illustrating slot availability logic):**
    ```javascript
    // src/pages/client/ClientBookAppointmentPage.jsx (Illustrative - focus on slot logic)
    import React, { useState, useEffect, useCallback } from 'react';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { useAuth } from '../../contexts/AuthContext';
    import { createAppointment, getAppointmentsByDateAndBranchService } from '../../api/appointmentService';
    // import './ClientBookAppointmentPage.scss';

    const generateTimeSlots = () => { /* ... returns array of "HH:mm" strings ... */ };

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
          setAvailableTimeSlots([]); return;
        }
        setIsLoadingTimeSlots(true);
        try {
          const bookedAppointments = await getAppointmentsByDateAndBranchService(
            selectedDate, service.branchServiceId, token
          );
          const bookedTimes = (bookedAppointments || []).map(app => app.time);
          const allPossibleSlots = generateTimeSlots();
          const now = new Date();

          const available = allPossibleSlots.filter(slot => {
            if (bookedTimes.includes(slot)) return false;
            if (selectedDate === now.toISOString().split('T')[0]) { // Today
              const [slotHour, slotMinute] = slot.split(':').map(Number);
              if (slotHour < now.getHours() || (slotHour === now.getHours() && slotMinute < now.getMinutes())) {
                return false; // Past slot today
              }
            }
            return true;
          });
          setAvailableTimeSlots(available);
        } catch (err) { /* ... setError ... */ }
        finally { setIsLoadingTimeSlots(false); }
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
                  {availableTimeSlots.map(slot => (
                    <button key={slot} /* ... onClick, className ... */ >{slot}</button>
                  ))}
                </div>
              )}
              {!isLoadingTimeSlots && availableTimeSlots.length === 0 && <p>No slots available.</p>}
            </div>
          )}
          {/* ... Confirm button ... */}
        </div>
      );
    };
    export default ClientBookAppointmentPage;
    ```

This page provides a focused experience for the final step of booking an appointment, dynamically showing available time slots to enhance the user's ability to secure a convenient time.