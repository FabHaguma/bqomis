// src/pages/admin/AdminUserManagementPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getAdminAndStaffUsers, deleteUserById, getAllRoles } from '../../api/userService';
import UserForm from '../../features/admin/userManagement/UserForm';
import Modal from '../../components/common/Modal';
import ConfirmationDialog from '../../components/common/ConfirmationDialog';
import './AdminUserManagementPage.scss'; // Create this SCSS file

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]); // To pass to UserForm
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState('create');

  const { token, user: adminUser } = useAuth(); // Get current admin user to prevent self-delete UI

  const fetchData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const [usersData, rolesData] = await Promise.all([
        getAdminAndStaffUsers(token),
        getAllRoles(token)
      ]);
      setUsers(usersData || []);
      setRoles(rolesData || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch data.');
      console.error("Fetch user/roles error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateNew = () => {
    setSelectedUser(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleEdit = (userToEdit) => {
    // Map user.role (string) to roleId for the form, if initialData expects roleId
    // User object from backend has: { id, username, email, phoneNumber, role }
    // Role object from backend has: { id, name, description }
    const roleObject = roles.find(r => r.name === userToEdit.role);
    setSelectedUser({...userToEdit, roleId: roleObject ? roleObject.id : '' });
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDelete = (userToDelete) => {
    if (adminUser && userToDelete.id === adminUser.id) {
        alert("You cannot delete your own account from this interface.");
        return;
    }
    setSelectedUser(userToDelete);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!selectedUser || !selectedUser.id) return;
    try {
      await deleteUserById(selectedUser.id, token);
      setIsDeleteConfirmOpen(false);
      setSelectedUser(null);
      fetchData(); // Refresh the list
    } catch (err) {
      setError(err.message || 'Failed to delete user.');
      console.error("Delete user error:", err);
      setIsDeleteConfirmOpen(false);
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    fetchData();
  };

  if (isLoading) {
    return <div className="loading-message">Loading users...</div>;
  }

  return (
    <div className="admin-user-management-page">
      <header className="page-header">
        <h1>User Management (Staff & Admins)</h1>
        <button onClick={handleCreateNew} className="btn btn-primary">
          Create New User
        </button>
      </header>

      {error && <div className="error-message alert alert-danger">{error}</div>}

      <div className="users-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.phoneNumber || 'N/A'}</td>
                  <td>{u.role}</td> {/* Assuming role is a string name from backend User DTO */}
                  <td>
                    <button onClick={() => handleEdit(u)} className="btn btn-secondary btn-sm">Edit</button>
                    <button 
                        onClick={() => handleDelete(u)} 
                        className="btn btn-danger btn-sm"
                        disabled={adminUser && u.id === adminUser.id} // Disable delete for self
                    >
                        Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No staff or admin users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormModalOpen && (
        <Modal 
            isOpen={isFormModalOpen} 
            onClose={() => setIsFormModalOpen(false)}
            title={formMode === 'create' ? 'Create New User' : 'Edit User'}
        >
          <UserForm
            mode={formMode}
            initialData={selectedUser}
            roles={roles} // Pass all roles for the dropdown
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormModalOpen(false)}
          />
        </Modal>
      )}

      {isDeleteConfirmOpen && selectedUser && (
        <ConfirmationDialog
          isOpen={isDeleteConfirmOpen}
          title="Confirm User Deletion"
          message={`Are you sure you want to delete the user "${selectedUser.username}" (${selectedUser.email})?`}
          onConfirm={confirmDeleteUser}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          confirmButtonText="Delete User"
          confirmButtonVariant="danger"
        />
      )}
    </div>
  );
};

export default AdminUserManagementPage;