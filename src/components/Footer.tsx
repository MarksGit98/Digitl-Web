import { FONT_SIZES, SPACING, COLORS } from '../constants/sizing';
import mailSvg from '../assets/svgs/mail-icon.svg';
import librarySvg from '../assets/svgs/library.svg';
import shieldSvg from '../assets/svgs/shield-icon.svg';

const FOOTER_HEIGHT = 70; // Approximate height of the footer

const styles = {
  footer: {
    position: 'fixed' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderTop: '1px solid #000000',
    padding: `${SPACING.VERTICAL_SPACING}px ${SPACING.CONTAINER_PADDING_HORIZONTAL}px`,
    zIndex: 100,
  },
  footerContent: {
    maxWidth: '650px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    gap: '24px',
  },
  footerLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: FONT_SIZES.SUBTEXT,
    fontFamily: 'var(--font-button)',
    color: COLORS.TEXT_PRIMARY,
    textDecoration: 'none',
    opacity: 0.8,
    cursor: 'pointer',
    transition: 'opacity 0.2s ease',
    background: 'none',
    border: 'none',
    padding: '0',
  },
};

export { FOOTER_HEIGHT };

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.footerContent}>
        <a
          href="/how-to-play"
          style={styles.footerLink}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <img src={librarySvg} alt="help" width="16" height="16" style={{ display: 'block', position: 'relative', top: '1px' }} />
          How to Play
        </a>
        <a
          href="/privacy-policy"
          style={styles.footerLink}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <img src={shieldSvg} alt="privacy" width="16" height="16" style={{ display: 'block', position: 'relative', top: '1px' }} />
          Privacy Policy
        </a>
        <a
          href="/contact"
          style={styles.footerLink}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <img src={mailSvg} alt="mail" width="16" height="16" style={{ display: 'block', position: 'relative', top: '1px' }} />
          Contact
        </a>
      </div>
    </footer>
  );
}
