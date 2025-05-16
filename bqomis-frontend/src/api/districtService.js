const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper to build headers with optional token
const defaultHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getAllDistricts = async (token) => {
  const response = await fetch(`${API_BASE_URL}/districts`, {
    method: 'GET',
    headers: defaultHeaders(token),
  });
  return handleResponse(response);
};

// Add other district-related API functions if needed later
// e.g., getDistrictsByProvinceName
export const getDistrictsByProvinceName = async (provinceName, token) => {
  const response = await fetch(`${API_BASE_URL}/districts/province/${provinceName}`, {
    method: 'GET',
    headers: defaultHeaders(token),
  });
  return handleResponse(response);
};