
### III.7. Admin Features - Analytics Dashboard (`AdminDashboardPage.jsx`)

*   **Purpose:** The Admin Dashboard & Analytics page provides administrators with a visual overview of key performance indicators (KPIs) and trends within the BQOMIS system. It utilizes charts and summaries to help understand appointment volumes, service popularity, branch performance, and peak operational times, enabling data-driven decision-making.
*   **Accessibility:** Accessed via the `/admin/dashboard` route, typically the default landing page for authenticated admins and linked from "Dashboard & Analytics" in the admin sidebar. This route is protected and requires admin authentication.
*   **Charting Library:** The dashboard uses **Recharts**, a composable charting library for React, to render various types of charts (Bar, Line, Pie).

*   **Key UI Elements & Functionality (`AdminDashboardPage.jsx`):**

    1.  **Page Header:**
        *   Displays the title "Admin Dashboard & Analytics."

    2.  **Global Filters Area:**
        *   **Period Selector:** A dropdown to select the time period for which analytics are displayed (e.g., "Today," "Last 7 Days," "Last 30 Days"). This selection updates a `selectedPeriod` state variable (e.g., in the format "YYYY-MM-DD\_to\_YYYY-MM-DD") which is then passed to the analytics API calls.

    3.  **Dashboard Grid / Chart Cards:**
        *   The main content area is typically a grid displaying various "chart cards." Each card focuses on a specific metric or data dimension.
        *   Loading and error states are managed for the overall dashboard data fetching. Each chart card might also implicitly handle "no data" states.

    4.  **Specific Analytics Charts & Data:**

        *   **A. Overall Peak Times:**
            *   **Purpose:** Shows when appointment demand is highest, either by hour of the day or by day of the week.
            *   **UI:** A Line Chart. An inline dropdown allows the admin to switch the `groupBy` parameter between "hour" and "dayOfWeek".
            *   **API Call:** `GET /api/analytics/peak-times?period=...&groupBy=hour|dayOfWeek` (via `getPeakTimesAnalytics` from `analyticsService.js`).
            *   **Data Transformation:** API response (e.g., `[{ "hour": 10, "count": 12 }, ...]`) is transformed for Recharts (e.g., `name` for X-axis label like "10:00-11:00" or "Tuesday", `Appointments` for Y-axis value).

        *   **B. Branch Performance / Appointments by Branch:**
            *   **Purpose:** Shows appointment distribution and status breakdown (Completed, Cancelled, No-Show) per service for a selected branch.
            *   **UI:** A Bar Chart. A dropdown allows the admin to select a specific branch. Branches are populated from `GET /api/branches`.
            *   **API Call:** `GET /api/analytics/appointments-by-branch?branchId=...&period=...` (via `getAppointmentsByBranchAnalytics`).
            *   **Data Display:** If a branch is selected, a sub-header shows the branch name and total appointments. The Bar Chart then displays services offered by that branch on the X-axis and bars for "Completed," "Cancelled," and "No-Show" counts for each service.

        *   **C. Service Performance by District:**
            *   **Purpose:** Shows the performance (Completed, Cancelled, No-Show ratio) of a specific service within a selected district.
            *   **UI:** A Pie Chart. Two dropdowns allow selection of a District (from `GET /api/districts`) and then a Service (from `GET /api/services`).
            *   **API Call:** `GET /api/analytics/appointments-by-service?district=...&serviceId=...&period=...` (via `getAppointmentsByServiceAnalytics`).
            *   **Data Display:** If district and service are selected, a sub-header shows their names and total appointments. The Pie Chart visualizes the breakdown of `completed`, `cancelled`, and `no_show` counts for that specific service in that district.

        *   **D. Peak Times by District:**
            *   **Purpose:** Similar to overall peak times but filtered for a specific district, allowing for analysis of localized demand patterns.
            *   **UI:** A Line Chart. A dropdown to select a district. An inline dropdown to switch `groupBy` ("hour" or "dayOfWeek").
            *   **API Call:** `GET /api/analytics/peak-times-by-district?district=...&period=...&groupBy=hour|dayOfWeek` (via `getPeakTimesByDistrictAnalytics`).
            *   **Data Transformation:** Similar to overall peak times.

    5.  **Data Fetching Strategy:**
        *   When the page loads or when global filters (like `selectedPeriod`) or chart-specific filters (like `selectedBranchIdForAnalytics`) change, the `fetchAllAnalytics` function is triggered.
        *   This function uses `Promise.allSettled` to make multiple API calls to the various analytics endpoints concurrently. This ensures that even if one analytics API call fails, others can still succeed and display their data.
        *   The results are then set into their respective state variables (`branchAnalytics`, `serviceAnalytics`, `peakTimes`, `peakTimesDistrict`).

