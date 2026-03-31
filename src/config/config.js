// Configuration file for API settings
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://10.3.35.209:8000',

  // API endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',
      me: '/auth/me',
    },
    lookups: {
      departments: '/lookups/departments',
      colleges: '/lookups/colleges',
      campuses: '/lookups/campuses',
      schoolYears: '/lookups/school-years',
      semesters: '/lookups/semesters',
    },
    users: {
      me: '/auth/me',
      all: '/users/',
    },
    research: {
      records: '/records',
      evaluations: '/evaluations',
    },
  },

  // Other settings
  tokenKey: 'authToken',
  userKey: 'user',
};