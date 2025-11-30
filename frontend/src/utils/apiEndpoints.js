/**
 * Centralized API Endpoints
 * All API endpoints are defined here for easy maintenance
 */

const API_BASE = '';

// Auth Endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_BASE}/auth/register`,
  LOGIN: `${API_BASE}/auth/login`,
  GET_ME: `${API_BASE}/auth/me`,
};

// Attendance Endpoints (Employee)
export const ATTENDANCE_ENDPOINTS = {
  CHECK_IN: `${API_BASE}/attendance/checkin`,
  CHECK_OUT: `${API_BASE}/attendance/checkout`,
  TODAY_STATUS: `${API_BASE}/attendance/today`,
  MY_HISTORY: `${API_BASE}/attendance/my-history`,
  MY_SUMMARY: `${API_BASE}/attendance/my-summary`,
};

// Attendance Endpoints (Manager)
export const MANAGER_ATTENDANCE_ENDPOINTS = {
  ALL_ATTENDANCE: `${API_BASE}/attendance/all`,
  EMPLOYEE_ATTENDANCE: (employeeId) => `${API_BASE}/attendance/employee/${employeeId}`,
  TEAM_SUMMARY: `${API_BASE}/attendance/summary`,
  TODAY_STATUS_ALL: `${API_BASE}/attendance/today-status`,
  EXPORT_CSV: `${API_BASE}/attendance/export`,
};

// Dashboard Endpoints
export const DASHBOARD_ENDPOINTS = {
  EMPLOYEE: `${API_BASE}/dashboard/employee`,
  MANAGER: `${API_BASE}/dashboard/manager`,
};

// Helper function to build query string
export const buildQueryString = (params) => {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Helper function to build endpoint with query params
export const buildEndpoint = (baseEndpoint, params = {}) => {
  if (Object.keys(params).length === 0) {
    return baseEndpoint;
  }
  return `${baseEndpoint}${buildQueryString(params)}`;
};