*   **State Management (`AdminDashboardPage.jsx`):**
    *   Filter states: `selectedPeriod`, `selectedBranchIdForAnalytics`, `selectedDistrictForAnalytics`, `selectedServiceIdForAnalytics`, `peakTimeGroupBy`, `peakTimeDistrictGroupBy`.
    *   Data states for each chart: `branchAnalytics`, `serviceAnalytics`, `peakTimes`, `peakTimesDistrict`.
    *   Dropdown options: `branches`, `districts`, `allServices`.
    *   `isLoading`, `error`.

*   **API Service Functions Used (from `analyticsService.js`, `branchService.js`, etc.):**
    *   All functions from `analyticsService.js`.
    *   `getAllBranches(token)`
    *   `getAllDistricts(token)`
    *   `getAllServices(token)` (aliased as `getAllBankingServices`)

*   **Recharts Components Used:**
    *   `BarChart`, `Bar`, `LineChart`, `Line`, `PieChart`, `Pie`, `Cell`
    *   `XAxis`, `YAxis`, `CartesianGrid`, `Tooltip`, `Legend`, `ResponsiveContainer`

*   **Key Code Snippet (`AdminDashboardPage.jsx` - illustrative structure for fetching and one chart):**
    ```javascript
    // src/pages/admin/AdminDashboardPage.jsx (Illustrative)
    import React, { useState, useEffect, useCallback } from 'react';
    import { useAuth } from '../../contexts/AuthContext';
    // ... API service imports ...
    import { LineChart, Line, XAxis, YAxis, /* ... other Recharts imports */ } from 'recharts';
    // import './AdminDashboardPage.scss';

    const formatDatePeriod = (days) => { /* ... returns "YYYY-MM-DD_to_YYYY-MM-DD" ... */ };
    const DAY_OF_WEEK_MAP = { /* ... */ }; HOUR_MAP = (h) => { /* ... */ };

    const AdminDashboardPage = () => {
      const { token } = useAuth();
      const [selectedPeriod, setSelectedPeriod] = useState(formatDatePeriod(7));
      const [peakTimes, setPeakTimes] = useState(null);
      const [peakTimeGroupBy, setPeakTimeGroupBy] = useState('hour');
      // ... other states for filters, data, loading, error ...

      const fetchAllAnalytics = useCallback(async () => {
        if (!token) return;
        // ... setIsLoading, setError(null) ...
        try {
          const ptData = await getPeakTimesAnalytics(selectedPeriod, peakTimeGroupBy, token);
          setPeakTimes(ptData);
          // ... fetch other analytics data using Promise.allSettled ...
        } catch (err) { /* ... setError ... */ }
        finally { /* ... setIsLoading(false) ... */ }
      }, [token, selectedPeriod, peakTimeGroupBy /* ... other filter dependencies ... */]);

      useEffect(() => { fetchAllAnalytics(); }, [fetchAllAnalytics]);

      const peakTimesData = peakTimes?.peakTimes?.map(pt => ({
        name: peakTimeGroupBy === 'hour' ? HOUR_MAP(pt.hour) : DAY_OF_WEEK_MAP[pt.dayOfWeek],
        Appointments: pt.count
      })) || [];
      
      return (
        <div className="admin-dashboard-page">
          <header className="page-header"><h1>Admin Dashboard & Analytics</h1></header>
          {/* ... Filters Area ... */}
          {/* ... Loading/Error messages ... */}

          <div className="dashboard-grid">
            <div className="chart-card">
              <h3>Overall Peak Times ({peakTimeGroupBy})</h3>
              <select value={peakTimeGroupBy} onChange={(e) => setPeakTimeGroupBy(e.target.value)}>
                <option value="hour">By Hour</option>
                <option value="dayOfWeek">By Day of Week</option>
              </select>
              {peakTimesData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={peakTimesData}>
                    {/* ... Chart components (XAxis, YAxis, Line, Tooltip, etc.) ... */}
                    <XAxis dataKey="name" /> <YAxis /> <Line dataKey="Appointments" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (<p>No data.</p>)}
            </div>
            {/* ... Other chart cards for Branch Performance, Service Performance, etc. ... */}
          </div>
        </div>
      );
    };
    export default AdminDashboardPage;
    ```

This analytics dashboard leverages the dedicated backend analytics endpoints to provide valuable insights with clear visualizations, aiding administrators in monitoring and optimizing the bank's queue management operations. The use of filters allows for targeted analysis of different aspects of the system.