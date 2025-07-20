
### III.8. Admin Features - Settings Page (`AdminSettingsPage.jsx`)

*   **Purpose:** The Admin Settings page allows administrators to configure system-wide default parameters and branch-specific overrides for various operational aspects of the BQOMIS application. This provides flexibility in tailoring the system's behavior to meet specific business needs or branch capacities.
*   **Accessibility:** Accessed via the `/admin/settings` route, linked from "Settings" in the admin sidebar. This route is protected and requires admin authentication.

*   **Key UI Elements & Workflow (`AdminSettingsPage.jsx`):**

    1.  **Page Header:**
        *   Displays the title "Application Settings."

    2.  **Global Default Settings Section:**
        *   **Purpose:** Allows configuration of default values that apply system-wide unless overridden at a branch level.
        *   **UI:** A form containing input fields for each global setting. Examples include:
            *   **Booking Window (Days):** Number input (e.g., how many days in advance clients can book).
            *   **Default Queue Threshold (Low):** Number input (max appointments per hour for "Low" traffic indicator).
            *   **Default Queue Threshold (Moderate):** Number input (max appointments per hour for "Moderate" traffic).
            *   **Default Slot Duration (Minutes):** Number input.
            *   **Maintenance Mode:** Checkbox to enable/disable.
            *   Other settings like `minBookingNoticeHours`, `defaultAllowCancellationHours`.
        *   **Action:** A "Save Global Settings" button.
            *   On click, an API call is made to `PUT /api/settings/global` (via `updateGlobalSettings` from `settingsService.js`) with all current global setting values.
            *   Success or error messages are displayed.

    3.  **Branch-Specific Setting Overrides Section:**
        *   **Purpose:** Allows administrators to define settings for individual branches that will override the global defaults.
        *   **UI:**
            *   **Branch Selector:** A dropdown menu to select a specific branch. Populated by fetching all branches (`GET /api/branches`).
            *   **Override Form (appears when a branch is selected):**
                *   Input fields for each setting that can be overridden at the branch level (e.g., "Queue Threshold (Low)," "Queue Threshold (Moderate)," "Slot Duration (Minutes)," "Max Appointments Per Slot").
                *   **Placeholders & Effective Values:** Each input field often shows a placeholder indicating the current global default (e.g., "Global: 30"). The page also displays the "Effective" value for the selected branch (which is either its specific override or the global default if no override is set).
                *   **Clearing an Override:** To revert a branch-specific setting back to the global default, the admin typically clears the input field. The frontend then sends `null` (or an empty string that the backend interprets as "use default") for that setting in the update payload.
        *   **Action:** A "Save Branch Settings" button for the selected branch.
            *   On click, an API call is made to `PUT /api/branches/{branchId}/settings` (via `updateBranchSettings`) with only the override values (or `null` to clear an override).
            *   Success or error messages are displayed. The effective settings display is updated.

    4.  **Data Fetching Strategy:**
        *   **Initial Load:**
            *   `GET /api/settings/global` (via `getGlobalSettings`): Fetches the current global configuration.
            *   `GET /api/branches` (via `getAllBranches`): Fetches all branches for the branch selector dropdown.
        *   **On Branch Selection (for overrides):**
            *   `GET /api/branches/{branchId}/settings` (via `getBranchSettings`): Fetches any existing overrides for the selected branch. The response might be an object with only the overridden fields, or specific DTO. The frontend merges this with its knowledge of global defaults to show "effective" settings.
        *   Loading and error states are managed for these operations.

*   **State Management (`AdminSettingsPage.jsx`):**
    *   `globalSettings`: Object storing the values for global configuration.
    *   `branches`: Array of branch objects for the selector.
    *   `selectedBranchIdForSettings`: Stores the ID of the branch currently selected for override configuration.
    *   `branchSpecificSettings`: Object storing the *override* values for the selected branch. Fields can be `null` if no override is set for that specific setting.
    *   `effectiveBranchSettings`: Object derived from `globalSettings` and `branchSpecificSettings` to show the actual settings in effect for the selected branch.
    *   Various `isLoading`, `isSaving`, `Error`, and `Success` states for both global and branch-specific sections.

*   **API Service Functions Used (from `settingsService.js` and `branchService.js`):**
    *   `getGlobalSettings(token)`
    *   `updateGlobalSettings(settingsData, token)`
    *   `getBranchSettings(branchId, token)`
    *   `updateBranchSettings(branchId, settingsData, token)`
    *   `getAllBranches(token)` (to populate branch selector)

