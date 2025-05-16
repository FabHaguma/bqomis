// Branch API service example
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to handle API responses (can be shared in a common apiUtils.js)
const handleResponse = async (response) => {
  if (!response.ok) {
    // Try to parse error message from backend, otherwise use status text
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  // For DELETE or other methods that might not return JSON content but are successful (e.g. 204 No Content)
  if (response.status === 204) {
    return null; 
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

export const getAllBranches = async (token) => {
  const response = await fetch(`${API_BASE_URL}/branches`, {
    method: 'GET',
    headers: defaultHeaders(token),
  });
  return handleResponse(response);
};

export const createBranch = async (branchData, token) => {
  // BranchData should match the backend expected model:
  // { name: "string", address: "string", district: "string", province: "string" }
  // The backend Branch entity shows district and province as strings.
  // If your backend expects districtId, adjust accordingly.
  const response = await fetch(`${API_BASE_URL}/branches`, {
    method: 'POST',
    headers: defaultHeaders(token),
    body: JSON.stringify(branchData),
  });
  return handleResponse(response);
};

// Assuming there's a PUT endpoint for updates, structure would be similar:
// export const updateBranch = async (branchId, branchData, token) => {
//   const response = await fetch(`${API_BASE_URL}/branches/${branchId}`, {
//     method: 'PUT',
//     headers: defaultHeaders(token),
//     body: JSON.stringify(branchData),
//   });
//   return handleResponse(response);
// };

export const deleteBranch = async (branchId, token) => {
  const response = await fetch(`${API_BASE_URL}/branches/${branchId}`, {
    method: 'DELETE',
    headers: defaultHeaders(token),
  });
  return handleResponse(response); // Will handle 204 No Content or error
};

// getBranchById - if needed for fetching details for an edit form separately
// export const getBranchById = async (branchId, token) => {
//   const response = await fetch(`${API_BASE_URL}/branches/${branchId}`, {
//     method: 'GET',
//     headers: defaultHeaders(token),
//   });
//   return handleResponse(response);
// };

export const getBranchesByDistrictName = async (districtName, token) => {
  const headers = defaultHeaders(token);
  // Ensure districtName is URL encoded if it can contain special characters
  const encodedDistrictName = encodeURIComponent(districtName);
  const response = await fetch(`${API_BASE_URL}/branches/district/${encodedDistrictName}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response); // Assuming handleResponse is defined in this file
};