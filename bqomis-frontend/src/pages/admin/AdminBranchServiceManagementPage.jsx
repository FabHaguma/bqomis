import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAllBranches } from '../../api/branchService';
import { getAllServices } from '../../api/serviceService';
import { 
  getBranchServicesByBranchId,
  createBranchServiceRelationship,
  deleteBranchServiceRelationship 
} from '../../api/branchLinkService';
import './AdminBranchServiceManagementPage.scss'; // Create this SCSS file

const AdminBranchServiceManagementPage = () => {
  const [branches, setBranches] = useState([]);
  const [allServices, setAllServices] = useState([]); // All available banking services
  
  const [selectedBranchId, setSelectedBranchId] = useState('');
  const [assignedServices, setAssignedServices] = useState([]); // Services assigned to the selected branch
  const [availableServicesToAdd, setAvailableServicesToAdd] = useState([]); // Services not yet assigned

  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(false); // For services of a selected branch
  const [error, setError] = useState(null);

  const { token } = useAuth();

  // Fetch all branches and all services once on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        setError("Authentication token not found.");
        return;
      }
      setIsLoadingBranches(true);
      setError(null);
      try {
        const branchesData = await getAllBranches(token);
        const allServicesData = await getAllServices(token);
        setBranches(branchesData || []);
        setAllServices(allServicesData || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch initial data.');
        console.error("Initial data fetch error:", err);
      } finally {
        setIsLoadingBranches(false);
      }
    };
    fetchInitialData();
  }, [token]);

  // Fetch assigned services when a branch is selected
  const fetchAssignedServicesForBranch = useCallback(async () => {
    if (!selectedBranchId || !token) {
      setAssignedServices([]);
      setAvailableServicesToAdd(allServices); // If no branch, all services are "available"
      return;
    }
    setIsLoadingServices(true);
    setError(null);
    try {
      const currentBranchServices = await getBranchServicesByBranchId(selectedBranchId, token);
      // currentBranchServices is an array of BranchService objects: { id, branchId, serviceId, serviceName, ... }
      setAssignedServices(currentBranchServices || []);

      // Determine services available to add
      const assignedServiceIds = (currentBranchServices || []).map(bs => bs.serviceId);
      const available = allServices.filter(s => !assignedServiceIds.includes(s.id));
      setAvailableServicesToAdd(available);

    } catch (err) {
      setError(err.message || `Failed to fetch services for branch ${selectedBranchId}.`);
      setAssignedServices([]);
      setAvailableServicesToAdd(allServices);
      console.error("Fetch assigned services error:", err);
    } finally {
      setIsLoadingServices(false);
    }
  }, [selectedBranchId, token, allServices]);

  useEffect(() => {
    fetchAssignedServicesForBranch();
  }, [fetchAssignedServicesForBranch]);


  const handleBranchSelect = (e) => {
    setSelectedBranchId(e.target.value);
  };

  const handleAddService = async (serviceIdToAdd) => {
    if (!selectedBranchId || !serviceIdToAdd) return;
    setError(null);
    try {
      const payload = { branchId: parseInt(selectedBranchId), serviceId: serviceIdToAdd };
      await createBranchServiceRelationship(payload, token);
      fetchAssignedServicesForBranch(); // Refresh the lists
    } catch (err) {
      setError(err.message || 'Failed to add service to branch.');
      console.error("Add service error:", err);
    }
  };

  const handleRemoveService = async (branchServiceRelationshipId) => {
    // This ID is the ID of the BranchService link itself
    if (!branchServiceRelationshipId) return;
    setError(null);
    try {
      await deleteBranchServiceRelationship(branchServiceRelationshipId, token);
      fetchAssignedServicesForBranch(); // Refresh the lists
    } catch (err) {
      setError(err.message || 'Failed to remove service from branch.');
      console.error("Remove service error:", err);
    }
  };

  return (
    <div className="admin-bs-management-page">
      <header className="page-header">
        <h1>Branch-Service Management</h1>
      </header>

      {error && <div className="error-message alert alert-danger">{error}</div>}

      <div className="branch-selector-container">
        <label htmlFor="branch-select">Select a Branch:</label>
        <select 
          id="branch-select" 
          value={selectedBranchId} 
          onChange={handleBranchSelect}
          disabled={isLoadingBranches}
        >
          <option value="">-- Select Branch --</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.id}>
              {branch.name} ({branch.district})
            </option>
          ))}
        </select>
        {isLoadingBranches && <span className="loading-indicator">Loading branches...</span>}
      </div>

      {selectedBranchId && (
        <div className="services-management-container">
          {isLoadingServices && <div className="loading-message">Loading services for branch...</div>}
          
          {!isLoadingServices && (
            <>
              <div className="service-list-container assigned-services">
                <h2>Services Assigned to Branch</h2>
                {assignedServices.length > 0 ? (
                  <ul>
                    {assignedServices.map(bs => ( // bs is a BranchService object
                      <li key={bs.id}> {/* Use the BranchService link's ID */}
                        <span>{bs.serviceName || allServices.find(s => s.id === bs.serviceId)?.name}</span> {/* Display serviceName from bs or lookup */}
                        <button 
                          onClick={() => handleRemoveService(bs.id)}
                          className="btn btn-danger btn-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No services currently assigned to this branch.</p>
                )}
              </div>

              <div className="service-list-container available-services">
                <h2>Available Services to Add</h2>
                {availableServicesToAdd.length > 0 ? (
                  <ul>
                    {availableServicesToAdd.map(service => (
                      <li key={service.id}>
                        <span>{service.name}</span>
                        <button 
                          onClick={() => handleAddService(service.id)}
                          className="btn btn-primary btn-sm"
                        >
                          Add
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>All available services are already assigned to this branch.</p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminBranchServiceManagementPage;