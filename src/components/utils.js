// ── Utility Functions ──────────────────────────────────────────────

let _uid = 1;
export const uid = () => _uid++;

export function getErrorMessage(error, context = 'general') {
  if (!error.message) return 'An error occurred. Please try again.';

  if (context === 'login') {
    if (error.message.includes('401') || error.message.includes('Unauthorized') || 
        error.message.includes('Invalid email or password')) {
      return 'Invalid email or password. Please check your credentials and try again.';
    }
  }

  if (context === 'signup') {
    if (error.message.includes('422') || error.message.includes('Unprocessable')) {
      return 'Invalid registration data. Please check all fields and try again.';
    }
    if (error.message.includes('email')) {
      return 'Email address is already in use or invalid. Please try a different email.';
    }
    if (error.message.includes('password')) {
      return 'Password does not meet requirements. Please try a stronger password.';
    }
  }

  if (error.message.includes('Network error') || error.message.includes('Unable to connect')) {
    return 'Unable to connect to server. Please check your internet connection.';
  }

  return error.message;
}

export function initializeGlobalStyles() {
  const _style = document.createElement('style');
  _style.innerHTML = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { width: 100%; height: 100%; overflow: hidden; }
    input[type="file"] { display: none; }
    .sideBtn:hover  { background-color: #fdf3d8 !important; color: #b8860b !important; }
    .actionBtn:hover { opacity: 0.8; }
    .uploadArea:hover { border-color: #d4a017 !important; background: #fdf8ec !important; }
    tr:hover td { background-color: #fffcf2 !important; }
    select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
    .settingsBtn:hover { background-color: #f5f5f5 !important; }
    .overlay-panel { animation: slideIn 0.25s ease; }
    @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  `;
  document.head.appendChild(_style);
}
