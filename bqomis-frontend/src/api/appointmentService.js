const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  if (response.status === 204) { return null; }
  return response.json();
};

// GET /api/appointments/today/district/{districtName}/service/{serviceId}
export const getTodaysAppointmentsForServiceInDistrict = async (districtName, serviceId, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }

  const encodedDistrictName = encodeURIComponent(districtName);

  const response = await fetch(`${API_BASE_URL}/appointments/today/district/${encodedDistrictName}/service/${serviceId}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response); // Returns array of appointments for that service/district today
};

// POST /api/appointments (for creating a new appointment later)
export const createAppointment = async (appointmentData, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }

  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(appointmentData),
  });
  return handleResponse(response);
};

export const getTodaysAppointmentsForBranch = async (branchId, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }

  const response = await fetch(`${API_BASE_URL}/appointments/today/branch/${branchId}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response); // Returns array of all appointments for that branch today
};

// GET /api/appointments?date=YYYY-MM-DD&branchServiceId=X
export const getAppointmentsByDateAndBranchService = async (date, branchServiceId, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }

  // Construct query parameters
  const queryParams = new URLSearchParams({ date, branchServiceId }).toString();

  const response = await fetch(`${API_BASE_URL}/appointments/date/branchServiceId/?${queryParams}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response); // Returns array of appointments
};


// If you want to implement cancellation:
export const deleteAppointment = async (appointmentId, token) => {
  const headers = {};
  if (token) { headers['Authorization'] = `Bearer ${token}`; }

  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
    method: 'DELETE',
    headers: headers,
  });
  return handleResponse(response); // Expects 204 No Content on success
};

// GET /api/appointments/user/{userId}
// This endpoint is for fetching all appointments for a specific user
export const getAppointmentsByUserId = async (userId, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }

  const response = await fetch(`${API_BASE_URL}/appointments/user/${userId}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response); // Returns array of appointments for this user
};

// GET /api/appointments with filters
export const getFilteredAppointments = async (filters, token) => {
  // filters: { dateFrom, dateTo, branchId, serviceId, status, districtName, page, size }
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }

  const queryParams = new URLSearchParams();
  if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
  if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
  if (filters.branchId) queryParams.append('branchId', filters.branchId);
  if (filters.serviceId) queryParams.append('serviceId', filters.serviceId);
  if (filters.status) queryParams.append('status', filters.status);
  if (filters.districtName) queryParams.append('districtName', filters.districtName);
  if (filters.page) queryParams.append('page', filters.page); // For pagination
  if (filters.size) queryParams.append('size', filters.size);   // For pagination

  const response = await fetch(`${API_BASE_URL}/appointments/filtered?${queryParams.toString()}`, {
    method: 'GET',
    headers: headers,
  });
  return handleResponse(response); // Expects paginated response: { content: [], totalPages, totalElements, ... } or just array
};

// GET /api/appointments/{id}
export const getAppointmentById = async (appointmentId, token) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) { headers['Authorization'] = `Bearer ${token}`; }
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
        method: 'GET',
        headers: headers,
    });
    return handleResponse(response); // Expects single appointment, now with branch/service names
};

// PUT /api/appointments/{id}/status
export const updateAppointmentStatus = async (appointmentId, status, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }

  const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}/status`, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify({ status: status }), // Backend expects { "status": "NEW_STATUS" }
  });
  return handleResponse(response); // Expects updated appointment or success message
};

// POST /api/appointments/batch
export const createBatchAppointments = async (appointmentsArray, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) { headers['Authorization'] = `Bearer ${token}`; }
  const response = await fetch(`${API_BASE_URL}/appointments/batch`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(appointmentsArray),
  });
  return handleResponse(response); // Expects the { totalSubmitted, successfullyCreated, ... } structure
};