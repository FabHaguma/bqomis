const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Re-use or define a shared handleResponse function
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) { // No Content
    return null;
  }
  return response.json();
};

export const getAllServices = async (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}/services`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};

export const createService = async (serviceData, token) => {
  // serviceData should be: { name: "string", description: "string" }
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}/services`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(serviceData),
  });
  return handleResponse(response);
};

// Placeholder for updateService, similar structure to createService but with PUT and serviceId
// export const updateService = async (serviceId, serviceData, token) => { ... };

export const deleteService = async (serviceId, token) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}`, {
    method: 'DELETE',
    headers: headers,
  });
  return handleResponse(response); // Will handle 204 No Content or error
};

// getServiceById - if needed for fetching details for an edit form separately
// export const getServiceById = async (serviceId, token) => { ... };