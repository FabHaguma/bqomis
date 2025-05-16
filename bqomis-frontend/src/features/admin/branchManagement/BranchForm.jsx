import React, { useState, useEffect } from 'react';
import { createBranch /*, updateBranch */ } from '../../../api/branchService'; // updateBranch pending backend endpoint
import { useAuth } from '../../../contexts/AuthContext';
import './BranchForm.scss';

const BranchForm = ({ mode, initialData, districts, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    districtName: '', // Stores the selected district's name
    province: '',     // Stores the province of the selected district
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth(); // Assuming your useAuth hook provides the token

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        address: initialData.address || '',
        districtName: initialData.district || '', // This is the district name
        province: initialData.province || '',
      });
    } else {
      // Reset for 'create' mode or if initialData is not provided
      setFormData({ name: '', address: '', districtName: '', province: '' });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDistrictChange = (e) => {
    const selectedDistrictName = e.target.value;
    const selectedDistrictObject = districts.find(d => d.name === selectedDistrictName);

    setFormData(prev => ({
      ...prev,
      districtName: selectedDistrictName,
      province: selectedDistrictObject ? selectedDistrictObject.province : '', // Auto-fill province
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Backend Branch entity expects: { name, address, district (string), province (string) }
    const payload = {
      name: formData.name,
      address: formData.address,
      district: formData.districtName,
      province: formData.province,
    };

    try {
      if (mode === 'create') {
        // TODO: Pass token if API requires it
        await createBranch(payload,  token);
      } else if (mode === 'edit' && initialData?.id) {
        // TODO: Implement updateBranch in branchService.js when backend endpoint is available
        // For now, simulate success for UI flow if actual update isn't ready.
        // await updateBranch(initialData.id, payload, /* token */);
        console.warn(`Update functionality for branch ID ${initialData.id} is pending backend endpoint and API service implementation.`);
        // To make UI proceed:
        // throw new Error("Update functionality is not yet implemented."); // Option 1: Show error
      }
      onSuccess(); // Call parent's success handler
    } catch (err) {
      setError(err.message || `Failed to ${mode} branch.`);
      console.error(`${mode} branch error:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="branch-form">
      {error && <div className="error-message alert alert-danger">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Branch Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address</label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="districtName">District</label>
        <select
          id="districtName"
          name="districtName" // Matches state property for selected district name
          value={formData.districtName}
          onChange={handleDistrictChange}
          required
          disabled={isSubmitting}
        >
          <option value="">Select a District</option>
          {(districts || []).map(d => ( // Ensure districts is an array
            <option key={d.id || d.name} value={d.name}> 
              {d.name} ({d.province}) {/* Show province in option for clarity */}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="province">Province</label>
        <input
          type="text"
          id="province"
          name="province"
          value={formData.province}
          // onChange={handleChange} // Typically not directly editable if tied to district
          readOnly // Province is auto-filled based on district selection
          required // Still required, but its value comes from district logic
          disabled={isSubmitting} // Also disable during submission
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create Branch' : 'Save Changes')}
        </button>
      </div>
    </form>
  );
};

export default BranchForm;