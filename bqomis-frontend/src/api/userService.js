const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const getUserById = async (userId, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response);
};

// Assumed endpoint for updating user profile details
export const updateUserProfile = async (userId, userData, token) => {
  // userData might be { username, phoneNumber }
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: 'PUT', // Or PATCH if your backend supports partial updates
    headers: headers,
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

// Endpoint for changing password
export const changePassword = async (passwordData, token) => {
  // passwordData: { email, oldPassword, newPassword }
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/users/change-password`, {
    method: 'POST', // Or PUT, depending on your backend
    headers: headers,
    body: JSON.stringify(passwordData),
  });
  // This might return 200 OK with a message, or 204 No Content, or the updated user
  // Adjust handleResponse if needed for non-JSON success responses.
  // For now, assume it might return a success message or be handled by status.
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) return null;
  // Try to parse as JSON, but handle cases where backend sends simple text
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return response.text(); // Or handle as success with no specific data
  }
};

// Placeholder for account deletion - if you implement it
// export const deleteUserAccount = async (userId, token) => { ... };