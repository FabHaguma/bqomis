
### III.4. Admin Features - Branch-Service Relationships (`AdminBranchServiceManagementPage.jsx`)

*   **Purpose:** This crucial feature allows administrators to define which banking services are offered at which specific bank branches. It manages the many-to-many relationship between branches and services, effectively controlling the service catalog available to clients when they select a particular branch.
*   **Accessibility:** Accessed via the `/admin/branch-services` route, typically from a "Branch Services" link in the admin sidebar. This route is protected and requires admin authentication.

*   **Key UI Elements & Workflow (`AdminBranchServiceManagementPage.jsx`):**

    1.  **Page Header:**
        *   Displays the title "Branch-Service Management."

    2.  **Branch Selector:**
        *   A dropdown menu allows the admin to select a specific branch for which they want to manage service assignments.
        *   The dropdown is populated by fetching all branches using `GET /api/branches`.

    3.  **Service Management Area (Displays once a branch is selected):**
        *   This area is typically divided into two main lists or sections:
            *   **Assigned Services:**
                *   Lists all services currently assigned to (offered by) the selected branch.
                *   Each item displays the service name.
                *   Next to each assigned service, a "Remove" button is provided.
            *   **Available Services to Add:**
                *   Lists all services that exist in the system but are *not* currently assigned to the selected branch.
                *   Each item displays the service name.
                *   Next to each available service, an "Add" button is provided.
        *   If no services are assigned or no services are available to add, appropriate messages are displayed.

    4.  **Data Fetching and Processing:**
        *   **Initial Load:**
            *   `GET /api/branches` (via `getAllBranches`): Fetches all branches to populate the branch selector dropdown.
            *   `GET /api/services` (via `getAllServices`): Fetches all services available in the system. This master list is used to determine which services are "available to add."
        *   **On Branch Selection:**
            *   `GET /api/branch-services/branch/{branchId}` (via `getBranchServicesByBranchId` from `branchLinkService.js` or your equivalent): Fetches all `BranchService` link objects specifically for the selected branch. These objects contain `id` (the ID of the link itself), `branchId`, `serviceId`, and importantly `serviceName` and `branchName`.
            *   The fetched `BranchService` links for the selected branch constitute the "Assigned Services" list.
            *   The "Available Services to Add" list is then derived by taking the master list of all services and filtering out those whose IDs are present in the "Assigned Services" list for the current branch.
        *   Loading and error states are managed for these data fetching operations.

    5.  **Actions:**
        *   **Adding a Service to a Branch:**
            *   Admin clicks the "Add" button next to a service in the "Available Services to Add" list.
            *   An API call is made to `POST /api/branch-services` (via `createBranchServiceRelationship`).
            *   **Payload:** `{ "branchId": selectedBranchId, "serviceId": serviceIdToAdd }`.
            *   On success, the "Assigned Services" and "Available Services to Add" lists are refreshed to reflect the change.
        *   **Removing a Service from a Branch:**
            *   Admin clicks the "Remove" button next to a service in the "Assigned Services" list.
            *   The ID required for deletion is the `id` of the `BranchService` link object itself (which was fetched when loading assigned services).
            *   An API call is made to `DELETE /api/branch-services/{branchServiceRelationshipId}` (via `deleteBranchServiceRelationship`).
            *   On success, the lists are refreshed.

*   **State Management (`AdminBranchServiceManagementPage.jsx`):**
    *   `branches`: Array of all branches for the selector.
    *   `allServices`: Array of all services in the system.
    *   `selectedBranchId`: Stores the ID of the currently selected branch.
    *   `assignedServices`: Array of `BranchService` link objects for the selected branch.
    *   `availableServicesToAdd`: Array of service objects not yet assigned to the selected branch.
    *   `isLoadingBranches`, `isLoadingServices` (for services of a selected branch), `error`.

*   **API Service Functions Used:**
    *   From `branchService.js`: `getAllBranches(token)`
    *   From `serviceService.js`: `getAllServices(token)`
    *   From `branchLinkService.js` (your name for `branchServiceRelationshipService.js`):
        *   `getBranchServicesByBranchId(branchId, token)`
        *   `createBranchServiceRelationship(data, token)`
        *   `deleteBranchServiceRelationship(branchServiceRelationshipId, token)`

*   **Key Code Snippet (`AdminBranchServiceManagementPage.jsx` - simplified interaction logic):**
    ```javascript
    // src/pages/admin/AdminBranchServiceManagementPage.jsx (Illustrative)
    import React, { useState, useEffect, useCallback } from 'react';
    import { useAuth } from '../../contexts/AuthContext';
    import { getAllBranches } from '../../api/branchService';
    import { getAllServices as getAllSystemServices } from '../../api/serviceService'; // Aliased
    import { 
      getBranchServicesByBranchId,
      createBranchServiceRelationship,
      deleteBranchServiceRelationship 
    } from '../../api/branchLinkService';
    // import './AdminBranchServiceManagementPage.scss';

    const AdminBranchServiceManagementPage = () => {
      const [branches, setBranches] = useState([]);
      const [allSystemServices, setAllSystemServices] = useState([]);
      const [selectedBranchId, setSelectedBranchId] = useState('');
      const [assignedServices, setAssignedServices] = useState([]);
      const [availableServicesToAdd, setAvailableServicesToAdd] = useState([]);
      // ... isLoading states, error state ...
      const { token } = useAuth();

      // Fetch branches and all system services on mount
      useEffect(() => { /* ... fetch branches and allSystemServices ... */ }, [token]);

      // Fetch/update assigned and available services when selectedBranchId or allSystemServices change
      const updateServiceListsForBranch = useCallback(async () => {
        if (!selectedBranchId || !token || allSystemServices.length === 0) {
          setAssignedServices([]);
          setAvailableServicesToAdd(allSystemServices); // Or empty if no branch selected
          return;
        }
        // ... setIsLoadingServices(true) ...
        try {
          const currentBranchServices = await getBranchServicesByBranchId(selectedBranchId, token);
          setAssignedServices(currentBranchServices || []);
          const assignedServiceIds = (currentBranchServices || []).map(bs => bs.serviceId);
          setAvailableServicesToAdd(allSystemServices.filter(s => !assignedServiceIds.includes(s.id)));
        } catch (err) { /* ... setError ... */ }
        finally { /* ... setIsLoadingServices(false) ... */ }
      }, [selectedBranchId, token, allSystemServices]);

      useEffect(() => { updateServiceListsForBranch(); }, [updateServiceListsForBranch]);
      
      const handleAddService = async (serviceIdToAdd) => {
        // ... call createBranchServiceRelationship ...
        // ... then call updateServiceListsForBranch() to refresh ...
      };
      const handleRemoveService = async (branchServiceRelationshipId) => {
        // ... call deleteBranchServiceRelationship ...
        // ... then call updateServiceListsForBranch() to refresh ...
      };

      return (
        <div className="admin-bs-management-page">
          <header className="page-header"><h1>Branch-Service Management</h1></header>
          {/* ... Error display ... */}
          {/* ... Branch Selector Dropdown ... */}

          {selectedBranchId && (
            <div className="services-management-container">
              {/* Assigned Services List with "Remove" buttons */}
              {/* Available Services to Add List with "Add" buttons */}
            </div>
          )}
        </div>
      );
    };
    export default AdminBranchServiceManagementPage;
    ```

This feature is vital for tailoring the service offerings at each branch location, directly impacting what clients can see and book. The UI design with two lists (assigned vs. available) provides a clear and intuitive way for administrators to manage these complex relationships.