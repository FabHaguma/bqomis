
### II.6. Client Features - My Profile Page (`ClientProfilePage.jsx`)

*   **Purpose:** The `ClientProfilePage.jsx` allows authenticated clients to view and manage their personal information, change their password, and access quick links to other parts of the application. It serves as the central hub for account-related settings.
*   **Accessibility:** Accessible via the `/client/profile` route, typically linked from the client home page or main client navigation. This route is protected and requires client authentication.

*   **Key UI Elements & Functionality:**

    1.  **Display User Information:**
        *   **Profile Picture Placeholder:** A visual placeholder (e.g., using the user's initials) is displayed. Full profile picture upload functionality was considered but deferred for this version.
        *   **Username:** Displays the user's current username. Editable when in "Edit Mode."
        *   **Email:** Displays the user's email address. This field is read-only as email changes often involve more complex verification processes.
        *   **Phone Number:** Displays the user's phone number. Editable when in "Edit Mode."
        *   **Role:** Displays the user's role (e.g., "CLIENT"). This field is read-only.

    2.  **Profile Editing Mode:**
        *   An "Edit Profile" button toggles the page into an editable state.
        *   In edit mode:
            *   Username and Phone Number fields become editable inputs.
            *   "Save Changes" and "Cancel" buttons appear.
        *   **Saving Changes:**
            *   Upon clicking "Save Changes," client-side validation (if any) is performed.
            *   An API call is made to `PUT /api/users/{id}` (or `PATCH`, using `updateUserProfile` from `userService.js`) with the updated `username` and `phoneNumber`.
            *   On success:
                *   A success message is shown.
                *   The `refreshUserContext` function from `AuthContext` is called to ensure the global user state (and `localStorage`) is updated with the new details. This ensures changes are reflected immediately across the application (e.g., in the `TopNav` greeting).
                *   The page exits edit mode.
            *   On failure, an error message is displayed.
        *   **Cancelling Edit:** Reverts any changes made in the form fields and exits edit mode.

    3.  **Security Section:**
        *   **Change Password:**
            *   A "Change Password" button opens a modal (`Modal.jsx`).
            *   The modal contains a form with fields for: "Current Password," "New Password," and "Confirm New Password."
            *   **Submission:**
                *   Client-side validation checks if new passwords match and meet any complexity requirements (e.g., minimum length).
                *   An API call is made to `POST /api/users/change-password` (via `changePassword` from `userService.js`). The payload includes `email` (of the current user), `oldPassword`, and `newPassword`.
                *   On success:
                    *   A success message is displayed in the modal.
                    *   The user is automatically logged out (by calling `logout()` from `AuthContext`) and redirected to the `SignInPage` after a short delay. This is a security measure to ensure the new password takes effect for the session.
                *   On failure (e.g., incorrect current password, new password doesn't meet backend criteria), an error message is shown in the modal.
        *   **Delete Account:**
            *   A "Delete Account" button.
            *   Clicking it opens a `ConfirmationDialog.jsx` with a strong warning about the permanency of the action.
            *   **Current Implementation:** This is a placeholder action. If fully implemented, confirming would trigger an API call to a backend endpoint to delete the user account, followed by logout and redirection. *Actual deletion API call is not implemented in the provided frontend code.*

    4.  **Quick Links Section:**
        *   Provides convenient navigation links to other relevant client pages:
            *   "My Appointments" (links to `/client/appointments`).
            *   "Book New Appointment" (links to `/client/branches`).

*   **State Management:**
    *   `isEditMode`: Boolean to toggle between view and edit states for profile information.
    *   `formData`: Object to hold editable profile field values (`username`, `phoneNumber`).
    *   `passwordData`: Object for the change password form inputs.
    *   `isPasswordModalOpen`, `isDeleteConfirmOpen`: Booleans for modal visibility.
    *   Various `isLoading`, `Error`, and `Success` states for profile updates and password changes.

*   **Context Usage:**
    *   `useAuth()`: To get the current `user` details, `token` for API calls, `logout` function, and the crucial `refreshUserContext` function.

*   **Key Code Snippet (`ClientProfilePage.jsx` - illustrating edit mode and password change modal trigger):**
    ```javascript
    // src/pages/client/ClientProfilePage.jsx (Illustrative Structure)
    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { useAuth } from '../../contexts/AuthContext';
    import { updateUserProfile, changePassword } from '../../api/userService';
    import Modal from '../../components/common/Modal';
    // import './ClientProfilePage.scss';

    const ClientProfilePage = () => {
      const { user, token, logout, refreshUserContext } = useAuth();
      const [isEditMode, setIsEditMode] = useState(false);
      const [formData, setFormData] = useState({ username: '', phoneNumber: '' });
      const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
      // ... other states for password form, errors, successes, loading ...

      useEffect(() => {
        if (user) {
          setFormData({ username: user.username || '', phoneNumber: user.phoneNumber || '' });
        }
        // ... redirect if !user ...
      }, [user]);

      const handleProfileUpdate = async (e) => {
        e.preventDefault();
        // ... setIsLoading, clear errors ...
        try {
          await updateUserProfile(user.id, formData, token);
          if (refreshUserContext) await refreshUserContext();
          // ... setSuccess, setIsEditMode(false) ...
        } catch (err) { /* ... setError ... */ }
        finally { /* ... setIsLoading(false) ... */ }
      };

      const handleChangePassword = async (e) => {
        e.preventDefault();
        // ... validation, setIsLoading, clear errors ...
        try {
          await changePassword({ email: user.email, /* ...passwordData */ }, token);
          // ... setSuccess, close modal, prepare for logout ...
          setTimeout(() => { logout(); navigate('/signin'); }, 2000);
        } catch (err) { /* ... setPasswordError ... */ }
        finally { /* ... setIsLoading(false) ... */ }
      };
      
      if (!user) return <p>Loading...</p>;

      return (
        <div className="client-profile-page">
          <header className="page-header"><h1>My Profile</h1></header>
          {/* ... Profile Info Section with form and edit/save buttons ... */}
          {/* Display user.email (read-only), user.role (read-only) */}
          {/* Inputs for formData.username, formData.phoneNumber (editable in isEditMode) */}
          
          <div className="profile-section security-section">
            <h2>Security</h2>
            <button onClick={() => setIsPasswordModalOpen(true)}>Change Password</button>
            {/* ... Delete Account button ... */}
          </div>

          <div className="profile-section quick-links-section">
            <h2>Quick Links</h2>
            {/* ... Links to My Appointments, Book New ... */}
          </div>

          {isPasswordModalOpen && (
            <Modal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} title="Change Password">
              <form onSubmit={handleChangePassword}>
                {/* ... Password form fields ... */}
                <button type="submit">Change Password</button>
              </form>
            </Modal>
          )}
          {/* ... ConfirmationDialog for delete ... */}
        </div>
      );
    };
    export default ClientProfilePage;
    ```

This page empowers clients to manage their own account details and security settings within BQOMIS, ensuring their information is up-to-date and their account remains secure. The integration with `AuthContext` for refreshing user details is key for a seamless UX.