*   **Backend Data Model Implication:**
    *   This design implies two main tables on the backend:
        *   `GlobalApplicationConfiguration`: A single-row table for global defaults.
        *   `BranchConfigurationOverrides`: A table where each row links a `branch_id` to specific override values (with `NULL` indicating no override for a particular setting).

*   **Key Code Snippet (`AdminSettingsPage.jsx` - illustrative structure):**
    ```javascript
    // src/pages/admin/AdminSettingsPage.jsx (Illustrative)
    import React, { useState, useEffect, useCallback } from 'react';
    import { useAuth } from '../../contexts/AuthContext';
    import { getGlobalSettings, updateGlobalSettings, getBranchSettings, updateBranchSettings } from '../../api/settingsService';
    import { getAllBranches } from '../../api/branchService';
    // import './AdminSettingsPage.scss';

    const AdminSettingsPage = () => {
      const { token } = useAuth();
      const [globalSettings, setGlobalSettings] = useState({ /* ... initial defaults ... */ });
      const [branches, setBranches] = useState([]);
      const [selectedBranchIdForSettings, setSelectedBranchIdForSettings] = useState('');
      const [branchSpecificSettings, setBranchSpecificSettings] = useState({ /* ... initial nulls ... */ });
      const [effectiveBranchSettings, setEffectiveBranchSettings] = useState({});
      // ... loading, saving, error, success states ...

      // Fetch global settings and branches on mount
      useEffect(() => { /* ... fetch global settings and all branches ... */ }, [token]);

      // Fetch branch-specific settings when selectedBranchIdForSettings changes
      const fetchBranchOverrides = useCallback(async () => {
        if (!selectedBranchIdForSettings || !token) { /* reset states */ return; }
        // ... setIsLoadingBranch ...
        try {
          const overrides = await getBranchSettings(selectedBranchIdForSettings, token);
          setBranchSpecificSettings(prev => ({ /* merge overrides with prev structure, ensuring all keys exist */ }));
        } catch (err) { /* ... setBranchError ... */ }
        finally { /* ... setIsLoadingBranch(false) ... */ }
      }, [selectedBranchIdForSettings, token]);
      useEffect(() => { fetchBranchOverrides(); }, [fetchBranchOverrides]);

      // Calculate effective settings
      useEffect(() => {
        if (selectedBranchIdForSettings) {
          setEffectiveBranchSettings({
            queueThresholdLow: branchSpecificSettings.queueThresholdLow ?? globalSettings.defaultQueueThresholdLow,
            // ... other settings ...
          });
        } else { setEffectiveBranchSettings({}); }
      }, [globalSettings, branchSpecificSettings, selectedBranchIdForSettings]);

      // ... handleGlobalSettingChange, handleBranchSettingChange ...
      // ... handleSaveGlobalSettings, handleSaveBranchSettings ...
      // ... getInputPlaceholder for branch override form ...

      return (
        <div className="admin-settings-page">
          <header className="page-header"><h1>Application Settings</h1></header>
          
          <section className="settings-section global-settings">
            <h2>Global Default Settings</h2>
            {/* ... Global settings form ... */}
            <form onSubmit={handleSaveGlobalSettings}>
                {/* Input for globalSettings.bookingWindowDays etc. */}
                <button type="submit">Save Global Settings</button>
            </form>
          </section>

          <section className="settings-section branch-settings">
            <h2>Branch-Specific Setting Overrides</h2>
            <select value={selectedBranchIdForSettings} onChange={(e) => setSelectedBranchIdForSettings(e.target.value)}>
                {/* ... options for branches ... */}
            </select>
            {selectedBranchIdForSettings && (
              <form onSubmit={handleSaveBranchSettings}>
                {/* Input for branchSpecificSettings.queueThresholdLow etc., showing effective value and placeholder */}
                <button type="submit">Save Branch Settings</button>
              </form>
            )}
          </section>
        </div>
      );
    };
    export default AdminSettingsPage;
    ```

This settings page provides granular control over key operational parameters of BQOMIS, allowing administrators to fine-tune the system for optimal performance and user experience based on both general policies and specific branch needs. The separation of global defaults and branch-specific overrides offers a flexible and powerful configuration model.