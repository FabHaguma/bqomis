
### III.9. Admin Features - Developer Data Tools (`DevDataToolsPage.jsx` & `generatorUtils.js`)

*   **Purpose:** The "Developer Data Tools" page is a specialized admin-only utility designed primarily for development, testing, performance analysis, and data seeding. Its main feature is a configurable batch appointment generator that can create a large number of randomized appointments based on specified parameters.
*   **Accessibility:** Accessed via the `/admin/dev-data-tools` route, linked from "Dev Data Tools" in the admin sidebar. This route is protected and requires admin authentication. It should ideally be restricted or disabled in a production environment.

*   **Key UI Elements & Workflow (`DevDataToolsPage.jsx`):**

    The page is structured into sections guiding the admin/developer through the process:

    1.  **Section 1: Prerequisite Data Loading:**
        *   **UI:** A button labeled "Load Prerequisite Data (Test Users & Branch Services)."
        *   **Action:** When clicked:
            *   Fetches "Test Users" via `GET /api/users?role=TESTER` (using `getTestUsers` from `userService.js`). These are predefined user accounts intended for testing.
            *   Fetches all "Branch-Service Links" via `GET /api/branch-services` (using `getAllBranchServiceRelationships` from `branchLinkService.js`). These links provide valid `branchServiceId`s and context (branch names, service names, district names).
        *   **Feedback:** Displays the count of loaded test users and branch-service links. Shows an error if data fails to load or if lists are empty. This step is mandatory before generation can occur.

    2.  **Section 2: Generator Configuration (Enabled after prerequisites are loaded):**
        *   A form with various input fields to control the parameters of the batch appointment generation:
            *   **Total Appointments to Generate:** Number input (e.g., 100, 1000).
            *   **Skew Service Popularity:** Checkbox. If checked, the generator attempts to assign a higher percentage of appointments to common services like "Deposits" and "Withdrawals" (based on names defined in `generatorUtils.js`).
            *   **Date Distribution:**
                *   Percentage for "Past" appointments, and "Max Past Days" (e.g., up to 30 days ago).
                *   Percentage for "Today's" appointments.
                *   Percentage for "Future" appointments, and "Max Future Days" (e.g., up to 30 days ahead).
                *   *Client-side validation ensures these percentages sum to 100%.*
            *   *(Internal Logic, not direct UI for these but driven by config)*:
                *   **Working Hours:** Fixed (e.g., 9:00 AM - 5:00 PM).
                *   **Time Slot Interval:** Fixed (e.g., 15 minutes).
                *   **Branch Distribution:** Internal logic attempts to assign ~40% of appointments to branches in Kigali districts (Gasabo, Kicukiro, Nyarugenge), with the rest distributed among other branches.
                *   **Status Distribution for Past Appointments:** Fixed logic (e.g., 80% "COMPLETED", 10% "CANCELLED", 10% "NO_SHOW"). Future/Today appointments default to "SCHEDULED".

    3.  **Section 3: Generate & Submit:**
        *   **UI:** A button "Generate & Submit Batch Appointments."
        *   **Action:**
            1.  Performs client-side validation of configuration (e.g., percentages sum to 100).
            2.  **Client-Side Appointment Generation:** Iterates based on "Total Appointments." For each:
                *   Determines date based on date distribution percentages and ranges.
                *   Determines branch/service:
                    *   Applies Kigali branch distribution weighting.
                    *   Randomly selects a `BranchService` link from the chosen branch pool (Kigali or other).
                    *   If "Skew Service Popularity" is checked, it attempts to favor specified popular services if available at the selected branch (this is a simplified skew based on the randomly picked `BranchService` link's branch).
                *   Determines time slot randomly within working hours.
                *   Selects a random Test User.
                *   Assigns status based on whether the date is past, today, or future.
                *   Constructs an appointment payload: `{ userId, branchServiceId, date, time, status }`.
            3.  **API Call:** Sends the entire array of generated appointment payloads to `POST /api/appointments/batch` (via `createBatchAppointments` from `appointmentService.js`).
        *   Displays a loading state during generation and submission.

    4.  **Section 4: Batch Results:**
        *   Displays the response from the backend after the batch submission:
            *   Total appointments submitted.
            *   Number successfully created.
            *   Number failed.
        *   If failures occurred, it lists each failure with:
            *   The input index (original position in the generated batch).
            *   The error message from the backend.
            *   The data that was submitted for that failed appointment (can be shown in a collapsible `<details>` tag with `<pre>` for readability).

*   **`generatorUtils.js` (`src/features/admin/devDataTools/generatorUtils.js`):**
    *   A separate utility file containing helper functions and constants used by the `DevDataToolsPage.jsx` for generating random data.
    *   **Constants:**
        *   `KIGALI_DISTRICTS`: Array of Kigali district names (case-sensitive).
        *   `POPULAR_SERVICES`: Object mapping symbolic names to actual service names for skewing (e.g., `{ DEPOSITS: "Deposits", WITHDRAWALS: "Withdrawals" }`).
    *   **Helper Functions:**
        *   `getRandomElement(array)`: Returns a random element from an array.
        *   `getRandomDate(baseDateStr, minDaysOffset, maxDaysOffset)`: Generates a random date string in "yyyy-MM-dd" format.
        *   `getRandomTimeSlot(startHour, endHour, intervalMinutes)`: Generates a random "HH:mm" time slot.
        *   `getWeightedRandomService(availableServicesForBranch, skewPopularity)`: Attempts to pick a service with weighting (simplified implementation).

*   **State Management (`DevDataToolsPage.jsx`):**
    *   `testUsers`, `allBranchServices`: For prerequisite data.
    *   `prereqLoading`, `prereqError`.
    *   `config`: Object holding all generator configuration values.
    *   `isSubmitting`, `batchResult`, `generationError`.

*   **API Service Functions Used:**
    *   From `userService.js`: `getTestUsers(token)`
    *   From `branchLinkService.js`: `getAllBranchServiceRelationships(token)`
    *   From `appointmentService.js`: `createBatchAppointments(appointmentsArray, token)`

*   **Key Code Snippet (`DevDataToolsPage.jsx` - simplified generation logic):**
    ```javascript
    // src/pages/admin/DevDataToolsPage.jsx (Illustrative)
    import React, { useState /*, useEffect */ } from 'react';
    // ... API imports and util imports ...

    const DevDataToolsPage = () => {
      // ... states for prereqs, config, results, loading, errors ...
      const { token } = useAuth();

      const loadPrerequisites = async () => { /* ... fetches testUsers and allBranchServices ... */ };

      const generateAndSubmit = async () => {
        // ... validate config ...
        // ... setIsSubmitting(true), clear results/errors ...
        
        const generatedAppointments = [];
        // ... (Loop config.totalAppointments times) ...
        for (let i = 0; i < config.totalAppointments; i++) {
          // ... (Logic using generatorUtils to determine date, time, user, branchServiceId, status) ...
          // Example:
          // const date = getRandomDate(...);
          // const time = getRandomTimeSlot(...);
          // const user = getRandomElement(testUsers);
          // const selectedBranchServiceLink = /* logic involving KIGALI_DISTRICTS and allBranchServices */;
          // if (!selectedBranchServiceLink) continue; 
          // const status = /* logic based on date */;
          
          generatedAppointments.push({
            userId: user.id,
            branchServiceId: selectedBranchServiceLink.id,
            date, time, status,
          });
        }

        try {
          const result = await createBatchAppointments(generatedAppointments, token);
          setBatchResult(result);
        } catch (err) { /* ... setGenerationError ... */ }
        finally { /* ... setIsSubmitting(false) ... */ }
      };

      return (
        <div className="dev-data-tools-page">
          <header className="page-header"><h1>Developer Data Tools</h1></header>
          {/* Section 1: Prerequisite Data */}
          {/* Section 2: Generator Configuration Form (inputs bound to 'config' state) */}
          {/* Section 3: Generate & Submit Button (calls generateAndSubmit) */}
          {/* Section 4: Batch Results Display (shows 'batchResult') */}
        </div>
      );
    };
    export default DevDataToolsPage;
    ```

This Developer Data Tools page, with its configurable batch appointment generator, serves as a powerful internal utility for populating the system with varied data, essential for thorough testing, performance evaluation, and demonstrating application features with a realistic dataset.