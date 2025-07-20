
### II.3. Client Features - Branch & Service Discovery (`ClientFindBranchPage.jsx`)

*   **Purpose:** This page allows clients to find bank branches and discover the services they offer. A key feature is the display of estimated hourly queue traffic for services, helping clients choose less busy times if they are flexible. The UI employs a progressive selection mechanism, guiding the user from selecting a province, then a district, then a branch, and finally viewing the services at that branch.
*   **Accessibility:** Accessible via the `/client/branches` route, typically linked from the client home page or main navigation as "Find Branch & Services" or "Book New Appointment." This route is protected and requires client authentication.

*   **Key UI Elements & Workflow:**

    1.  **Progressive Selection UI:**
        *   The page presents a single primary selection area that dynamically changes based on the user's choices.
        *   A "breadcrumb" style path at the top shows the current selections (e.g., "Selected Province > Selected District > Selected Branch") and allows users to click on a previous step to go back and change their selection.

    2.  **Selection Steps:**
        *   **Step 1: Select Province:**
            *   Initially, the page prompts "1. Select a Province."
            *   A list of available provinces (derived from all fetched districts) is displayed.
            *   Upon selecting a province, the UI updates.
        *   **Step 2: Select District:**
            *   The prompt changes to "2. Select a District in [Selected Province Name]."
            *   A list of districts *within the chosen province* is displayed.
            *   Upon selecting a district, the UI updates.
        *   **Step 3: Select Branch:**
            *   The prompt changes to "3. Select a Branch in [Selected District Name]."
            *   A list of branches *within the chosen district* is displayed, showing branch name and address.
            *   Upon selecting a branch, the primary selection list area is cleared, and the page transitions to display services for that branch.
        *   **Step 4: View Services & Traffic:**
            *   The header changes to "Services at [Selected Branch Name]."
            *   A list of services offered by the selected branch is displayed. Each service item includes:
                *   Service Name.
                *   (Optional) Service Description.
                *   The `HourChunkStatus.jsx` component, visualizing estimated traffic for that service across a typical 8-hour workday (e.g., 8 AM - 5 PM).
                *   A "Book this Service" button.

    3.  **Data Fetching Logic:**
        *   **Initial Load:**
            *   `GET /api/districts` (via `getAllDistricts`): Fetches all districts. Provinces are then derived from this data client-side to populate the initial province selection list.
        *   **On District Selection:**
            *   `GET /api/branches/district/{districtName}` (via `getBranchesByDistrictName`): Fetches branches for the selected district.
        *   **On Branch Selection (Complex Data Aggregation):**
            1.  `GET /api/branch-services/branch/{branchId}` (via `getBranchServicesByBranchId`): Fetches all `BranchService` link objects for the selected branch. These objects contain `serviceId`, `serviceName`, and the crucial `id` of the `BranchService` link itself (`branchServiceId` needed for appointment booking).
            2.  `GET /api/appointments/today/branch/{branchId}` (via `getTodaysAppointmentsForBranch`): Fetches *all* appointments scheduled for the selected branch *for the current day*.
            3.  **Client-Side Processing for Traffic:** For each `BranchService` link (representing a service offered):
                *   The frontend filters the `allBranchAppointmentsToday` list to find appointments specifically matching the current `BranchService` link's ID (`app.branchServiceId === bsLink.id`).
                *   It then counts these filtered appointments per hour (e.g., 8 AM - 5 PM, in 1-hour buckets).
                *   Based on predefined thresholds (`QUEUE_THRESHOLDS.LOW`, `QUEUE_THRESHOLDS.MODERATE`), it generates an array of 9 status strings (e.g., "green", "yellow", "red") representing the traffic for each hour slot.
                *   This `hourlyTraffic` array, along with service details, is stored to be passed to the `HourChunkStatus` component.

    4.  **`HourChunkStatus.jsx` Component (`src/components/client/HourChunkStatus.jsx`):**
        *   **Purpose:** A reusable component to display the hourly traffic visualization.
        *   **Input:** Takes an `hourlyStatus` prop (an array of 9 color strings).
        *   **Output:** Renders a series of 9 colored bars, each representing an hour from 8 AM to 4 PM (covering up to 4:59 PM). Tooltips or labels indicate the hour for each bar.
            *   Green: Low traffic
            *   Yellow: Moderate traffic
            *   Red: High traffic
        *   **Code Snippet (`HourChunkStatus.jsx`):**
            ```javascript
            // src/components/client/HourChunkStatus.jsx (Illustrative)
            import React from 'react';
            // import './HourChunkStatus.scss';

            const HourChunkStatus = ({ hourlyStatus }) => {
              const hours = ['8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm'];
              if (!hourlyStatus || hourlyStatus.length !== 9) return null;

              return (
                <div className="hour-chunk-status-container">
                  <p className="status-label">Today's Estimated Traffic (8am - 5pm):</p>
                  <div className="chunks-wrapper">
                    {hourlyStatus.map((status, index) => (
                      <div key={index} className="hour-chunk-item" title={hours[index]}>
                        <div className={`chunk-bar chunk-${status}`}></div>
                        <span className="chunk-hour-label">{hours[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            };
            export default HourChunkStatus;
            ```

    5.  **Navigation to Booking:**
        *   Each service card in the final step has a "Book this Service" button.
        *   Clicking this button navigates the user to the `ClientBookAppointmentPage.jsx` (`/client/book-appointment`).
        *   Crucial information is passed via `location.state`:
            *   The selected `branch` object.
            *   A `service` object containing `serviceId` (actual service ID), `serviceName`, and importantly, `branchServiceId` (the ID of the `BranchService` link that connects this specific branch and service, required for creating the appointment).

