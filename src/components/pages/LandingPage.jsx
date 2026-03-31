import { S } from '../styles/authStyles';
import { Header } from '../shared/Header';
import { Footer } from '../shared/Footer';
import { FONT_FAMILY, BACKGROUND_IMAGES } from '../constants';

export function LandingPage({ onLogoClick, onLoginClick, logo }) {
  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', fontFamily: FONT_FAMILY }}>
      <Header tipLogo={logo} onLogoClick={onLogoClick} />
      <div style={{ ...S.landingBg, backgroundImage: `url(${BACKGROUND_IMAGES.landing})` }}>
        <div style={S.landingFade}>
          <div style={S.rightPanel}>
            <div style={S.landingContent}>
              <div style={S.logoBadge}>ScholarSphere</div>
              <h1 style={S.heroText}>Elevating TIP's Research Landscape</h1>
              <p style={S.heroSubtext}>
                Dive into the heart of academic exploration with the Academic Research Unit (ARU) at
                Technological Institute of the Philippines. Uncover, share, and incentivize groundbreaking
                research at ScholarSphere.
              </p>
              <button onClick={onLoginClick} style={S.primaryBtn}>Login or Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
