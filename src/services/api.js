// API Configuration and Service Functions
import { config } from '../config/config.js';

const API_BASE_URL = config.API_BASE_URL;

const isAuthErrorMessage = (message = '') => {
  const normalized = String(message).toLowerCase();
  return normalized.includes('not authenticated') || normalized.includes('unauthorized') || normalized.includes('401');
};

const PUBLIC_LOOKUP_PREFIXES = [
  config.endpoints.lookups.campuses,
  config.endpoints.lookups.colleges,
  config.endpoints.lookups.departments,
];

const isPublicLookupEndpoint = (endpoint = '') => {
  return PUBLIC_LOOKUP_PREFIXES.some((prefix) => endpoint.startsWith(prefix));
};

// API utility function for making requests
const apiRequest = async (endpoint, options = {}, requireAuth = true) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const shouldUseAuth = requireAuth && !isPublicLookupEndpoint(endpoint);
  let usedAuthHeader = false;

  const requestConfig = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (shouldUseAuth) {
    const token = localStorage.getItem(config.tokenKey);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
      usedAuthHeader = true;
    }
  } else {
    // Hard guarantee: public endpoints must never send Authorization.
    delete requestConfig.headers.Authorization;
  }

  try {
    const response = await fetch(url, requestConfig);
    
    // Handle cases where response is not JSON (e.g., network errors)
    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      data = { detail: `Failed to parse response: ${response.statusText}` };
    }

    if (!response.ok) {
      // Enhanced error message extraction
      let errorMessage;
      
      if (data) {
        // Try different error message formats commonly used by APIs
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.detail) {
          errorMessage = Array.isArray(data.detail) ? data.detail.join(', ') : data.detail;
        } else if (data.message) {
          errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        } else if (data.error) {
          errorMessage = typeof data.error === 'string' ? data.error : data.error.message;
        } else if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          // Handle validation error arrays
          errorMessage = data.errors.map(err => 
            typeof err === 'string' ? err : err.message || err.detail || JSON.stringify(err)
          ).join(', ');
        } else if (data.msg) {
          // Some APIs use 'msg' instead of 'message'
          errorMessage = Array.isArray(data.msg) ? data.msg.join(', ') : data.msg;
        } else if (data.description) {
          errorMessage = data.description;
        } else {
          // If it's an object, try to extract meaningful information
          if (typeof data === 'object') {
            // Look for any field that might contain the error message
            const possibleErrorFields = ['error_description', 'error_message', 'errorMessage', 'reason', 'info'];
            for (const field of possibleErrorFields) {
              if (data[field]) {
                errorMessage = data[field];
                break;
              }
            }
            
            // If still no message found, create a readable summary
            if (!errorMessage) {
              const keys = Object.keys(data);
              if (keys.length === 1 && data[keys[0]]) {
                errorMessage = `${keys[0]}: ${data[keys[0]]}`;
              } else {
                errorMessage = `Validation error: ${JSON.stringify(data, null, 2)}`;
              }
            }
          } else {
            errorMessage = String(data);
          }
        }
      } else {
        errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`;
      }
      
      const normalizedError = String(errorMessage || '').toLowerCase();
      const isInvalidAuth = normalizedError.includes('invalid token') || normalizedError.includes('not authenticated') || normalizedError.includes('unauthorized');

      if (response.status === 401 && shouldUseAuth && usedAuthHeader && isInvalidAuth) {
        localStorage.removeItem(config.tokenKey);
        localStorage.removeItem(config.userKey);
        throw new Error('Session expired. Please log in again.');
      }

      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    const isPublicLookupAuthFailure = endpoint.startsWith('/lookups') && !requireAuth && isAuthErrorMessage(error?.message);

    if (!isPublicLookupAuthFailure) {
      console.error(`API request failed for ${endpoint}:`, error);
    }

    // If it's already our custom error, throw it as-is
    if (error.message) {
      throw error;
    }
    // Otherwise, wrap network errors
    throw new Error(`Network error: ${error.message || 'Unable to connect to server'}`);
  }
};

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await apiRequest(config.endpoints.auth.login, {
      method: 'POST',
      body: JSON.stringify({
        email: email,    // Changed from 'username' to 'email'
        password,
      }),
    });
    return response;
  },

  signup: async (userData) => {    // Changed from 'register' to 'signup'
    const response = await apiRequest(config.endpoints.auth.signup, {
      method: 'POST', 
      body: JSON.stringify(userData),
    });
    return response;
  },

  getCurrentUser: async () => {
    const response = await apiRequest(config.endpoints.auth.me);
    return response;
  },
};

// Lookup/Dropdown APIs
export const lookupAPI = {
  getCampuses: async () => {
    return await apiRequest(config.endpoints.lookups.campuses, {}, false);
  },

  getDepartments: async () => {
    return await apiRequest(config.endpoints.lookups.departments, {}, false);
  },

  getCollegesByCampus: async (campusId) => {
    const endpoint = `${config.endpoints.lookups.colleges}?campus_id=${campusId}`;
    return await apiRequest(endpoint, {}, false);
  },

  getDepartmentsByCollege: async (collegeId) => {
    const endpoint = `${config.endpoints.lookups.departments}?college_id=${collegeId}`;
    return await apiRequest(endpoint, {}, false);
  },

  getColleges: async () => {
    return await apiRequest(config.endpoints.lookups.colleges, {}, false);
  },

  getSchoolYears: async () => {
    return await apiRequest(config.endpoints.lookups.schoolYears, {}, true);
  },

  getSemesters: async () => {
    return await apiRequest(config.endpoints.lookups.semesters, {}, true);
  },
};

// User API
export const userAPI = {
  getCurrentUser: async () => {
    const response = await apiRequest(config.endpoints.users.me);
    return response;
  },

  getAllUsers: async () => {
    const response = await apiRequest(config.endpoints.users.all);
    return response;
  },
};

export default {
  authAPI,
  lookupAPI,
  userAPI,
};