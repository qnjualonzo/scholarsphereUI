// Global constants
export const FONT_FAMILY = 'Georgia, serif';

export const VIEW_STORAGE_KEY = 'currentView';
export const PROTECTED_VIEWS = new Set(['home', 'researchPortal', 'researchEvaluation', 'researchDatabase']);
export const TEST_ACCOUNT_STORAGE_KEY = 'scholarSphereTestAccount';

export const TEST_ACCOUNT_DEFAULTS = {
  email: 'test.account@scholarsphere.local',
  password: 'Test1234!',
  firstName: 'Test',
  lastName: 'Account',
};

export const MENU_ITEMS = [
  'Author', 'Campus', 'College', 'Department',
  'Research Output', 'Research', 'Role', 'School Year', 'Semester',
];

export const BACKGROUND_IMAGES = {
  login: '/cover.png',
  signup: '/back.png',
  landing: '/backdesign.png',
  logo: '/tipLogo.png',
};
