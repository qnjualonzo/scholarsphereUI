import { S } from '../styles/authStyles';

export function Footer() {
  return (
    <footer style={S.footer}>
      <span style={S.footerLink}>Terms and Conditions</span>
      <span style={S.footerLink}>Privacy Policy</span>
    </footer>
  );
}
