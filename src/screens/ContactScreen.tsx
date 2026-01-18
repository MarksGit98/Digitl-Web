import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, BUTTON_BORDER } from '../constants/sizing';
import homeSvg from '../assets/svgs/home.svg';

export default function ContactScreen() {
  const homeButtonSize = 36;

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: `${SPACING.VERTICAL_SPACING}px`,
      paddingBottom: '20px',
      paddingLeft: '20px',
      paddingRight: '20px',
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
    },
    content: {
      maxWidth: '650px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    title: {
      fontSize: FONT_SIZES.TITLE * 0.459,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: COLORS.BACKGROUND_DARK,
      color: COLORS.TEXT_WHITE,
      padding: `${SPACING.PADDING_SMALL * 0.765}px ${SPACING.PADDING_MEDIUM * 0.765}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.765}px`,
      textAlign: 'center' as const,
      marginTop: `${SPACING.VERTICAL_SPACING}px`,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      fontWeight: 'bold' as const,
      width: '100%',
    },
    sectionTitle: {
      fontSize: FONT_SIZES.TITLE * 0.459,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: COLORS.BACKGROUND_DARK,
      color: COLORS.TEXT_WHITE,
      padding: `${SPACING.PADDING_SMALL * 0.765}px ${SPACING.PADDING_MEDIUM * 0.765}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.765}px`,
      textAlign: 'center' as const,
      marginTop: `${SPACING.VERTICAL_SPACING}px`,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      fontWeight: 'bold' as const,
      width: '100%',
    },
    paragraph: {
      fontSize: FONT_SIZES.SUBTEXT,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_PRIMARY,
      textAlign: 'center' as const,
      marginTop: `${SPACING.VERTICAL_SPACING}px`,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      opacity: 0.8,
      width: '85%',
      lineHeight: '1.5',
    },
    link: {
      color: COLORS.DIFFICULTY_MEDIUM,
      textDecoration: 'underline' as const,
    },
    contactCard: {
      width: '85%',
      backgroundColor: COLORS.BACKGROUND_WHITE,
      borderRadius: `${BORDER_RADIUS.MEDIUM}px`,
      padding: `${SPACING.PADDING_MEDIUM}px`,
      border: `2px solid ${COLORS.BACKGROUND_DARK}`,
      boxShadow: '3px 3px 0 0 rgba(0, 0, 0, 1)',
      marginTop: `${SPACING.VERTICAL_SPACING}px`,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      fontSize: FONT_SIZES.SUBTEXT,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_PRIMARY,
    },
    contactLabel: {
      fontWeight: 'bold' as const,
    },
    homeButton: {
      position: 'absolute' as const,
      top: `${SPACING.PADDING_MEDIUM}px`,
      left: `${SPACING.PADDING_MEDIUM}px`,
      width: `${homeButtonSize}px`,
      height: `${homeButtonSize}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      textDecoration: 'none' as const,
      boxShadow: '3px 3px 0 0 rgba(0, 0, 0, 1)',
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    },
  };

  return (
    <div style={styles.container}>
      <a
        href="/"
        style={styles.homeButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translate(-1px, -1px)';
          e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(0, 0)';
          e.currentTarget.style.boxShadow = '3px 3px 0 0 rgba(0, 0, 0, 1)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translate(3px, 3px)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translate(0, 0)';
          e.currentTarget.style.boxShadow = '3px 3px 0 0 rgba(0, 0, 0, 1)';
        }}
      >
        <img src={homeSvg} alt="Home" width={homeButtonSize * 0.5} height={homeButtonSize * 0.5} />
      </a>

      <div style={styles.content}>
        <h1 style={styles.title}>Contact Us</h1>

        <p style={styles.paragraph}>
          We'd love to hear from you! Whether you have feedback, suggestions, or bug reports, feel free to reach out.
        </p>

        <div style={styles.contactCard}>
          <div style={{ ...styles.contactItem, marginBottom: 0 }}>
            <span style={styles.contactLabel}>Email:</span>
            <a href="mailto:rubberduckygamescontact@gmail.com" style={styles.link}>
              rubberduckygamescontact@gmail.com
            </a>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>Feedback</h2>
        <p style={styles.paragraph}>
          Your feedback helps us make DIGITL better! Let us know if you encounter any issues or have ideas for new features.
        </p>

        <h2 style={styles.sectionTitle}>Other Games</h2>
        <p style={styles.paragraph}>
          Check out our other game{' '}
          <a href="https://peopleplacesandthings.io" target="_blank" rel="noopener noreferrer" style={styles.link}>
            People, Places & Things
          </a>
          !
        </p>

        <p style={{ ...styles.paragraph, fontSize: FONT_SIZES.SUBTEXT * 0.9, marginTop: `${SPACING.VERTICAL_SPACING * 2}px` }}>
          © {new Date().getFullYear()} Rubber Ducky Games. All rights reserved.
        </p>
      </div>
    </div>
  );
}
