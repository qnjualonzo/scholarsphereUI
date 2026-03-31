import { useEffect } from 'react';
import { S } from '../styles/authStyles';
import { Header } from '../shared/Header';
import { Footer } from '../shared/Footer';
import { useSignupForm } from '../hooks/useSignupForm';

// TARGET: src/services/api.js | FROM: src/components/pages/
import { lookupAPI } from '../../services/api.js'; 

// TARGET: src/components/constants.js | FROM: src/components/pages/
import { FONT_FAMILY, BACKGROUND_IMAGES } from '../constants.js';

const SignUpIllustration = () => (
  <div style={{
    width: '100%', height: '100%',
    backgroundImage: `url(${BACKGROUND_IMAGES.signup})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    overflow: 'hidden',
  }} />
);

export function SignupPage({ onLogoClick, onLoginClick, onSignupSuccess, logo }) {
  const signupForm = useSignupForm(onSignupSuccess);

  const {
    firstName, setFirstName,
    middleInitial, setMiddleInitial,
    lastName, setLastName,
    dept, setDept,
    college, setCollege,
    campus, setCampus,
    signupEmail, setSignupEmail,
    signupPass, setSignupPass,
    repeatPass, setRepeatPass,
    signupError, setSignupError,
    campuses, setCampuses,
    filteredColleges,
    filteredDepartments,
    loading, setLoading,
    dropdownError,
    handleCampusChange,
    handleCollegeChange,
    handleSignup,
  } = signupForm;

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        setLoading(true);
        const campusesData = await lookupAPI.getCampuses();
        setCampuses(campusesData);
      } catch (error) {
        console.error('Failed to fetch campuses:', error);
        setCampuses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampuses();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSignup();
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: FONT_FAMILY }}>
      <Header tipLogo={logo} onLogoClick={onLogoClick} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <SignUpIllustration />
          <div style={{ ...S.quoteBox, top: '55px', left: '48px', right: '48px', textAlign: 'center' }}>
            <p style={S.quoteText}>
              No research without <span style={{ color: '#d4a017' }}>action</span>, no
              <br />action without <span style={{ color: '#d4a017' }}>research</span>.
            </p>
            <p style={{ ...S.quoteAuthor, textAlign: 'right', marginTop: '12px' }}>-Kurt Lewin</p>
          </div>
        </div>
        <div style={S.authFormPanel}>
          <div style={{ ...S.authFormInner, maxWidth: '460px' }}>
            <h2 style={S.authHeading}>Sign Up</h2>
            {signupError && <div style={S.errorBox}>{signupError}</div>}
            {dropdownError && (
              <div style={{ ...S.errorBox, backgroundColor: '#fef3cd', color: '#856404', borderColor: '#ffeaa7' }}>
                {dropdownError}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input style={{ ...S.inp, flex: 2 }} type="text" placeholder="First Name *"
                  value={firstName} onChange={e => setFirstName(e.target.value)} onKeyDown={handleKeyDown} />
                <input style={{ ...S.inp, flex: 1 }} type="text" placeholder="Middle Initial"
                  value={middleInitial} onChange={e => setMiddleInitial(e.target.value.slice(0, 1))} 
                  maxLength="1" onKeyDown={handleKeyDown} />
              </div>
              <input style={S.inp} type="text" placeholder="Last Name *"
                value={lastName} onChange={e => setLastName(e.target.value)} onKeyDown={handleKeyDown} />
              
              <select style={{ ...S.inp, ...S.sel }} value={campus} onChange={e => handleCampusChange(e.target.value)}
                disabled={loading || campuses.length === 0}>
                <option value="">{loading ? 'Loading campuses...' : 'Select Campus *'}</option>
                {campuses.map(c => <option key={c.id || c} value={c.id || c}>{c.name || c}</option>)}
              </select>
              
              <select style={{ ...S.inp, ...S.sel }} value={college} onChange={e => handleCollegeChange(e.target.value)}
                disabled={!campus || filteredColleges.length === 0}>
                <option value="">{!campus ? 'First select campus' : 'Select College *'}</option>
                {filteredColleges.map(c => <option key={c.id || c} value={c.id || c}>{c.name || c}</option>)}
              </select>

              <select style={{ ...S.inp, ...S.sel }} value={dept} onChange={e => setDept(e.target.value)}
                disabled={!college || filteredDepartments.length === 0}>
                <option value="">{!college ? 'First select college' : 'Select Department *'}</option>
                {filteredDepartments.map(d => <option key={d.id || d} value={d.id || d}>{d.name || d}</option>)}
              </select>

              <input style={S.inp} type="email" placeholder="Your email"
                value={signupEmail} onChange={e => setSignupEmail(e.target.value)} onKeyDown={handleKeyDown} />
              <input style={S.inp} type="password" placeholder="Password"
                value={signupPass} onChange={e => setSignupPass(e.target.value)} onKeyDown={handleKeyDown} />
              <input style={S.inp} type="password" placeholder="Repeat Password"
                value={repeatPass} onChange={e => setRepeatPass(e.target.value)} onKeyDown={handleKeyDown} />

              <button 
                style={{ 
                  ...S.submitBtn, 
                  opacity: (loading || !campus || !college || !dept) ? 0.6 : 1,
                  cursor: (loading || !campus || !college || !dept) ? 'not-allowed' : 'pointer'
                }} 
                onClick={handleSignup}
                disabled={loading || !campus || !college || !dept}
              >
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
              <p style={{ ...S.switchText, textAlign: 'center' }}>
                Already have an account?{' '}
                <span onClick={() => { setSignupError(''); onLoginClick?.(); }} style={S.switchLink}>Log In</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}