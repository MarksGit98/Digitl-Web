import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, BUTTON_BORDER } from '../constants/sizing';
import GameIconButton from '../components/GameIconButton';

export default function ContactScreen() {
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
      paddingBottom: '100px', // Extra padding for bottom ad
      paddingLeft: `${SPACING.CONTAINER_PADDING_HORIZONTAL}px`,
      paddingRight: `${SPACING.CONTAINER_PADDING_HORIZONTAL}px`,
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
      backgroundColor: COLORS.BACKGROUND_WHITE,
      color: COLORS.BACKGROUND_DARK,
      padding: `${SPACING.PADDING_SMALL * 0.765}px ${SPACING.PADDING_MEDIUM * 0.765}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.765}px`,
      textAlign: 'center' as const,
      fontWeight: 'bold' as const,
      flex: 1,
      boxShadow: '3px 3px 0 0 rgba(0, 0, 0, 1)',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
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
      width: '100%',
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
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <GameIconButton style={{ marginRight: `${SPACING.PADDING_MEDIUM}px` }} />
        <h1 style={styles.title}>Contact Us</h1>
      </div>

      <div style={styles.content}>
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
