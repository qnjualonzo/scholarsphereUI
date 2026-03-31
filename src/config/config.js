// Configuration file for API settings
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000' || 'https://firmamental-unicameral-kane.ngrok-free.dev',

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