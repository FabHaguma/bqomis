const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) { return null; }
  return response.json();
};

// --- Global Settings ---
export const getGlobalSettings = async (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/settings/global`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};

export const updateGlobalSettings = async (settingsData, token) => {
  // settingsData: { bookingWindowDays, defaultQueueThresholdLow, ... }
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/settings/global`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(settingsData),
  });
  return handleResponse(response); // Or expect 204 No Content
};

// --- Branch-Specific Settings ---
export const getBranchSettings = async (branchId, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/branches/${branchId}/settings`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response); // Might return empty object or specific DTO if no overrides
};

export const updateBranchSettings = async (branchId, settingsData, token) => {
  // settingsData: { queueThresholdLow (nullable), slotDurationMins (nullable), ... }
  // Send null for fields where admin wants to revert to global default.
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/branches/${branchId}/settings`, {
    method: 'PUT', // Or POST if creating for the first time, then PUT - depends on backend
    headers: headers,
    body: JSON.stringify(settingsData),
  });
  return handleResponse(response);
};