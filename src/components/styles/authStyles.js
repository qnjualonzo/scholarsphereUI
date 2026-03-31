// Centralized styles for authentication and common UI elements
export const S = {
  // HEADER (dark — used in landing/login/signup)
  topHeader:      { width: '100%', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', flexShrink: 0, zIndex: 100 },
  headerInner:    { padding: '15px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoBox:        { display: 'flex', alignItems: 'center', gap: '17px' },
  logoButton:     { display: 'flex', alignItems: 'center', gap: '17px', background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', color: 'inherit', textAlign: 'left' },
  logoImg:        { width: '55px', height: '55px', objectFit: 'contain', flexShrink: 0 },
  headerTextGroup:{ display: 'flex', flexDirection: 'column', gap: '3px', textAlign: 'left' },
  headerTitle:    { color: '#f0e8d0', fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '700', letterSpacing: '0.3px' },
  headerSubtitle: { color: '#999', fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: '400' },

  // FOOTER
  footer:         { width: '100%', backgroundColor: '#d4a017', padding: '14px 28px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '24px', flexShrink: 0 },
  footerLink:     { fontSize: '12px', color: '#1a1a1a', fontFamily: 'Georgia, serif', cursor: 'pointer' },

  // LANDING
  landingBg:      { flex: 1, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' },
  landingFade:    { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(255,255,255,0) 38%, rgba(255,255,255,0.92) 58%, rgba(255,255,255,0.97) 72%)', display: 'flex', alignItems: 'center' },
  rightPanel:     { marginLeft: 'auto', width: '48%', padding: '0 72px 0 48px' },
  landingContent: { width: '100%', textAlign: 'right' },
  logoBadge:      { display: 'inline-block', color: '#d4a017', fontWeight: '700', fontSize: '20px', letterSpacing: '3px', fontFamily: 'Georgia, serif', marginBottom: '10px' },
  heroText:       { fontSize: '35px', fontWeight: '900', color: '#1a1a1a', margin: '0 0 16px 0', lineHeight: '1.18', fontFamily: 'Georgia, serif' },
  heroSubtext:    { fontSize: '16px', color: '#444', marginBottom: '34px', lineHeight: '1.75', fontFamily: 'Georgia, serif', maxWidth: '600px', marginLeft: 'auto' },
  primaryBtn:     { padding: '12px 36px', background: '#d4a017', color: '#1a1a1a', border: 'none', borderRadius: '6px', fontWeight: '800', cursor: 'pointer', fontSize: '14px', fontFamily: 'Georgia, serif', letterSpacing: '0.5px', boxShadow: '0 4px 18px rgba(212,160,23,.35)' },

  // AUTH SHARED
  authFormPanel:  { width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff', overflowY: 'auto', padding: '40px 20px' },
  authFormInner:  { width: '100%', maxWidth: '400px' },
  authHeading:    { fontSize: '22px', fontWeight: '700', color: '#2a2a2a', marginBottom: '24px', fontFamily: 'Georgia, serif' },
  inp:            { width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', fontFamily: 'Georgia, serif', color: '#2a2a2a', background: '#fff', outline: 'none', boxSizing: 'border-box' },
  sel:            { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23666' strokeWidth='1.5' fill='none'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', cursor: 'pointer' },
  submitBtn:      { width: '100%', padding: '12px', background: '#3a5fc8', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '700', cursor: 'pointer', fontSize: '15px', fontFamily: 'Georgia, serif', letterSpacing: '0.3px' },
  switchText:     { fontSize: '13px', color: '#555', fontFamily: 'Georgia, serif', margin: 0 },
  switchLink:     { color: '#3a5fc8', cursor: 'pointer', textDecoration: 'underline', fontWeight: '600' },
  errorBox:       { backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', textAlign: 'center', fontSize: '13px', fontFamily: 'Georgia, serif', marginBottom: '8px' },

  // QUOTE
  quoteBox:       { position: 'absolute', top: '55px', left: '50px', right: '50px', fontFamily: 'Georgia, serif' },
  quoteText:      { fontSize: '25px', lineHeight: '1.45', color: '#2a2a2a', margin: 0, fontWeight: '400' },
  quoteAuthor:    { marginTop: '14px', color: '#666', fontSize: '15px', fontFamily: 'Georgia, serif' },

  // HOME PAGE
  homeTopBar:     { width: '100%', backgroundColor: '#ffffff', borderBottom: '1px solid #e8e8e8', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, position: 'relative', zIndex: 200 },
  homeBody:       { flex: 1, backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  homeWelcomeCard:{ textAlign: 'center', maxWidth: '600px', padding: '40px' },
  homeWelcomeTitle:{ fontSize: '30px', fontWeight: '800', color: '#1a1a1a', fontFamily: 'Georgia, serif', marginBottom: '16px' },
  homeWelcomeSubtext:{ fontSize: '16px', color: '#555', lineHeight: '1.7', fontFamily: 'Georgia, serif' },
  homeDivider:    { width: '60px', height: '3px', background: '#d4a017', margin: '28px auto' },
  homeStatsRow:   { display: 'flex', gap: '16px', justifyContent: 'center' },
  homeStatCard:   { display: 'flex', flexDirection: 'column', alignItems: 'center', background: '#fafaf8', border: '1px solid #e8e2d4', borderRadius: '10px', padding: '18px 22px', minWidth: '120px' },
  homeStatNum:    { fontSize: '22px', fontWeight: '800', color: '#d4a017', fontFamily: 'Georgia, serif' },
  homeStatLabel:  { fontSize: '12px', color: '#888', fontFamily: 'Georgia, serif', marginTop: '4px' },

  // SETTINGS BUTTON
  settingsBtn:    { display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', background: '#ffffff', color: '#1a1a1a', border: '1px solid #d4a017', borderRadius: '8px', cursor: 'pointer', fontFamily: 'Georgia, serif', transition: 'background 0.15s' },

  // OVERLAY PANEL
  overlayPanel:   { position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: '820px', height: '560px', background: '#fff', border: '1px solid #e0d8c8', borderRadius: '14px', boxShadow: '0 12px 40px rgba(0,0,0,0.18)', zIndex: 9999, overflow: 'hidden', display: 'flex', flexDirection: 'column' },
  panelHeader:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333', flexShrink: 0 },
  panelTitle:     { fontSize: '14px', fontWeight: '700', color: '#d4a017', fontFamily: 'Georgia, serif', letterSpacing: '0.4px' },
  closeBtn:       { background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '16px', fontWeight: '700', lineHeight: 1, padding: '2px 6px' },
  panelSidebar:   { width: '180px', minWidth: '180px', background: 'rgba(255,255,255,1)', padding: '18px 10px', display: 'flex', flexDirection: 'column', gap: '4px', borderRight: '1px solid #e8e2d4', overflowY: 'auto' },
  panelMain:      { flex: 1, overflowY: 'auto', padding: '20px 24px' },
  panelCardHeadingRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' },
  panelLogoutBtn: { width: '100%', padding: '9px 13px', background: 'transparent', border: '1px solid #d4a017', borderRadius: '7px', cursor: 'pointer', color: '#b8860b', fontWeight: '700', fontSize: '12px', fontFamily: 'Georgia, serif', textAlign: 'center' },

  // DASHBOARD SHARED
  sideTitle:      { fontSize: '13px', fontWeight: '800', color: '#2a2a2a', marginBottom: '12px', fontFamily: 'Georgia, serif', letterSpacing: '0.4px' },
  sideBtn:        { textAlign: 'left', padding: '9px 11px', borderRadius: '7px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', fontFamily: 'Georgia, serif', transition: 'all 0.18s' },
  cardHeading:    { fontSize: '13px', color: '#2a2a2a', fontWeight: '800', fontFamily: 'Georgia, serif', margin: 0, letterSpacing: '0.4px' },
  sysViewBtn:     { background: '#2a2a2a', color: '#d4a017', border: 'none', padding: '6px 16px', borderRadius: '20px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Georgia, serif', fontWeight: '700', letterSpacing: '0.4px' },

  block:          { marginBottom: '22px' },
  blockHeader:    { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' },
  blockLabel:     { fontSize: '13px', fontWeight: '700', color: '#2a2a2a', fontFamily: 'Georgia, serif' },
  uploadBtn:      { padding: '6px 14px', background: '#d4a017', color: '#2a2a2a', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Georgia, serif', fontWeight: '700' },
  dropZone:       { border: '2px dashed #d4c9a8', borderRadius: '10px', padding: '28px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', background: '#fefcf5' },
  fileList:       { display: 'flex', flexDirection: 'column', gap: '6px' },
  fileChip:       { display: 'flex', alignItems: 'center', gap: '8px', background: '#fdf8ec', border: '1px solid #e8dfc0', borderRadius: '8px', padding: '8px 12px' },
  fileLink:       { flex: 1, fontSize: '12px', color: '#2a2a2a', fontFamily: 'Georgia, serif', textDecoration: 'none', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  fileSize:       { fontSize: '11px', color: '#999', fontFamily: 'Georgia, serif', whiteSpace: 'nowrap' },
  removeBtn:      { background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', fontSize: '13px', fontWeight: '700', padding: '0 2px', lineHeight: 1 },

  addRowForm:     { display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center', background: '#fffdf5', border: '1px solid #e8dfc0', borderRadius: '8px', padding: '10px 12px' },
  tableWrap:      { overflowX: 'auto', borderRadius: '10px', border: '1px solid #e8e2d4' },
  table:          { width: '100%', borderCollapse: 'collapse', fontFamily: 'Georgia, serif', fontSize: '12px' },
  thead:          { backgroundColor: '#2a2a2a' },
  th:             { padding: '10px 14px', textAlign: 'left', color: '#d4a017', fontWeight: '700', fontSize: '11px', letterSpacing: '0.6px', textTransform: 'uppercase', fontFamily: 'Georgia, serif' },
  td:             { padding: '9px 14px', color: '#2a2a2a', borderBottom: '1px solid #f0ece4', verticalAlign: 'middle' },
  emptyCell:      { padding: '32px 14px', textAlign: 'center', color: '#bbb', fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '13px' },
  inlineInp:      { width: '100%', padding: '5px 8px', border: '1px solid #d4a017', borderRadius: '5px', fontSize: '12px', fontFamily: 'Georgia, serif', color: '#2a2a2a', outline: 'none', background: '#fffdf5' },

  renameBtn:      { padding: '4px 10px', background: '#fdf3d8', color: '#b8860b', border: '1px solid #d4a017', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Georgia, serif', fontWeight: '700', marginRight: '5px' },
  deleteBtn:      { padding: '4px 10px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Georgia, serif', fontWeight: '700' },
  saveBtn:        { padding: '4px 10px', background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Georgia, serif', fontWeight: '700', marginRight: '5px' },
  cancelBtn:      { padding: '4px 10px', background: '#f3f4f6', color: '#4b5563', border: '1px solid #d1d5db', borderRadius: '5px', cursor: 'pointer', fontSize: '11px', fontFamily: 'Georgia, serif', fontWeight: '700' },
};
