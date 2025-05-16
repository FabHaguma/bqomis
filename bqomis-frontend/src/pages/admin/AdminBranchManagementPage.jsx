import React, { useState, useEffect, useCallback } from 'react';
import { getAllBranches, deleteBranch } from '../../api/branchService';
import { getAllDistricts } from '../../api/districtService';
import { useAuth } from '../../contexts/AuthContext'; // To get the token if needed
import BranchForm from '../../features/admin/branchManagement/BranchForm';
import Modal from '../../components/common/Modal'; // A generic Modal component
import ConfirmationDialog from '../../components/common/ConfirmationDialog'; // A generic confirmation dialog
import './AdminBranchManagementPage.scss'; // For styling

const AdminBranchManagementPage = () => {
  const [branches, setBranches] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const [selectedBranch, setSelectedBranch] = useState(null); // For editing or deleting
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'

  const { token } = useAuth(); // Assuming your useAuth hook provides the token

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Pass token if API requires it
      const branchesData = await getAllBranches(token);
      const districtsData = await getAllDistricts(token);
      setBranches(branchesData || []); // Ensure it's an array even if API returns null/undefined
      setDistricts(districtsData || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch data.');
      setBranches([]); // Clear branches on error
      setDistricts([]);
      console.error("Fetch data error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token]); // [/*token*/]Add token to dependency array if it's used and can change

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateNew = () => {
    setSelectedBranch(null);
    setFormMode('create');
    setIsFormModalOpen(true);
  };

  const handleEdit = (branch) => {
    setSelectedBranch(branch);
    setFormMode('edit');
    setIsFormModalOpen(true);
  };

  const handleDelete = (branch) => {
    setSelectedBranch(branch);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteBranch = async () => {
    if (!selectedBranch || !selectedBranch.id) return;
    try {
      // TODO: Pass token if API requires it
      await deleteBranch(selectedBranch.id, /*token*/);
      setIsDeleteConfirmOpen(false);
      setSelectedBranch(null);
      fetchData(); // Refresh the list
    } catch (err) {
      setError(err.message || 'Failed to delete branch.');
      console.error("Delete branch error:", err);
      // Keep delete confirm open or close and show error in main page?
      // For now, let it close and show error on main page.
      setIsDeleteConfirmOpen(false); 
    }
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    fetchData(); // Refresh data after successful form submission
  };

  if (isLoading) {
    return <div className="loading-message">Loading branches...</div>;
  }

  return (
    <div className="admin-branch-management-page">
      <header className="page-header">
        <h1>Branch Management</h1>
        <button onClick={handleCreateNew} className="btn btn-primary">
          Create New Branch
        </button>
      </header>

      {error && <div className="error-message alert alert-danger">{error}</div>}

      <div className="branches-table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>District</th>
              <th>Province</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {branches.length > 0 ? (
              branches.map((branch) => (
                <tr key={branch.id}>
                  <td>{branch.name}</td>
                  <td>{branch.address}</td>
                  <td>{branch.district}</td> {/* Assuming district is a string name */}
                  <td>{branch.province}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(branch)} 
                      className="btn btn-secondary btn-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(branch)} 
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No branches found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isFormModalOpen && (
        <Modal 
            isOpen={isFormModalOpen} 
            onClose={() => setIsFormModalOpen(false)}
            title={formMode === 'create' ? 'Create New Branch' : 'Edit Branch'}
        >
          <BranchForm
            mode={formMode}
            initialData={selectedBranch}
            districts={districts} // Pass districts for the dropdown
            onSuccess={handleFormSuccess}
            onCancel={() => setIsFormModalOpen(false)}
            // Pass token if BranchForm makes API calls directly or use a passed in onSubmit function
            // onSubmit={handleBranchFormSubmit} // Alternative approach
          />
        </Modal>
      )}

      {isDeleteConfirmOpen && selectedBranch && (
        <ConfirmationDialog
          isOpen={isDeleteConfirmOpen}
          title="Confirm Deletion"
          message={`Are you sure you want to delete the branch "${selectedBranch.name}"?`}
          onConfirm={confirmDeleteBranch}
          onCancel={() => setIsDeleteConfirmOpen(false)}
          confirmButtonText="Delete"
          confirmButtonVariant="danger"
        />
      )}
    </div>
  );
};

export default AdminBranchManagementPage;