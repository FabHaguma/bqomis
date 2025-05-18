import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAppointmentsByUserId, deleteAppointment } from '../../api/appointmentService';
import ConfirmationDialog from '../../components/common/ConfirmationDialog'; // Re-use
import './ClientMyAppointmentsPage.scss'; // Create this SCSS file

const ClientMyAppointmentsPage = () => {
  const { user, token, isAuthenticated } = useAuth();
  
  const [userAppointments, setUserAppointments] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user || !user.id || !token) {
      setError("You need to be logged in to view your appointments.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Fetch user's appointments - they now contain branchName and serviceName directly
      const userAppointmentsData = await getAppointmentsByUserId(user.id, token);

      const processedAppointments = (userAppointmentsData || [])
        .map(app => ({
          ...app,
          // Ensure default values if backend might send null for names
          branchName: app.branchName || 'N/A', 
          serviceName: app.serviceName || 'N/A',
          // district might not be in the new Appointment DTO, adjust if needed or remove if not displayed
          // district: app.district || 'N/A', // If your new Appointment DTO includes district
        }))
        .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time)); // Sort recent first

      setUserAppointments(processedAppointments);

    } catch (err) {
      setError(err.message || 'Failed to fetch your appointments.');
      console.error("Fetch appointments error:", err);
      setUserAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, token, isAuthenticated]); // user and isAuthenticated are key dependencies

  useEffect(() => {
    // Only fetch if authenticated and user info is available
    if (isAuthenticated && user && user.id) {
        fetchData();
    } else if (!isAuthenticated && !isLoading) { // Handle case where user logs out while on page
        setUserAppointments([]);
        setError("Please log in to see your appointments.");
    }
  }, [fetchData, isAuthenticated, user, isLoading]); // Add isLoading to deps to prevent refetch if already loading

  
  // Handle appointment cancellation
  // This function will be called when the user clicks "Cancel Appointment"
  const handleCancelAppointment = (appointment) => {
    setAppointmentToCancel(appointment);
    setIsCancelConfirmOpen(true);
  };

  const confirmCancelAppointment = async () => {
    if (!appointmentToCancel || !token) return;
    setError(null);
    try {
      await deleteAppointment(appointmentToCancel.id, token);
      setIsCancelConfirmOpen(false);
      setAppointmentToCancel(null);
      fetchData(); // Refresh the list
    } catch (err) {
      setError(err.message || `Failed to cancel appointment ID ${appointmentToCancel.id}.`);
      console.error("Cancel appointment error:", err);
      setIsCancelConfirmOpen(false); // Close dialog even on error for now
    }
  };

  // Separate appointments into upcoming and past
  const todayStr = new Date().toISOString().split('T')[0];
  const upcomingAppointments = userAppointments.filter(app => 
    app.date >= todayStr && (app.status?.toUpperCase() === 'SCHEDULED' || app.status?.toUpperCase() === 'ACTIVE') // Consider 'ACTIVE' as upcoming for today
  ).sort((a,b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)); // chronological

  const pastAppointments = userAppointments.filter(app => 
    app.date < todayStr || (app.status?.toUpperCase() !== 'SCHEDULED' && app.status?.toUpperCase() !== 'ACTIVE')
  ).sort((a,b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time)); // most recent past first


  if (isLoading) {
    return <div className="loading-message">Loading your appointments...</div>;
  }

  return (
    <div className="client-my-appointments-page">
      <header className="page-header">
        <h1>My Appointments</h1>
      </header>

      {error && <div className="error-message alert alert-danger">{error}</div>}

      <section className="appointments-section">
        <h2>Upcoming Appointments</h2>
        {!isLoading && !error && upcomingAppointments.length > 0 ? (
          <ul className="appointments-list">
            {upcomingAppointments.map(app => (
              <li key={app.id} className={`appointment-card status-${app.status?.toLowerCase()}`}>
                <div className="card-header">
                  <h3>{app.serviceName}</h3> {/* Directly from app object */}
                  <span className={`status-badge status-${app.status?.toLowerCase()}`}>{app.status || 'Unknown'}</span>
                </div>
                {/* If your new Appointment DTO doesn't include district, remove '({app.district})' */}
                <p><strong>Branch:</strong> {app.branchName} {/* ({app.district}) */}</p> 
                <p><strong>Date:</strong> {new Date(app.date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> {app.time}</p>
                { (app.status?.toUpperCase() === 'SCHEDULED') && 
                  <button 
                    onClick={() => handleCancelAppointment(app)}
                    className="btn btn-danger btn-sm btn-cancel"
                  >
                    Cancel Appointment
                  </button>
                }
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && !error && <p>You have no upcoming appointments.</p>
        )}
      </section>
       
       <section className="appointments-section">
        <h2>Past Appointments</h2>
        {!isLoading && !error && pastAppointments.length > 0 ? (
          <ul className="appointments-list">
            {pastAppointments.map(app => (
              <li key={app.id} className={`appointment-card status-${app.status?.toLowerCase()}`}>
                 <div className="card-header">
                  <h3>{app.serviceName}</h3> {/* Directly from app object */}
                  <span className={`status-badge status-${app.status?.toLowerCase()}`}>{app.status || 'Unknown'}</span>
                </div>
                {/* If your new Appointment DTO doesn't include district, remove '({app.district})' */}
                <p><strong>Branch:</strong> {app.branchName} {/* ({app.district}) */}</p>
                <p><strong>Date:</strong> {new Date(app.date + 'T00:00:00').toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Time:</strong> {app.time}</p>
              </li>
            ))}
          </ul>
        ) : (
          !isLoading && !error && <p>You have no past appointments.</p>
        )}
      </section>

      {isCancelConfirmOpen && appointmentToCancel && (
        <ConfirmationDialog
          isOpen={isCancelConfirmOpen}
          title="Confirm Cancellation"
          message={`Are you sure you want to cancel your appointment for "${appointmentToCancel.serviceName}" on ${appointmentToCancel.date} at ${appointmentToCancel.time}?`}
          onConfirm={confirmCancelAppointment}
          onCancel={() => setIsCancelConfirmOpen(false)}
          confirmButtonText="Yes, Cancel"
          confirmButtonVariant="danger"
        />
      )}
    </div>
  );
};

export default ClientMyAppointmentsPage;