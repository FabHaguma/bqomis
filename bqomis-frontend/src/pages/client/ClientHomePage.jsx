// src/pages/client/ClientHomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAppointmentsByUserId } from '../../api/appointmentService';
import './ClientHomePage.scss'; // Create this SCSS file

const ClientHomePage = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [nextUpcomingAppointment, setNextUpcomingAppointment] = useState(null);
  const [isLoadingAppointment, setIsLoadingAppointment] = useState(false);
  const [appointmentError, setAppointmentError] = useState(null);

  const fetchNextAppointment = useCallback(async () => {
    if (!isAuthenticated || !user || !user.id || !token) {
      setNextUpcomingAppointment(null); // Clear if not authenticated
      return;
    }
    setIsLoadingAppointment(true);
    setAppointmentError(null);
    try {
      const userAppointments = await getAppointmentsByUserId(user.id, token);
      
      const todayStr = new Date().toISOString().split('T')[0];
      const upcoming = (userAppointments || [])
        .filter(app => 
            app.date >= todayStr && 
            (app.status?.toUpperCase() === 'SCHEDULED' || app.status?.toUpperCase() === 'ACTIVE')
        )
        .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time)); // Earliest upcoming first

      if (upcoming.length > 0) {
        setNextUpcomingAppointment(upcoming[0]);
      } else {
        setNextUpcomingAppointment(null);
      }
    } catch (err) {
      setAppointmentError(err.message || "Could not load upcoming appointment.");
      console.error("Error fetching next appointment:", err);
    } finally {
      setIsLoadingAppointment(false);
    }
  }, [user, token, isAuthenticated]);

  useEffect(() => {
    fetchNextAppointment();
  }, [fetchNextAppointment]);


  if (!user && !isAuthenticated) { // Should be caught by protected route, but good to have a fallback
    return (
      <div className="client-home-page">
        <p>Please log in to access the home page.</p>
      </div>
    );
  }
  
  return (
    <div className="client-home-page">
      <header className="home-header">
        <h1>Welcome back, {user?.username || 'Guest'}!</h1>
        <p>Manage your bank appointments efficiently with BQOMIS.</p>
      </header>

      <section className="upcoming-appointment-section">
        <h2>Your Next Appointment</h2>
        {isLoadingAppointment && <p className="loading-text">Loading appointment details...</p>}
        {appointmentError && <p className="error-text">{appointmentError}</p>}
        {!isLoadingAppointment && !appointmentError && nextUpcomingAppointment && (
          <div className="appointment-summary-card">
            <h3>{nextUpcomingAppointment.serviceName}</h3>
            <p><strong>Branch:</strong> {nextUpcomingAppointment.branchName}</p>
            <p>
                <strong>Date & Time:</strong> 
                {new Date(nextUpcomingAppointment.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                {' at '} 
                {nextUpcomingAppointment.time}
            </p>
            <p><strong>Status:</strong> <span className={`status-badge status-${nextUpcomingAppointment.status?.toLowerCase()}`}>{nextUpcomingAppointment.status}</span></p>
            <Link to="/client/appointments" className="btn btn-secondary btn-view-all">View All My Appointments</Link>
          </div>
        )}
        {!isLoadingAppointment && !appointmentError && !nextUpcomingAppointment && (
          <p>You have no upcoming appointments scheduled.</p>
        )}
      </section>

      <section className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <Link to="/client/branches" className="action-card">
            <span className="action-icon">📅</span>
            <h3>Book New Appointment</h3>
            <p>Find a branch and schedule your next visit.</p>
          </Link>
          <Link to="/client/appointments" className="action-card">
            <span className="action-icon">📄</span>
            <h3>My Appointments</h3>
            <p>View and manage your scheduled appointments.</p>
          </Link>
          {/* <Link to="/client/profile" className="action-card">
            <span className="action-icon">👤</span>
            <h3>My Profile</h3>
            <p>Update your personal information and settings.</p>
          </Link> */}
        </div>
      </section>
    </div>
  );
};

export default ClientHomePage;