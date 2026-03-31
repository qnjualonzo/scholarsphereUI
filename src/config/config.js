// Configuration file for API settings
export const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000' || 'https://firmamental-unicameral-kane.ngrok-free.dev',

  // API endpoints
  endpoints: {
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',
      me: '/auth/me',
    },
    lookups: {
      departments: '/department/',
      colleges: '/college/',
      campuses: '/campus/',
      schoolYears: '/schoolyear/',
      semesters: '/semester/',
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