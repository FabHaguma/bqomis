// User management feature for admin
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { createUserByAdmin, updateUserByAdmin } from '../../../api/userService';
import './UserForm.scss'; // Create this SCSS file

const UserForm = ({ mode, initialData, roles, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '', // Only for create mode
    roleId: '',     // Store role ID
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setFormData({
        username: initialData.username || '',
        email: initialData.email || '', // Email likely not editable by admin
        phoneNumber: initialData.phoneNumber || '',
        password: '', // Password not edited here directly
        roleId: initialData.roleId || (roles.find(r => r.name === initialData.role)?.id || ''), // Map role name to ID if needed
      });
    } else {
      // Reset for create mode
      setFormData({ username: '', email: '', phoneNumber: '', password: '', roleId: '' });
    }
  }, [mode, initialData, roles]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'create') {
        // Backend expects role name or ID. Let's assume roleId.
        // If your backend expects role name, find it from roles list:
        // const selectedRole = roles.find(r => r.id === parseInt(formData.roleId));
        // const roleNameToSend = selectedRole ? selectedRole.name : '';
        const payload = {
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password, // Temporary password set by admin
          role: roles.find(r => r.id === parseInt(formData.roleId))?.name // Sending role name, adjust if backend needs ID
          // Or if backend expects roleId: roleId: parseInt(formData.roleId)
        };
        await createUserByAdmin(payload, token);
      } else if (mode === 'edit' && initialData?.id) {
        const payload = {
          username: formData.username,
          phoneNumber: formData.phoneNumber,
          role: roles.find(r => r.id === parseInt(formData.roleId))?.name // Sending role name
          // Or if backend expects roleId: roleId: parseInt(formData.roleId)
        };
        // Email is typically not updatable this way.
        // Password is not updated here.
        await updateUserByAdmin(initialData.id, payload, token);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || `Failed to ${mode} user.`);
      console.error(`${mode} user error:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      {error && <div className="error-message alert alert-danger">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required disabled={isSubmitting} />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required disabled={isSubmitting || mode === 'edit'} /> 
        {/* Email usually not editable after creation, or has special process */}
      </div>
      
      {mode === 'create' && (
        <div className="form-group">
          <label htmlFor="password">Temporary Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required disabled={isSubmitting} />
        </div>
      )}

      <div className="form-group">
        <label htmlFor="phoneNumber">Phone Number</label>
        <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} disabled={isSubmitting} />
      </div>

      <div className="form-group">
        <label htmlFor="roleId">Role</label>
        <select id="roleId" name="roleId" value={formData.roleId} onChange={handleChange} required disabled={isSubmitting}>
          <option value="">Select a Role</option>
          {(roles || []).filter(role => role.name === 'ADMIN' || role.name === 'STAFF').map(role => ( // Filter for assignable roles
            <option key={role.id} value={role.id}>{role.name} ({role.description || ''})</option>
          ))}
        </select>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSubmitting}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? (mode === 'create' ? 'Creating...' : 'Saving...') : (mode === 'create' ? 'Create User' : 'Save Changes')}
        </button>
      </div>
    </form>
  );
};

export default UserForm;