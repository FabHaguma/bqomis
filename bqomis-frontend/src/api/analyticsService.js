const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Assuming this is /api without trailing slash

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Base URL for analytics might be just /api/analytics if not nested under /api already in VITE_API_BASE_URL
const ANALYTICS_URL = `${API_BASE_URL}/analytics`;

// 1. /analytics/appointments-by-branch?branchId=...&period=YYYY-MM-DD_to_YYYY-MM-DD
export const getAppointmentsByBranchAnalytics = async (branchId, period, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const queryParams = new URLSearchParams({ period });
  if (branchId) queryParams.append('branchId', branchId); // Optional branchId

  const response = await fetch(`${ANALYTICS_URL}/appointments-by-branch?${queryParams.toString()}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};

// 2. /analytics/appointments-by-service?district=...&serviceId=...&period=YYYY-MM-DD_to_YYYY-MM-DD
export const getAppointmentsByServiceAnalytics = async (filters, token) => {
  // filters: { district, serviceId, period }
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const queryParams = new URLSearchParams({ period: filters.period });
  if (filters.district) queryParams.append('district', filters.district);
  if (filters.serviceId) queryParams.append('serviceId', filters.serviceId);

  const response = await fetch(`${ANALYTICS_URL}/appointments-by-service?${queryParams.toString()}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};

// 3. /analytics/peak-times?period=YYYY-MM-DD_to_YYYY-MM-DD&groupBy=hour|dayOfWeek
export const getPeakTimesAnalytics = async (period, groupBy, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const queryParams = new URLSearchParams({ period, groupBy });

  const response = await fetch(`${ANALYTICS_URL}/peak-times?${queryParams.toString()}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};

// 4. /analytics/peak-times-by-district?district=...&period=YYYY-MM-DD_to_YYYY-MM-DD&groupBy=hour|dayOfWeek
export const getPeakTimesByDistrictAnalytics = async (district, period, groupBy, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const queryParams = new URLSearchParams({ district, period, groupBy });

  const response = await fetch(`${ANALYTICS_URL}/peak-times-by-district?${queryParams.toString()}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};