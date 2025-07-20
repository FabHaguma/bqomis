
### III.5. Admin Features - User Management (`AdminUserManagementPage.jsx`, `UserForm.jsx`)

*   **Purpose:** This feature provides administrators with the tools to manage user accounts within the BQOMIS system, specifically focusing on users with "STAFF" and "ADMIN" roles. Client accounts are typically self-registered. Admins can create new staff/admin users, view a list of these users, edit their details (like username, phone number, and role), and delete user accounts.
*   **Accessibility:** Accessed via the `/admin/users` route, linked from the "User Management" item in the admin sidebar. This route is protected and requires admin authentication.

*   **Key UI Elements & Workflow (`AdminUserManagementPage.jsx`):**

    1.  **Page Header:**
        *   Displays the title "User Management (Staff & Admins)."
        *   Includes a "Create New User" button, which opens a modal containing the `UserForm.jsx` in "create" mode.

    2.  **Users Table:**
        *   Displays a list of users, filtered to show only those with "STAFF" or "ADMIN" roles.
        *   **Columns typically include:**
            *   User ID
            *   Username
            *   Email
            *   Phone Number
            *   Role (e.g., "STAFF", "ADMIN")
            *   Actions
        *   If no users match the criteria, a "No staff or admin users found" message is shown.

    3.  **Actions per User Row:**
        *   **Edit Button:**
            *   Opens the `UserForm.jsx` modal, pre-filled with the selected user's data, in "edit" mode.
            *   Admins can typically modify username, phone number, and role. Email is usually not editable directly by an admin for an existing user. Password changes are handled separately or not directly by admins (except initial password for new users).
        *   **Delete Button:**
            *   Opens a `ConfirmationDialog.jsx` to confirm user deletion.
            *   An admin cannot delete their own account via this interface (the delete button is disabled for the currently logged-in admin's row).
            *   Upon confirmation, an API call to `DELETE /api/users/{id}` (via `deleteUserById` from `userService.js`) is made.
            *   On successful deletion, the user list is refreshed.

    4.  **Data Fetching:**
        *   On component mount (and after successful create/edit/delete operations):
            *   `GET /api/users?roles=STAFF,ADMIN` (via `getAdminAndStaffUsers`): Retrieves the list of users filtered by these roles.
            *   `GET /api/roles` (via `getAllRoles`): Fetches all available system roles (e.g., ADMIN, STAFF, CLIENT). This list is passed to the `UserForm.jsx` to populate a dropdown for role assignment, though the form filters it further to only show assignable admin/staff roles.
        *   Loading and error states are managed.

*   **`UserForm.jsx` (`src/features/admin/userManagement/UserForm.jsx`):**
    *   A reusable form component displayed within a `Modal.jsx` for creating and editing staff/admin users.
    *   **Props:**
        *   `mode`: String ("create" or "edit").
        *   `initialData`: Object containing user data (for pre-filling in "edit" mode). It's important that this `initialData` (derived from the selected user) correctly maps the user's current role name to a `roleId` if the form uses `roleId` for the select input.
        *   `roles`: Array of all role objects (`{id, name, description}`) for the role selection dropdown.
        *   `onSuccess`, `onCancel`: Callback functions.
    *   **Form Fields:**
        *   **Username:** Text input, required.
        *   **Email:** Email input, required. Read-only in "edit" mode.
        *   **Temporary Password:** (Only in "create" mode) Password input, required. Admins set an initial temporary password.
        *   **Phone Number:** Text input (tel type).
        *   **Role:** Dropdown (`<select>`) populated with "STAFF" and "ADMIN" roles from the `roles` prop. Required.
    *   **Submission Logic:**
        *   **Create Mode:**
            *   Constructs a payload: `{ username, email, phoneNumber, password, role (name or ID, as expected by backend) }`. The current implementation sends the role *name*.
            *   Makes a `POST /api/users` API call (via `createUserByAdmin` from `userService.js`).
        *   **Edit Mode:**
            *   Constructs a payload with fields allowed for update: `{ username, phoneNumber, role (name or ID) }`.
            *   Makes a `PATCH /api/users/{id}` API call (via `updateUserByAdmin`).
    *   Displays submission loading state and any API errors.

*   **Modals Used:**
    *   `Modal.jsx`: To host the `UserForm.jsx`.
    *   `ConfirmationDialog.jsx`: For delete confirmations.

*   **State Management (`AdminUserManagementPage.jsx`):**
    *   `users`: Array for the list of staff/admin users.
    *   `roles`: Array for all system roles.
    *   `isLoading`, `error`, modal visibility states, `selectedUser`, `formMode`.

*   **API Service Functions Used (from `userService.js`):**
    *   `getAdminAndStaffUsers(token)`
    *   `getAllRoles(token)`
    *   `createUserByAdmin(userData, token)`
    *   `updateUserByAdmin(userId, userData, token)`
    *   `deleteUserById(userId, token)`

*   **Key Code Snippet (`AdminUserManagementPage.jsx` - simplified):**
    ```javascript
    // src/pages/admin/AdminUserManagementPage.jsx (Illustrative)
    import React, { useState, useEffect, useCallback } from 'react';
    import { useAuth } from '../../contexts/AuthContext';
    import { getAdminAndStaffUsers, deleteUserById, getAllRoles } from '../../api/userService';
    import UserForm from '../../features/admin/userManagement/UserForm';
    // ... Modal, ConfirmationDialog imports ...

    const AdminUserManagementPage = () => {
      const [users, setUsers] = useState([]);
      const [roles, setRoles] = useState([]);
      // ... other states (isLoading, error, modals, selectedUser, formMode) ...
      const { token, user: currentAdminUser } = useAuth();

      const fetchData = useCallback(async () => {
        if (!token) return;
        // ... setIsLoading, setError ...
        try {
          const [usersData, rolesData] = await Promise.all([
            getAdminAndStaffUsers(token),
            getAllRoles(token)
          ]);
          setUsers(usersData || []);
          setRoles(rolesData || []);
        } catch (err) { /* ... setError ... */ }
        finally { /* ... setIsLoading(false) ... */ }
      }, [token]);

      useEffect(() => { fetchData(); }, [fetchData]);

      const handleEdit = (userToEdit) => {
        const roleObject = roles.find(r => r.name === userToEdit.role);
        setSelectedUser({...userToEdit, roleId: roleObject ? roleObject.id : '' });
        setFormMode('edit');
        setIsFormModalOpen(true);
      };
      
      const handleDelete = (userToDelete) => {
        if (currentAdminUser && userToDelete.id === currentAdminUser.id) {
            alert("Cannot delete self."); return;
        }
        // ... open confirmation dialog ...
      };
      // ... handleCreateNew, confirmDeleteUser, handleFormSuccess ...

      return (
        <div className="admin-user-management-page">
          <header className="page-header">
            <h1>User Management (Staff & Admins)</h1>
            <button onClick={handleCreateNew}>Create New User</button>
          </header>
          {/* ... Error display ... */}
          {/* ... Table rendering users with Edit/Delete buttons (disable delete for self) ... */}
          {isFormModalOpen && (
            <Modal /* ... */ title={formMode === 'create' ? 'Create User' : 'Edit User'}>
              <UserForm
                mode={formMode}
                initialData={selectedUser}
                roles={roles}
                onSuccess={/* ... */}
                onCancel={/* ... */}
              />
            </Modal>
          )}
          {/* ... ConfirmationDialog for delete ... */}
        </div>
      );
    };
    export default AdminUserManagementPage;
    ```

This feature ensures that administrators can effectively manage the accounts and roles of personnel who will operate or oversee the BQOMIS system, distinct from the client users who self-register. The use of role filtering (`?roles=STAFF,ADMIN`) in the API call is key to focusing this page on relevant user types.