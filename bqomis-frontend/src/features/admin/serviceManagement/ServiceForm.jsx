import React, { useState, useEffect } from 'react';
import { createService /*, updateService */ } from '../../../api/serviceService';
import { useAuth } from '../../../contexts/AuthContext';
import './ServiceForm.scss'; // Create this SCSS file

const ServiceForm = ({ mode, initialData, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
      });
    } else {
      setFormData({ name: '', description: '' });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const payload = {
      name: formData.name,
      description: formData.description,
    };

    try {
      if (mode === 'create') {
        await createService(payload, token);
      } else if (mode === 'edit' && initialData?.id) {
        // await updateService(initialData.id, payload, token); // For future update
        console.warn(`Update functionality for service ID ${initialData.id} is pending.`);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || `Failed to ${mode} service.`);
      console.error(`${mode} service error:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="service-form">
      {error && <div className="error-message alert alert-danger">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="name">Service Name</label>
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
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="4"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSubmitting}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create Service' : 'Save Changes')}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;