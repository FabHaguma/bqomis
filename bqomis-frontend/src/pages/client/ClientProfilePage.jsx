// src/pages/client/ClientProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile, changePassword } from '../../api/userService';
import Modal from '../../components/common/Modal'; // Re-use if suitable for change password
import ConfirmationDialog from '../../components/common/ConfirmationDialog'; // For account deletion
import './ClientProfilePage.scss'; // Create this SCSS file

const ClientProfilePage = () => {
  const { user, token, logout, refreshUserContext } = useAuth(); // Assume refreshUserContext updates user in AuthContext
  const navigate = useNavigate();

  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState('');


  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        phoneNumber: user.phoneNumber || '',
      });
    } else {
      // If user is somehow null but page is accessed, redirect or show error
      navigate('/signin');
    }
  }, [user, navigate]);

  if (!user) {
    return <div className="loading-message">Loading profile...</div>; // Or redirect
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setProfileError(null);
    setProfileSuccess('');
    try {
      await updateUserProfile(user.id, { 
        username: formData.username, 
        phoneNumber: formData.phoneNumber 
        // Note: Backend should only update these fields. Email/Role shouldn't be sent or updatable here.
      }, token);
      
      // Refresh user in AuthContext & localStorage
      if (refreshUserContext) { // Check if function exists
          await refreshUserContext(); // This function should refetch user from backend and update context
      } else {
          // Fallback: Manually update parts of user in context - less ideal
          // This part depends heavily on how your AuthContext is structured.
          // For now, we assume refreshUserContext handles it.
          console.warn("refreshUserContext not found in AuthContext. User details in context might be stale.");
      }

      setProfileSuccess('Profile updated successfully!');
      setIsEditMode(false);
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setIsLoading(true);
    setPasswordError(null);
    setPasswordSuccess('');
    try {
      await changePassword({
        email: user.email, // Backend needs email to identify user for password change
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, token);
      setPasswordSuccess('Password changed successfully! Please log in again.');
      setIsPasswordModalOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
      // Force logout after password change for security
      setTimeout(() => {
        logout(); // from useAuth
        navigate('/signin');
      }, 2000);
    } catch (err) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    // Placeholder: Actual deletion is a serious operation
    // For now, just show a message or log.
    // If implementing: Call deleteUserAccount API, then logout & redirect.
    console.log("Account deletion requested for user:", user.id);
    alert("Account deletion functionality is not yet fully implemented in the frontend. This action would permanently delete your account.");
    setIsDeleteConfirmOpen(false);
    // If implemented:
    // try { await deleteUserAccount(user.id, token); logout(); navigate('/'); } catch (err) { setProfileError(...) }
  };


  return (
    <div className="client-profile-page">
      <header className="page-header">
        <h1>My Profile</h1>
      </header>

      {profileError && <div className="error-message alert alert-danger">{profileError}</div>}
      {profileSuccess && <div className="success-message alert alert-success">{profileSuccess}</div>}

      <div className="profile-section profile-info-section">
        <h2>Account Information</h2>
        <div className="profile-picture-placeholder">
            {/* Placeholder for profile picture */}
            <span className="initials">{user.username ? user.username.charAt(0).toUpperCase() : '?'}</span>
        </div>

        <form onSubmit={handleProfileUpdate}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username} 
              onChange={handleInputChange} 
              disabled={!isEditMode || isLoading}
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" value={user.email || ''} readOnly disabled />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input 
              type="tel" 
              id="phoneNumber" 
              name="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={handleInputChange} 
              disabled={!isEditMode || isLoading} 
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <input type="text" id="role" value={user.role || ''} readOnly disabled />
          </div>

          {isEditMode ? (
            <div className="form-actions">
              <button type="button" onClick={() => { setIsEditMode(false); setFormData({ username: user.username, phoneNumber: user.phoneNumber }); setProfileError(null);}} className="btn btn-secondary" disabled={isLoading}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsEditMode(true)} className="btn btn-primary">Edit Profile</button>
          )}
        </form>
      </div>

      <div className="profile-section security-section">
        <h2>Security</h2>
        <button onClick={() => setIsPasswordModalOpen(true)} className="btn btn-secondary">Change Password</button>
        <button onClick={() => setIsDeleteConfirmOpen(true)} className="btn btn-danger btn-delete-account">Delete Account</button>
      </div>
      
      <div className="profile-section quick-links-section">
        <h2>Quick Links</h2>
        <ul>
            <li><Link to="/client/appointments">My Appointments</Link></li>
            <li><Link to="/client/branches">Book New Appointment</Link></li>
        </ul>
      </div>


      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <Modal 
          isOpen={isPasswordModalOpen} 
          onClose={() => {setIsPasswordModalOpen(false); setPasswordError(null);}} 
          title="Change Password"
        >
          <form onSubmit={handleChangePassword} className="password-change-form">
            {passwordError && <div className="error-message alert alert-danger">{passwordError}</div>}
            {passwordSuccess && <div className="success-message alert alert-success">{passwordSuccess}</div>}
            
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password:</label>
              <input type="password" id="currentPassword" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} required disabled={isLoading || !!passwordSuccess} />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} required disabled={isLoading || !!passwordSuccess}/>
            </div>
            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password:</label>
              <input type="password" id="confirmNewPassword" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handlePasswordInputChange} required disabled={isLoading || !!passwordSuccess}/>
            </div>
            {!passwordSuccess && 
                <div className="form-actions">
                    <button type="button" onClick={() => {setIsPasswordModalOpen(false); setPasswordError(null);}} className="btn btn-secondary" disabled={isLoading}>Cancel</button>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Changing...' : 'Change Password'}
                    </button>
                </div>
            }
          </form>
        </Modal>
      )}

      {/* Delete Account Confirmation */}
      {isDeleteConfirmOpen && (
        <ConfirmationDialog
          isOpen={isDeleteConfirmOpen}
          title="Confirm Account Deletion"
          message="Are you absolutely sure you want to delete your account? This action cannot be undone."
          onConfirm={handleDeleteAccount}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          confirmButtonText="Yes, Delete My Account"
          confirmButtonVariant="danger"
        />
      )}
    </div>
  );
};

export default ClientProfilePage;