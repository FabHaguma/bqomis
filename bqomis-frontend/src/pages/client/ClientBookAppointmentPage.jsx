import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { createAppointment, getAppointmentsByDateAndBranchService } from '../../api/appointmentService';
import './ClientBookAppointmentPage.scss'; // Create this SCSS file

// Define standard time slots (example: 9 AM to 4:30 PM, every 30 mins)
const generateTimeSlots = () => {
  const slots = [];
  const startTime = 9; // 9 AM
  const endTime = 17; // 5 PM (slot ends before 5 PM)
  for (let hour = startTime; hour < endTime; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
    if (hour < endTime -1 || (hour === endTime -1 && 0 < 30)) { // Add :30 slot unless it's the last hour's :30
         slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
  }
  // Remove 5:00 PM if generated, booking should be before closing
  return slots.filter(slot => slot !== "17:00"); 
};

const PREDEFINED_TIME_SLOTS = generateTimeSlots();


const ClientBookAppointmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();

  const [branch, setBranch] = useState(null);
  const [service, setService] = useState(null); // Contains branchServiceId
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!location.state || !location.state.branch || !location.state.service) {
      setError('Branch or service information is missing. Please select again.');
      // Optionally navigate back or show a more permanent error
      // navigate('/client/branches'); 
      return;
    }
    setBranch(location.state.branch);
    setService(location.state.service);

    // Set default date to today (or tomorrow if today is past a certain time - advanced)
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    setSelectedDate(`${yyyy}-${mm}-${dd}`);

  }, [location.state, navigate]);

  // Fetch booked appointments for the selected date and service to determine available slots
  const fetchAndSetAvailableTimeSlots = useCallback(async () => {
    if (!selectedDate || !service || !service.branchServiceId || !token) {
      setAvailableTimeSlots([]);
      return;
    }
    setIsLoadingTimeSlots(true);
    setError(null); // Clear previous errors specific to time slot fetching

    try {
      const bookedAppointments = await getAppointmentsByDateAndBranchService(
        selectedDate,
        service.branchServiceId,
        token
      );
      
      const bookedTimes = (bookedAppointments || []).map(app => app.time); // Extract "HH:mm"
      
      const allPossibleSlots = generateTimeSlots(); // Get all predefined slots

      // Filter out already booked slots and past slots if the date is today
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      const available = allPossibleSlots.filter(slot => {
        if (bookedTimes.includes(slot)) {
          return false; // Slot is booked
        }
        // If selectedDate is today, disable past time slots
        if (selectedDate === now.toISOString().split('T')[0]) {
          const [slotHour, slotMinute] = slot.split(':').map(Number);
          if (slotHour < currentHour || (slotHour === currentHour && slotMinute < currentMinute)) {
            return false; // Slot is in the past
          }
        }
        return true; // Slot is available
      });
      
      setAvailableTimeSlots(available);

    } catch (err) {
      setError(err.message || 'Failed to fetch available time slots.');
      console.error("Fetch time slots error:", err);
      setAvailableTimeSlots([]); // Clear on error
    } finally {
      setIsLoadingTimeSlots(false);
    }
  }, [selectedDate, service, token]); // Dependencies for this callback

  useEffect(() => {
    fetchAndSetAvailableTimeSlots();
  }, [fetchAndSetAvailableTimeSlots]); // Run when the callback itself changes (due to its deps)


  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedTime(''); // Reset time when date changes
    // fetchAndSetAvailableTimeSlots will be triggered by the useEffect above
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setError(null);
    setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      setError('Please select both a date and a time.');
      return;
    }
    if (!isAuthenticated || !user || !user.id) {
        setError('You must be logged in to book an appointment.');
        return;
    }
    if (!branch || !service || !service.branchServiceId) {
        setError('Branch or Service information is incomplete.');
        return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccessMessage('');

    const appointmentData = {
      userId: user.id, // From AuthContext
      branchServiceId: service.branchServiceId, // From location.state.service
      date: selectedDate, // yyyy-MM-dd
      time: selectedTime, // HH:mm
      status: 'SCHEDULED', // Or 'PENDING' or whatever backend expects as initial status
    };

    try {
      const newAppointment = await createAppointment(appointmentData, token);
      setSuccessMessage(`Appointment booked successfully for ${service.name} at ${branch.name} on ${selectedDate} at ${selectedTime}. Your appointment ID is ${newAppointment.id}.`);
      // Optionally, navigate to an "My Appointments" page after a delay
      // setTimeout(() => navigate('/client/my-appointments'), 3000);
    } catch (err) {
      setError(err.message || 'Failed to book appointment. The slot might be unavailable or an error occurred.');
      console.error("Booking error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!branch || !service) {
    // This will be shown briefly if state is not yet set, or if error occurred in useEffect
    return (
        <div className="client-book-appointment-page">
            <header className="page-header"><h1>Book Appointment</h1></header>
            {error ? 
                <div className="error-message alert alert-danger">{error}</div> : 
                <p>Loading details...</p>}
        </div>
    );
  }

  return (
    <div className="client-book-appointment-page">
      <header className="page-header">
        <h1>Book Appointment</h1>
      </header>

      <div className="booking-details-summary">
        <h2>Your Selection:</h2>
        <p><strong>Branch:</strong> {branch.name} ({branch.address})</p>
        <p><strong>Service:</strong> {service.name}</p>
      </div>

      {error && <div className="error-message alert alert-danger">{error}</div>}
      {successMessage && <div className="success-message alert alert-success">{successMessage}</div>}

      {!successMessage && (
        <form onSubmit={handleSubmit} className="booking-form">
          <div className="form-group">
            <label htmlFor="appointment-date">Select Date:</label>
            <input
              type="date"
              id="appointment-date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              required
              disabled={isSubmitting || isLoadingTimeSlots} // Disable while loading slots for new date
            />
          </div>

          {selectedDate && (
            <div className="form-group">
              <label>Select Available Time Slot:</label>
              {isLoadingTimeSlots && <p className="loading-text">Loading time slots...</p>}
              {!isLoadingTimeSlots && availableTimeSlots.length === 0 && (
                <p className="no-slots-message">No available time slots for the selected date. Please try another date.</p>
              )}
              {!isLoadingTimeSlots && availableTimeSlots.length > 0 && (
                <div className="time-slots-container">
                  {availableTimeSlots.map(slot => (
                    <button
                      type="button"
                      key={slot}
                      className={`time-slot-btn ${selectedTime === slot ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(slot)}
                      disabled={isSubmitting} // No need to disable based on isLoadingTimeSlots here as they are already filtered
                    >
                      {slot}
                    </button>
                ))}
                </div>
              )}
            </div>
          )}

          {selectedDate && selectedTime && !isLoadingTimeSlots && ( // Only show confirm if slots are not loading
            <button type="submit" className="btn btn-primary btn-confirm-booking" disabled={isSubmitting}>
              {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
            </button>
          )}
        </form>
      )}
      {/* Optionally, add a "Book Another" button here if needed */}
    </div>
  );
};

export default ClientBookAppointmentPage;