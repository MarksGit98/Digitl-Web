import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, BUTTON_BORDER } from '../constants/sizing';
import InstructionsContent from '../components/InstructionsContent';
import homeSvg from '../assets/svgs/home.svg';

export default function HowToPlayScreen() {
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
    instructionsWrapper: {
      width: '85%',
      backgroundColor: 'transparent',
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
        <h1 style={styles.title}>How to Play DIGITL</h1>
      </div>

      <div style={styles.content}>

        <p style={styles.paragraph}>
          DIGITL is a number puzzle game where you combine digits using mathematical operations to reach a target number.
        </p>

        <h2 style={styles.sectionTitle}>Basic Rules</h2>
        <div style={styles.instructionsWrapper}>
          <InstructionsContent />
        </div>

        <h2 style={styles.sectionTitle}>Game Modes</h2>
        <p style={styles.paragraph}>
          <strong>Daily Challenge:</strong> A new set of three puzzles every day. Complete an Easy, Medium, and Hard puzzle.
        </p>
        <p style={styles.paragraph}>
          <strong>Daily Timed:</strong> The same three puzzles as the Daily Challenge, but with a timer. Race against the clock!
        </p>
        <p style={styles.paragraph}>
          <strong>Sandbox Mode:</strong> Practice with unlimited randomly generated puzzles at your chosen difficulty.
        </p>

        <h2 style={styles.sectionTitle}>Difficulty Levels</h2>
        <p style={styles.paragraph}>
          <strong>Easy:</strong> 4 number tiles. Great for beginners.
        </p>
        <p style={styles.paragraph}>
          <strong>Medium:</strong> 5 number tiles. More combinations to consider.
        </p>
        <p style={styles.paragraph}>
          <strong>Hard:</strong> 6 number tiles. The ultimate challenge!
        </p>

        <h2 style={styles.sectionTitle}>Tips</h2>
        <p style={styles.paragraph}>
          Start by looking for easy combinations that get you close to the target. You can undo moves if you get stuck. Division only works when the result is a whole number.
        </p>

        <p style={{ ...styles.paragraph, fontSize: FONT_SIZES.SUBTEXT * 0.9, marginTop: `${SPACING.VERTICAL_SPACING * 2}px` }}>
          © {new Date().getFullYear()} Rubber Ducky Games. All rights reserved.
        </p>
      </div>
    </div>
  );
}
