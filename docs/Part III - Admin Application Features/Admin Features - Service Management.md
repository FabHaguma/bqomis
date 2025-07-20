
### III.3. Admin Features - Service Management (`AdminServiceManagementPage.jsx`, `ServiceForm.jsx`)

*   **Purpose:** This feature enables administrators to manage the various banking services offered by the institution (e.g., "Account Opening," "Loan Application," "Cash Deposit," "Withdrawal"). Admins can create new services, view existing ones, edit their details (functionality planned for full implementation), and delete services. These defined services are then available to be linked to specific branches via the Branch-Service Relationship Management feature.
*   **Accessibility:** Accessed via the `/admin/services` route, typically from a "Service Management" link in the admin sidebar. This route is protected and requires admin authentication.

*   **Key UI Elements & Workflow (`AdminServiceManagementPage.jsx`):**

    1.  **Page Header:**
        *   Displays the title "Service Management."
        *   Includes a "Create New Service" button, which opens a modal containing the `ServiceForm.jsx` in "create" mode.

    2.  **Services Table:**
        *   Displays a list of all available banking services in a tabular format.
        *   **Columns typically include:**
            *   Service ID
            *   Service Name
            *   Description
            *   Actions
        *   If no services exist, a "No services found" message is shown.

    3.  **Actions per Service Row:**
        *   **Edit Button:**
            *   Opens the `ServiceForm.jsx` modal, pre-filled with the selected service's data, in "edit" mode.
            *   *Note: Full update functionality via an API (e.g., `PUT /api/services/{id}`) was planned for later refinement. The form structure supports edit mode.*
        *   **Delete Button:**
            *   Opens a `ConfirmationDialog.jsx` to confirm the deletion of the service.
            *   Upon confirmation, an API call to `DELETE /api/services/{id}` (via `deleteService` from `serviceService.js`) is made.
            *   On successful deletion, the service list is refreshed.

    4.  **Data Fetching:**
        *   On component mount (and after successful create/delete operations), the page fetches data:
            *   `GET /api/services` (via `getAllServices` from `serviceService.js`): Retrieves the list of all services.
        *   Loading and error states are managed and displayed.

*   **`ServiceForm.jsx` (`src/features/admin/serviceManagement/ServiceForm.jsx`):**
    *   A reusable form component displayed within a `Modal.jsx` for both creating new services and editing existing ones.
    *   **Props:**
        *   `mode`: String ("create" or "edit").
        *   `initialData`: Object containing service data (used to pre-fill the form in "edit" mode).
        *   `onSuccess`: Callback function executed after successful form submission.
        *   `onCancel`: Callback function to close the modal without submitting.
    *   **Form Fields:**
        *   **Service Name:** Text input, required.
        *   **Description:** Textarea, required, for a more detailed explanation of the service.
    *   **Submission Logic:**
        *   **Create Mode:**
            *   Constructs a payload: `{ name, description }`.
            *   Makes a `POST /api/services` API call (via `createService` from `serviceService.js`).
        *   **Edit Mode (Structure in place, API call pending refinement):**
            *   Constructs a similar payload with updated values.
            *   The API call to update (e.g., `PUT /api/services/{id}`) and the corresponding `updateService` function in `serviceService.js` were noted as pending full implementation.
    *   Displays submission loading state and any errors from the API.

*   **Modals Used:**
    *   `Modal.jsx`: To host the `ServiceForm.jsx`.
    *   `ConfirmationDialog.jsx`: For delete confirmations.

*   **State Management (`AdminServiceManagementPage.jsx`):**
    *   `services`: Array to store the list of services.
    *   `isLoading`, `error`: For data fetching and submission states.
    *   `isFormModalOpen`, `isDeleteConfirmOpen`: Booleans to control modal visibility.
    *   `selectedService`: Stores the service object currently being edited or considered for deletion.
    *   `formMode`: String ("create" or "edit") to control `ServiceForm.jsx` behavior.

*   **API Service Functions Used (from `serviceService.js`):**
    *   `getAllServices(token)`
    *   `createService(serviceData, token)`
    *   `deleteService(serviceId, token)`
    *   `(Future) updateService(serviceId, serviceData, token)`

*   **Key Code Snippet (`AdminServiceManagementPage.jsx` - simplified structure):**
    ```javascript
    // src/pages/admin/AdminServiceManagementPage.jsx (Illustrative)
    import React, { useState, useEffect, useCallback } from 'react';
    import { useAuth } from '../../contexts/AuthContext';
    import { getAllServices, deleteService, createService } from '../../api/serviceService';
    import ServiceForm from '../../features/admin/serviceManagement/ServiceForm';
    import Modal from '../../components/common/Modal';
    // ... other imports ...

    const AdminServiceManagementPage = () => {
      const [services, setServices] = useState([]);
      // ... other states: isLoading, error, modal states, selectedService, formMode ...
      const { token } = useAuth();

      const fetchData = useCallback(async () => {
        if (!token) return;
        // ... setIsLoading, setError(null) ...
        try {
          const servicesData = await getAllServices(token);
          setServices(servicesData || []);
        } catch (err) { /* ... setError ... */ }
        finally { /* ... setIsLoading(false) ... */ }
      }, [token]);

      useEffect(() => { fetchData(); }, [fetchData]);

      const handleCreateNew = () => { /* ... setSelectedService(null), setFormMode('create'), setIsFormModalOpen(true) ... */ };
      const handleEdit = (service) => { /* ... setSelectedService(service), setFormMode('edit'), setIsFormModalOpen(true) ... */ };
      const handleDelete = (service) => { /* ... setSelectedService(service), setIsDeleteConfirmOpen(true) ... */ };
      const confirmDeleteService = async () => { /* ... call deleteService, fetchData ... */ };
      const handleFormSuccess = () => { /* ... setIsFormModalOpen(false), fetchData ... */ };

      return (
        <div className="admin-service-management-page">
          <header className="page-header">
            <h1>Service Management</h1>
            <button onClick={handleCreateNew}>Create New Service</button>
          </header>
          {/* ... Error display ... */}
          {/* ... Table rendering services with Edit/Delete buttons ... */}
          {isFormModalOpen && (
            <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={formMode === 'create' ? 'Create Service' : 'Edit Service'}>
              <ServiceForm
                mode={formMode}
                initialData={selectedService}
                onSuccess={handleFormSuccess}
                onCancel={() => setIsFormModalOpen(false)}
              />
            </Modal>
          )}
          {/* ... ConfirmationDialog for delete ... */}
        </div>
      );
    };
    export default AdminServiceManagementPage;
    ```

This feature allows administrators to define the portfolio of services the bank offers, which is a prerequisite for linking services to branches and for clients to book appointments. The implementation follows the established CRUD pattern used for Branch Management, ensuring consistency in the admin interface.