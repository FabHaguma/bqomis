import React, { useState, useEffect, useCallback } from 'react';
import { getAllServices, deleteService } from '../../api/serviceService';
import { useAuth } from '../../contexts/AuthContext';
import ServiceForm from '../../features/admin/serviceManagement/ServiceForm'; // We'll create this
import Modal from '../../components/common/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import './AdminServiceManagementPage.scss'; // Create this SCSS file

const AdminServiceManagementPage = () => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [selectedService, setSelectedService] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'

  const { token } = useAuth();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const servicesData = await getAllServices(token);
      setServices(servicesData || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch services.');
      setServices([]);
      console.error("Fetch services error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    } else {
        setIsLoading(false);
        setError("Authentication token not found. Please log in.");
    }
  }, [fetchData, token]);

  const handleCreateNew = () => {
    setSelectedService(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDelete = (service) => {
    setSelectedService(service);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteService = async () => {
    if (!selectedService || !selectedService.id) return;
    try {
      await deleteService(selectedService.id, token);
      setIsDeleteConfirmOpen(false);
      setSelectedService(null);
      fetchData(); // Refresh the list
    } catch (err) {
      setError(err.message || 'Failed to delete service.');
      console.error("Delete service error:", err);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    fetchData(); // Refresh data after successful form submission
  };

  if (isLoading) {
    return <div className="loading-message">Loading services...</div>;
  }

  return (
    <div className="admin-service-management-page">
      <header className="page-header">
        <h1>Service Management</h1>
        <button onClick={handleCreateNew} className="btn btn-primary">
          Create New Service
        </button>
      </header>

      {error && <div className="error-message alert alert-danger">{error}</div>}

      <div className="services-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length > 0 ? (
              services.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(service)} 
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(service)} 
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No services found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormModalOpen && (
        <Modal 
            isOpen={isFormModalOpen} 
            onClose={() => setIsFormModalOpen(false)}
            title={formMode === 'create' ? 'Create New Service' : 'Edit Service'}
        >
          <ServiceForm
            mode={formMode}
            initialData={selectedService}
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormModalOpen(false)}
          />
        </Modal>
      )}

      {isDeleteConfirmOpen && selectedService && (
        <ConfirmationDialog
          isOpen={isDeleteConfirmOpen}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the service "${selectedService.name}"?`}
          onConfirm={confirmDeleteService}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          confirmButtonText="Delete"
          confirmButtonVariant="danger"
        />
      )}
    </div>
  );
};

export default AdminServiceManagementPage;