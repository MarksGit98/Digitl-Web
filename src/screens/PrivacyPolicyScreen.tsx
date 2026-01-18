import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, BUTTON_BORDER } from '../constants/sizing';
import homeSvg from '../assets/svgs/home.svg';

export default function PrivacyPolicyScreen() {
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
    headerRow: {
      width: '100%',
      maxWidth: '650px',
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
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
      fontWeight: 'bold' as const,
      flex: 1,
    },
    lastUpdated: {
      fontSize: FONT_SIZES.SUBTEXT * 0.9,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_SECONDARY,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      textAlign: 'center' as const,
      fontStyle: 'italic' as const,
      opacity: 0.8,
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
    list: {
      fontSize: FONT_SIZES.SUBTEXT,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_PRIMARY,
      lineHeight: '1.5',
      marginLeft: `${SPACING.PADDING_LARGE}px`,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      opacity: 0.8,
      width: '85%',
      textAlign: 'left' as const,
    },
    listItem: {
      marginBottom: `${SPACING.VERTICAL_SPACING * 0.5}px`,
    },
    link: {
      color: COLORS.DIFFICULTY_MEDIUM,
      textDecoration: 'underline' as const,
    },
    homeButton: {
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
      marginRight: `${SPACING.PADDING_MEDIUM}px`,
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
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
        <h1 style={styles.title}>Privacy Policy</h1>
      </div>

      <div style={styles.content}>
        <p style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2 style={styles.sectionTitle}>Introduction</h2>
        <p style={styles.paragraph}>
          This Privacy Policy describes how DIGITL ("we", "our", or "us") collects, uses, and protects your information when you use our web application.
        </p>

        <h2 style={styles.sectionTitle}>Information We Collect</h2>
        <p style={styles.paragraph}>
          <strong>Game Progress Data:</strong> We store your game progress locally on your device, including:
        </p>
        <ul style={styles.list}>
          <li style={styles.listItem}>Current level reached</li>
          <li style={styles.listItem}>Maximum level unlocked</li>
          <li style={styles.listItem}>Game settings and preferences</li>
          <li style={styles.listItem}>Daily challenge progress</li>
          <li style={styles.listItem}>Completed puzzles</li>
        </ul>

        <h2 style={styles.sectionTitle}>How We Use Your Information</h2>
        <p style={styles.paragraph}>
          We use the information we collect to save your game progress, provide a personalized gaming experience, and improve our app's functionality.
        </p>

        <h2 style={styles.sectionTitle}>Data Storage</h2>
        <p style={styles.paragraph}>
          All game data is stored locally on your device using secure storage methods. We do not collect, store, or transmit your personal information to external servers.
        </p>

        <h2 style={styles.sectionTitle}>Third-Party Services</h2>
        <p style={styles.paragraph}>
          DIGITL uses Firebase to store anonymous game analytics, including Daily Challenge completion times for leaderboard functionality. This data does not include any personally identifiable information. We do not use advertising or other data collection services.
        </p>

        <h2 style={styles.sectionTitle}>Children's Privacy</h2>
        <p style={styles.paragraph}>
          Our app is suitable for all ages. We do not knowingly collect personal information from children under 13.
        </p>

        <h2 style={styles.sectionTitle}>Changes to This Policy</h2>
        <p style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 style={styles.sectionTitle}>Contact Us</h2>
        <p style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:rubberduckygamescontact@gmail.com" style={styles.link}>rubberduckygamescontact@gmail.com</a>
        </p>

        <p style={{ ...styles.paragraph, fontSize: FONT_SIZES.SUBTEXT * 0.9, marginTop: `${SPACING.VERTICAL_SPACING * 2}px` }}>
          © {new Date().getFullYear()} Rubber Ducky Games. All rights reserved.
        </p>
      </div>
    </div>
  );
}
