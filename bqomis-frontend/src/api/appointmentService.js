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
