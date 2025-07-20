
### III.2. Admin Features - Branch Management (`AdminBranchManagementPage.jsx`, `BranchForm.jsx`)

*   **Purpose:** This feature allows administrators to manage bank branches within the BQOMIS system. Admins can create new branches, view a list of existing branches, edit their details (functionality planned for full implementation), and delete branches.
*   **Accessibility:** Accessed via the `/admin/branches` route, typically from a "Branch Management" link in the admin sidebar. This route is protected and requires admin authentication.

*   **Key UI Elements & Workflow (`AdminBranchManagementPage.jsx`):**

    1.  **Page Header:**
        *   Displays the title "Branch Management."
        *   Includes a "Create New Branch" button, which opens a modal containing the `BranchForm.jsx` in "create" mode.

    2.  **Branches Table:**
        *   Displays a list of all existing bank branches in a tabular format.
        *   **Columns typically include:**
            *   Branch Name
            *   Address
            *   District (Name)
            *   Province
            *   Actions
        *   If no branches exist or match filters (if filtering were implemented on this page), a "No branches found" message is shown.

    3.  **Actions per Branch Row:**
        *   **Edit Button:**
            *   Opens the `BranchForm.jsx` modal, pre-filled with the selected branch's data, in "edit" mode.
            *   *Note: Full update functionality via the API (e.g., `PUT /api/branches/{id}`) was planned for later refinement. The form structure supports edit mode, but the API call for update might be a placeholder or not yet fully implemented in the provided code iterations.*
        *   **Delete Button:**
            *   Opens a `ConfirmationDialog.jsx` to confirm the deletion of the branch.
            *   Upon confirmation, an API call to `DELETE /api/branches/{id}` (via `deleteBranch` from `branchService.js`) is made.
            *   On successful deletion, the branch list is refreshed.

    4.  **Data Fetching:**
        *   On component mount (and after successful create/delete operations), the page fetches data:
            *   `GET /api/branches` (via `getAllBranches`): Retrieves the list of all branches.
            *   `GET /api/districts` (via `getAllDistricts` from `districtService.js`): Fetches all districts. This list is passed to the `BranchForm.jsx` to populate a dropdown for selecting a branch's district, which then auto-fills the province.
        *   Loading and error states are managed and displayed.

*   **`BranchForm.jsx` (`src/features/admin/branchManagement/BranchForm.jsx`):**
    *   A reusable form component displayed within a `Modal.jsx` for both creating new branches and editing existing ones.
    *   **Props:**
        *   `mode`: String ("create" or "edit").
        *   `initialData`: Object containing branch data (used to pre-fill the form in "edit" mode).
        *   `districts`: Array of district objects for the district selection dropdown.
        *   `onSuccess`: Callback function executed after successful form submission (typically closes the modal and refreshes the branch list).
        *   `onCancel`: Callback function to close the modal without submitting.
    *   **Form Fields:**
        *   **Branch Name:** Text input, required.
        *   **Address:** Text input, required.
        *   **District:** Dropdown (`<select>`) populated with the names of available districts. Selecting a district automatically populates the Province field. Required.
        *   **Province:** Text input, read-only. Its value is derived from the selected district. Required (by virtue of district selection).
    *   **Submission Logic:**
        *   **Create Mode:**
            *   Constructs a payload: `{ name, address, district (name), province (name) }`.
            *   Makes a `POST /api/branches` API call (via `createBranch` from `branchService.js`).
        *   **Edit Mode (Structure in place, full API call pending refinement):**
            *   Constructs a similar payload with updated values.
            *   The API call to update (e.g., `PUT /api/branches/{id}`) was noted as pending full implementation in the backend and corresponding `updateBranch` function in `branchService.js`. The UI form supports pre-filling and changing values.
    *   Displays submission loading state and any errors from the API.

*   **Modals Used:**
    *   `Modal.jsx`: To host the `BranchForm.jsx`.
    *   `ConfirmationDialog.jsx`: For delete confirmations.

*   **State Management (`AdminBranchManagementPage.jsx`):**
    *   `branches`: Array to store the list of branches.
    *   `districts`: Array to store the list of districts for the form.
    *   `isLoading`, `error`: For data fetching and submission states.
    *   `isFormModalOpen`, `isDeleteConfirmOpen`: Booleans to control modal visibility.
    *   `selectedBranch`: Stores the branch object currently being edited or considered for deletion.
    *   `formMode`: String ("create" or "edit") to control `BranchForm.jsx` behavior.

*   **API Service Functions Used (from `branchService.js` and `districtService.js`):**
    *   `getAllBranches(token)`
    *   `createBranch(branchData, token)`
    *   `deleteBranch(branchId, token)`
    *   `(Future) updateBranch(branchId, branchData, token)`
    *   `getAllDistricts(token)`

*   **Key Code Snippet (`AdminBranchManagementPage.jsx` - simplified data fetching and modal trigger):**
    ```javascript
    // src/pages/admin/AdminBranchManagementPage.jsx (Illustrative)
    import React, { useState, useEffect, useCallback } from 'react';
    import { useAuth } from '../../contexts/AuthContext';
    import { getAllBranches, deleteBranch, createBranch } from '../../api/branchService';
    import { getAllDistricts } from '../../api/districtService';
    import BranchForm from '../../features/admin/branchManagement/BranchForm';
    import Modal from '../../components/common/Modal';
    // ... other imports ...

    const AdminBranchManagementPage = () => {
      const [branches, setBranches] = useState([]);
      const [districts, setDistricts] = useState([]);
      const [isLoading, setIsLoading] = useState(false);
      // ... other states: error, modal states, selectedBranch, formMode ...
      const { token } = useAuth();

      const fetchData = useCallback(async () => {
        if (!token) return;
        setIsLoading(true); /* ... */
        try {
          const [branchesData, districtsData] = await Promise.all([
            getAllBranches(token),
            getAllDistricts(token)
          ]);
          setBranches(branchesData || []);
          setDistricts(districtsData || []);
        } catch (err) { /* ... setError ... */ }
        finally { /* ... setIsLoading(false) ... */ }
      }, [token]);

      useEffect(() => { fetchData(); }, [fetchData]);

      const handleCreateNew = () => { /* ... setSelectedBranch(null), setFormMode('create'), setIsFormModalOpen(true) ... */ };
      const handleEdit = (branch) => { /* ... setSelectedBranch(branch), setFormMode('edit'), setIsFormModalOpen(true) ... */ };
      const handleDelete = (branch) => { /* ... setSelectedBranch(branch), setIsDeleteConfirmOpen(true) ... */ };
      const confirmDeleteBranch = async () => { /* ... call deleteBranch, fetchData ... */ };
      const handleFormSuccess = () => { /* ... setIsFormModalOpen(false), fetchData ... */ };

      return (
        <div className="admin-branch-management-page">
          <header className="page-header">
            <h1>Branch Management</h1>
            <button onClick={handleCreateNew}>Create New Branch</button>
          </header>
          {/* ... Error display ... */}
          {/* ... Table rendering branches with Edit/Delete buttons ... */}
          {isFormModalOpen && (
            <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={formMode === 'create' ? 'Create Branch' : 'Edit Branch'}>
              <BranchForm
                mode={formMode}
                initialData={selectedBranch}
                districts={districts}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsFormModalOpen(false)}
              />
            </Modal>
          )}
          {/* ... ConfirmationDialog for delete ... */}
        </div>
      );
    };
    export default AdminBranchManagementPage;
    ```

This feature provides administrators with the essential tools to manage the bank's branch network, which is fundamental to the BQOMIS system's operation. The use of a reusable form component and modals ensures a consistent UI for these management tasks.