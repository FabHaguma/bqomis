import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
    getFilteredAppointments, 
    updateAppointmentStatus, 
    deleteAppointment,
    // getAppointmentById // If needed for a detail view modal
} from '../../api/appointmentService';
import { getAllBranches } from '../../api/branchService';
import { getAllServices } from '../../api/serviceService';
import { getAllDistricts } from '../../api/districtService';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import Modal from '../../components/common/Modal'; // For viewing details or updating status
import './AdminAppointmentManagementPage.scss'; // Create SCSS

const APPOINTMENT_STATUSES = ["SCHEDULED", "CHECKED_IN", "COMPLETED", "CANCELLED", "NO_SHOW"];

const AdminAppointmentManagementPage = () => {
  const { token } = useAuth();
  
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to get date string for N days ago
  const getDateNDaysAgo = (n) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };

  // Filter states
  const [filters, setFilters] = useState({
    dateFrom: getDateNDaysAgo(7),
    dateTo: '',
    branchId: '',
    serviceId: '',
    status: '',
    districtName: '',
    page: 0, // For pagination
    size: 30,
  });

  // Data for filter dropdowns
  const [branches, setBranches] = useState([]);
  const [services, setServices] = useState([]);
  const [districts, setDistricts] = useState([]);

  // Modal states
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Fetch filter data (branches, services, districts)
  useEffect(() => {
    const fetchFilterData = async () => {
      if (!token) return;
      try {
        const [branchesData, servicesData, districtsData] = await Promise.all([
          getAllBranches(token),
          getAllServices(token),
          getAllDistricts(token),
        ]);
        setBranches(branchesData || []);
        setServices(servicesData || []);
        setDistricts(districtsData || []);
      } catch (err) {
        console.error("Failed to load filter data:", err);
        setError("Failed to load filter options.");
      }
    };
    fetchFilterData();
  }, [token]);

  const fetchAppointments = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      // Remove empty filter values before sending
      const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {});
      const data = await getFilteredAppointments(activeFilters, token);
      console.log("Fetched appointments:", data);
      console.log("Active filters:", activeFilters);
      // Assuming data is an array, or data.content if paginated
      setAppointments(Array.isArray(data) ? data : (data?.content || [])); 
      // Handle pagination info if present: setTotalPages(data.totalPages) etc.
    } catch (err) {
      setError(err.message || "Failed to fetch appointments.");
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, [token, filters]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value /*, page: 0 */ })); // Reset page on filter change
  };

  const handleApplyFilters = () => {
    fetchAppointments(); // Manually trigger fetch if not auto-triggered by filter change
  };

  const handleViewDetails = async (appointment) => {
    // Optionally fetch full details if list view is summarized
    // For now, just use the appointment data from the list
    setSelectedAppointment(appointment);
    setIsDetailModalOpen(true);
  };

  const handleOpenUpdateStatus = (appointment) => {
    setSelectedAppointment(appointment);
    setNewStatus(appointment.status || '');
    setIsStatusModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedAppointment || !newStatus || !token) return;
    try {
      await updateAppointmentStatus(selectedAppointment.id, newStatus, token);
      setIsStatusModalOpen(false);
      fetchAppointments(); // Refresh
    } catch (err) {
      setError(err.message || "Failed to update status.");
      console.error("Status update error:", err);
    }
  };

  const handleOpenCancel = (appointment) => {
    setSelectedAppointment(appointment);
    setIsCancelConfirmOpen(true);
  };

  const confirmCancelAppointment = async () => {
    if (!selectedAppointment || !token) return;
    try {
      await deleteAppointment(selectedAppointment.id, token);
      setIsCancelConfirmOpen(false);
      fetchAppointments(); // Refresh
    } catch (err) {
      setError(err.message || "Failed to cancel appointment.");
      console.error("Cancel error:", err);
    }
  };

  return (
    <div className="admin-appointment-management-page">
      <header className="page-header">
        <h1>Appointment Management</h1>
      </header>

      {error && <div className="error-message alert alert-danger">{error}</div>}

      <div className="filters-container">
        {/* Date From/To */}
        <input type="date" name="dateFrom" value={filters.dateFrom} onChange={handleFilterChange} />
        <input type="date" name="dateTo" value={filters.dateTo} onChange={handleFilterChange} />
        {/* District Dropdown */}
        <select name="districtName" value={filters.districtName} onChange={handleFilterChange}>
          <option value="">All Districts</option>
          {districts.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
        </select>
        {/* Branch Dropdown */}
        <select name="branchId" value={filters.branchId} onChange={handleFilterChange}>
          <option value="">All Branches</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
        {/* Service Dropdown */}
        <select name="serviceId" value={filters.serviceId} onChange={handleFilterChange}>
          <option value="">All Services</option>
          {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        {/* Status Dropdown */}
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Statuses</option>
          {APPOINTMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button onClick={handleApplyFilters} className="btn btn-primary btn-sm">Apply Filters</button>
      </div>

      {isLoading && <div className="loading-message">Loading appointments...</div>}
      
      {!isLoading && (
        <div className="appointments-table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Time</th>
                <th>Service Name</th>
                <th>Branch Name</th>
                <th>User ID</th> {/* Or Username if you join/fetch */}
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? appointments.map(app => (
                <tr key={app.id}>
                  <td>{app.id}</td>
                  <td>{app.date}</td>
                  <td>{app.time}</td>
                  <td>{app.serviceName}</td> {/* Assumes new Appointment DTO */}
                  <td>{app.branchName}</td>   {/* Assumes new Appointment DTO */}
                  <td>{app.userId}</td>
                  <td><span className={`status-badge status-${app.status?.toLowerCase()}`}>{app.status}</span></td>
                  <td>
                    <button onClick={() => handleViewDetails(app)} className="btn btn-info btn-xs">Details</button>
                    <button onClick={() => handleOpenUpdateStatus(app)} className="btn btn-secondary btn-xs">Status</button>
                    { (app.status === "SCHEDULED" || app.status === "CHECKED_IN") &&
                        <button onClick={() => handleOpenCancel(app)} className="btn btn-danger btn-xs">Cancel</button>
                    }
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="8">No appointments match the current filters.</td></tr>
              )}
            </tbody>
          </table>
          {/* TODO: Pagination controls */}
        </div>
      )}

      {/* Detail Modal */}
      {isDetailModalOpen && selectedAppointment && (
        <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Appointment Details">
          <div className="appointment-detail-view">
            <p><strong>ID:</strong> {selectedAppointment.id}</p>
            <p><strong>Date & Time:</strong> {selectedAppointment.date} at {selectedAppointment.time}</p>
            <p><strong>Service:</strong> {selectedAppointment.serviceName}</p>
            <p><strong>Branch:</strong> {selectedAppointment.branchName}</p>
            <p><strong>Client User ID:</strong> {selectedAppointment.userId}</p>
            <p><strong>Status:</strong> {selectedAppointment.status}</p>
            {/* Add more details if available, e.g., client username/email by fetching user details */}
          </div>
        </Modal>
      )}

      {/* Update Status Modal */}
      {isStatusModalOpen && selectedAppointment && (
        <Modal isOpen={isStatusModalOpen} onClose={() => setIsStatusModalOpen(false)} title="Update Appointment Status">
          <div className="update-status-form">
            <p>Updating status for appointment ID: {selectedAppointment.id} ({selectedAppointment.serviceName})</p>
            <div className="form-group">
              <label htmlFor="newStatus">New Status:</label>
              <select id="newStatus" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                {APPOINTMENT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button onClick={() => setIsStatusModalOpen(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleUpdateStatus} className="btn btn-primary">Update Status</button>
            </div>
          </div>
        </Modal>
      )}
      
      {/* Cancel Confirmation Dialog */}
      {isCancelConfirmOpen && selectedAppointment && (
        <ConfirmationDialog
            isOpen={isCancelConfirmOpen}
            title="Confirm Appointment Cancellation"
            message={`Are you sure you want to cancel this appointment (ID: ${selectedAppointment.id})?`}
            onConfirm={confirmCancelAppointment}
            onCancel={() => setIsCancelConfirmOpen(false)}
            confirmButtonText="Yes, Cancel"
            confirmButtonVariant="danger"
        />
      )}
    </div>
  );
};

export default AdminAppointmentManagementPage;