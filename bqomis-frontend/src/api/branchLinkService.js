const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) { return null; }
  return response.json();
};

// GET all relationships (might not be used if per-branch view is primary)
export const getAllBranchServiceRelationships = async (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/branch-services`, { /* ... */ });
  return handleResponse(response);
};

// GET relationships for a specific branch
export const getBranchServicesByBranchId = async (branchId, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/branch-services/branch/${branchId}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};

// POST to create a new relationship
export const createBranchServiceRelationship = async (data, token) => {
  // data: { branchId: number, serviceId: number }
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/branch-services`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

// DELETE a relationship by its own ID
export const deleteBranchServiceRelationship = async (branchServiceRelationshipId, token) => {
  const headers = {};
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/branch-services/${branchServiceRelationshipId}`, {
    method: 'DELETE',
    headers: headers,
  });
  return handleResponse(response);
};