*   **State Management:**
    *   `currentStep`: Tracks the current stage of selection ('province', 'district', 'branch', 'services').
    *   `allDistrictsData`: Stores the raw district data from the API.
    *   `selectableItems`: An array of items (provinces, districts, or branches) currently being displayed for selection.
    *   `selectedProvince`, `selectedDistrict` (object), `selectedBranch` (object): Store the user's choices at each step.
    *   `servicesWithTraffic`: An array of objects, where each object contains service details and its calculated `hourlyTraffic` array.
    *   Various `isLoading` and `error` states for different API calls.

*   **User Experience:**
    *   The progressive disclosure aims to prevent overwhelming the user with too many options at once.
    *   The traffic visualizer provides actionable insight for clients.
    *   Clear path navigation allows users to easily backtrack and modify earlier selections.

*   **Code Snippet (`ClientFindBranchPage.jsx` - highlighting `handleBranchSelect` for traffic calculation):**
    ```javascript
    // src/pages/client/ClientFindBranchPage.jsx (Illustrative handleBranchSelect)
    const handleBranchSelect = async (branch) => {
      setSelectedBranch(branch);
      // ... (set loading, clear errors, set current step) ...

      try {
        const [branchServiceLinksData, branchAppointmentsData] = await Promise.all([
          getBranchServicesByBranchId(branch.id, token),
          getTodaysAppointmentsForBranch(branch.id, token)
        ]);

        const branchServiceLinks = branchServiceLinksData || [];
        const allBranchAppointmentsToday = branchAppointmentsData || [];
        
        const processedServicesTraffic = branchServiceLinks.map(bsLink => {
          const appointmentsForThisService = allBranchAppointmentsToday.filter(
            app => app.branchServiceId === bsLink.id 
          );
          
          const hourlyCounts = Array(9).fill(0); // 8am-5pm
          appointmentsForThisService.forEach(app => {
            if (app.time) {
              const appHour = parseInt(app.time.split(':')[0]);
              if (appHour >= 8 && appHour <= 16) hourlyCounts[appHour - 8]++;
            }
          });
          
          const hourlyTrafficStatus = hourlyCounts.map(count => {
            if (count <= QUEUE_THRESHOLDS.LOW) return 'green';
            if (count <= QUEUE_THRESHOLDS.MODERATE) return 'yellow';
            return 'red';
          });

          return {
            serviceId: bsLink.serviceId,
            branchServiceId: bsLink.id,
            serviceName: bsLink.serviceName,
            hourlyTraffic: hourlyTrafficStatus,
          };
        });
        setServicesWithTraffic(processedServicesTraffic);
      } catch (err) { /* ... setError ... */ }
      finally { /* ... setIsLoading(false) ... */ }
    };
    ```

This page is a cornerstone of the client's ability to interact with BQOMIS, combining information discovery with decision-support features like the traffic visualizer.