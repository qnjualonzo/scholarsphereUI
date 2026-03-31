import { S } from '../styles/authStyles';

export function Header({ tipLogo, onLogoClick }) {
  return (
    <header style={S.topHeader}>
      <div style={S.headerInner}>
        <button
          type="button"
          onClick={onLogoClick}
          style={S.logoButton}
          aria-label="Go to home page"
        >
          <img src={tipLogo} alt="TIP Logo" style={S.logoImg} />
          <div style={S.headerTextGroup}>
            <span style={S.headerTitle}>Academic Research Unit</span>
            <span style={S.headerSubtitle}>Technological Institute of the Philippines</span>
          </div>
        </button>
      </div>
    </header>
  );
}
