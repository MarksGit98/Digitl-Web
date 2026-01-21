import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS, BUTTON_BORDER } from '../constants/sizing';
import InstructionsContent from '../components/InstructionsContent';
import GameIconButton from '../components/GameIconButton';

export default function HowToPlayScreen() {
  const styles = {
    container: {
      width: '100%',
      height: 'calc(100vh - 80px)', // Leave room for bottom ad
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: `${SPACING.VERTICAL_SPACING}px`,
      paddingBottom: `${SPACING.VERTICAL_SPACING}px`,
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
    instructionsWrapper: {
      width: '85%',
      backgroundColor: 'transparent',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <GameIconButton style={{ marginRight: `${SPACING.PADDING_MEDIUM}px` }} />
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
