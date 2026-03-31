import { S } from '../styles/authStyles';
import { Header } from '../shared/Header';
import { Footer } from '../shared/Footer';
import { useLoginForm } from '../hooks/useLoginForm';
import { FONT_FAMILY, BACKGROUND_IMAGES } from '../constants';

const LoginIllustration = () => (
  <div style={{
    width: '100%', height: '100%',
    backgroundImage: `url(${BACKGROUND_IMAGES.login})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden',
  }} />
);

export function LoginPage({ onLogoClick, onSignupClick, onLoginSuccess, logo }) {
  const {
    loginEmail, setLoginEmail,
    loginPass, setLoginPass,
    authError, setAuthError,
    loginLoading,
    handleLogin,
  } = useLoginForm(onLoginSuccess);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: FONT_FAMILY }}>
      <Header tipLogo={logo} onLogoClick={onLogoClick} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={S.authFormPanel}>
          <div style={S.authFormInner}>
            <h2 style={S.authHeading}>Log In</h2>
            {authError && <div style={S.errorBox}>{authError}</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input style={S.inp} type="email" placeholder="Enter email"
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)} 
                onKeyDown={handleKeyDown} />
              <input style={S.inp} type="password" placeholder="Password"
                value={loginPass} onChange={e => setLoginPass(e.target.value)} 
                onKeyDown={handleKeyDown} />
              <button 
                style={{ 
                  ...S.submitBtn,
                  opacity: loginLoading ? 0.6 : 1,
                  cursor: loginLoading ? 'not-allowed' : 'pointer'
                }} 
                onClick={handleLogin}
                disabled={loginLoading}
              >
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
              <p style={S.switchText}>
                Don't have an account?{' '}
                <span onClick={() => { setAuthError(''); onSignupClick?.(); }} style={S.switchLink}>Sign Up</span>
              </p>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <LoginIllustration />
          <div style={{ ...S.quoteBox, top: '60px', left: '48px', right: '48px', textAlign: 'left' }}>
            <p style={S.quoteText}>
              Research is formalized{' '}
              <span style={{ color: '#d4a017' }}>curiosity</span>
              {'. It is poking and'}
              <br />{'prying with a '}
              <span style={{ color: '#d4a017' }}>purpose</span>.
            </p>
            <p style={{ ...S.quoteAuthor, textAlign: 'right', marginTop: '12px' }}>-Zora Neale Hurston</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
