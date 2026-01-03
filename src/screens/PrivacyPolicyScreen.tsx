import { COLORS, FONT_SIZES, SPACING } from '../constants/sizing';

export default function PrivacyPolicyScreen() {
  const styles = {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: `${SPACING.PADDING_LARGE}px`,
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
    },
    content: {
      maxWidth: '800px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: `${SPACING.MARGIN_MEDIUM}px`,
    },
    title: {
      fontSize: FONT_SIZES.TITLE * 1.5,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
      color: COLORS.BACKGROUND_DARK,
      marginBottom: `${SPACING.MARGIN_MEDIUM}px`,
      textAlign: 'center' as const,
    },
    lastUpdated: {
      fontSize: FONT_SIZES.BODY_TEXT,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_SECONDARY,
      marginBottom: `${SPACING.MARGIN_LARGE}px`,
      textAlign: 'center' as const,
      fontStyle: 'italic' as const,
    },
    section: {
      marginBottom: `${SPACING.MARGIN_LARGE}px`,
    },
    sectionTitle: {
      fontSize: FONT_SIZES.TITLE,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
      color: COLORS.BACKGROUND_DARK,
      marginBottom: `${SPACING.MARGIN_SMALL}px`,
    },
    paragraph: {
      fontSize: FONT_SIZES.BODY_TEXT,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_PRIMARY,
      lineHeight: '1.6',
      marginBottom: `${SPACING.MARGIN_SMALL}px`,
    },
    list: {
      fontSize: FONT_SIZES.BODY_TEXT,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_PRIMARY,
      lineHeight: '1.6',
      marginLeft: `${SPACING.PADDING_LARGE}px`,
      marginBottom: `${SPACING.MARGIN_SMALL}px`,
    },
    listItem: {
      marginBottom: `${SPACING.MARGIN_SMALL * 0.5}px`,
    },
    link: {
      color: COLORS.DIFFICULTY_MEDIUM,
      textDecoration: 'underline' as const,
    },
    backButton: {
      position: 'absolute' as const,
      top: `${SPACING.PADDING_MEDIUM}px`,
      left: `${SPACING.PADDING_MEDIUM}px`,
      padding: `${SPACING.PADDING_SMALL}px ${SPACING.PADDING_MEDIUM}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE,
      color: COLORS.TEXT_SECONDARY,
      border: `2px solid ${COLORS.BACKGROUND_DARK}`,
      borderRadius: '8px',
      fontSize: FONT_SIZES.BODY_TEXT,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      cursor: 'pointer',
      textDecoration: 'none' as const,
      display: 'inline-block',
      boxShadow: '2px 2px 0 0 rgba(0, 0, 0, 1)',
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    },
  };

  return (
    <div style={styles.container}>
      <a
        href="/"
        style={styles.backButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translate(-1px, -1px)';
          e.currentTarget.style.boxShadow = '3px 3px 0 0 rgba(0, 0, 0, 1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translate(0, 0)';
          e.currentTarget.style.boxShadow = '2px 2px 0 0 rgba(0, 0, 0, 1)';
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translate(2px, 2px)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translate(0, 0)';
          e.currentTarget.style.boxShadow = '2px 2px 0 0 rgba(0, 0, 0, 1)';
        }}
      >
        ← Back to Home
      </a>
      
      <div style={styles.content}>
        <h1 style={styles.title}>Privacy Policy for DIGITL</h1>
        <p style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Introduction</h2>
          <p style={styles.paragraph}>
            This Privacy Policy describes how DIGITL ("we", "our", or "us") collects, uses, and protects your information when you use our web application.
          </p>
        </div>

        <div style={styles.section}>
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
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>How We Use Your Information</h2>
          <p style={styles.paragraph}>
            We use the information we collect to:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>Save your game progress</li>
            <li style={styles.listItem}>Provide a personalized gaming experience</li>
            <li style={styles.listItem}>Improve our app's functionality</li>
          </ul>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Data Storage</h2>
          <p style={styles.paragraph}>
            All game data is stored locally on your device using secure storage methods. We do not collect, store, or transmit your personal information to external servers.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Third-Party Services</h2>
          <p style={styles.paragraph}>
            DIGITL does not integrate with third-party analytics, advertising, or data collection services. Your privacy is our priority.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Children's Privacy</h2>
          <p style={styles.paragraph}>
            Our app is suitable for all ages. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Changes to This Privacy Policy</h2>
          <p style={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Contact Us</h2>
          <p style={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <ul style={styles.list}>
            <li style={styles.listItem}>
              Email: <a href="mailto:privacy@rubberduckygames.com" style={styles.link}>privacy@rubberduckygames.com</a>
            </li>
            <li style={styles.listItem}>
              Website: <a href="https://rubberduckygames.com" target="_blank" rel="noopener noreferrer" style={styles.link}>https://rubberduckygames.com</a>
            </li>
          </ul>
        </div>

        <div style={{ ...styles.section, marginTop: `${SPACING.MARGIN_LARGE}px`, textAlign: 'center' as const }}>
          <p style={{ ...styles.paragraph, fontSize: FONT_SIZES.BODY_TEXT * 0.9, color: COLORS.TEXT_SECONDARY }}>
            © {new Date().getFullYear()} Rubber Ducky Games. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

