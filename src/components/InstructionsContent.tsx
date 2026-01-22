import { SCREEN_DIMENSIONS, SPACING, COLORS, FONT_SIZES, BUTTON_BORDER, LETTER_SPACING } from '../constants/sizing';

const SCREEN_WIDTH = SCREEN_DIMENSIONS.WIDTH;

export default function InstructionsContent() {
  const styles = {
    instructionsContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: `${SPACING.PADDING_SMALL}px`,
      paddingLeft: `${SPACING.PADDING_LARGE}px`,
      paddingRight: `${SPACING.PADDING_LARGE}px`,
      listStyleType: 'disc' as const,
      paddingTop: `${SPACING.VERTICAL_SPACING}px`,
      paddingBottom: `${SPACING.VERTICAL_SPACING}px`,
    },
    instructionTextContainer: {
      display: 'flex',
      flexDirection: 'row' as const,
      flexWrap: 'nowrap' as const,
      alignItems: 'center',
      flex: 1,
      listStyle: 'none' as const,
      lineHeight: '1.5',
    },
    instructionText: {
      fontSize: FONT_SIZES.SUBTEXT * 0.85, // Decreased by 15%
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_PRIMARY,
      letterSpacing: `${LETTER_SPACING.TIGHT}px`,
      opacity: 0.8,
    },
    inlineTileContainer: {
      display: 'inline-flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      marginLeft: '4px',
      marginRight: '4px',
      flexShrink: 0,
      flexGrow: 0,
      verticalAlign: 'middle',
      whiteSpace: 'nowrap' as const,
      lineHeight: '1',
    },
    miniTile: {
      display: 'inline-flex',
      width: `${SCREEN_WIDTH * 0.028}px`,
      height: `${SCREEN_WIDTH * 0.028}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE,
      borderRadius: `${SCREEN_WIDTH * 0.007}px`,
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '2px',
      marginRight: '2px',
      verticalAlign: 'middle',
    },
    miniTileText: {
      fontSize: FONT_SIZES.SUBTEXT * 0.6,
      color: COLORS.TEXT_PRIMARY,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
      lineHeight: 1,
      marginTop: '-1px',
    },
    inlineOperationContainer: {
      display: 'inline-flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      marginLeft: '4px',
      marginRight: '4px',
      flexShrink: 0,
      flexGrow: 0,
      verticalAlign: 'middle',
    },
    miniOperation: {
      display: 'inline-flex',
      width: `${SCREEN_WIDTH * 0.028}px`,
      height: `${SCREEN_WIDTH * 0.028}px`,
      backgroundColor: COLORS.BUTTON_ORANGE,
      borderRadius: '50%',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: '2px',
      marginRight: '2px',
      verticalAlign: 'middle',
    },
    miniOperationText: {
      fontSize: FONT_SIZES.SUBTEXT * 0.5,
      color: COLORS.TEXT_WHITE,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
      lineHeight: 1,
      marginTop: '-1px',
    },
    inlineTargetContainer: {
      display: 'inline-flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      marginLeft: '4px',
      marginRight: '4px',
      verticalAlign: 'middle',
    },
    miniTarget: {
      minWidth: `${SCREEN_WIDTH * 0.08 * 0.65}px`,
      height: `${SCREEN_WIDTH * 0.05 * 0.65}px`,
      backgroundColor: COLORS.BACKGROUND_DARK,
      borderRadius: `${SCREEN_WIDTH * 0.01 * 0.65}px`,
      border: `${BUTTON_BORDER.WIDTH * 1.2}px solid ${BUTTON_BORDER.COLOR}`,
      paddingLeft: `${SCREEN_WIDTH * 0.01 * 0.65}px`,
      paddingRight: `${SCREEN_WIDTH * 0.01 * 0.65}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    miniTargetText: {
      fontSize: FONT_SIZES.SUBTEXT * 0.7,
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
      lineHeight: 1,
      marginTop: '-1px',
    },
  };

  return (
    <ul style={styles.instructionsContent}>
      <li style={styles.instructionTextContainer}>
        <span style={styles.instructionText}>
          • Each puzzle begins with a set of single digit number tiles{' '}
          <span style={styles.inlineTileContainer}>
            <span style={styles.miniTile}><span style={styles.miniTileText}>7</span></span>
            <span style={styles.miniTile}><span style={styles.miniTileText}>3</span></span>
            <span style={styles.miniTile}><span style={styles.miniTileText}>5</span></span>
            <span style={styles.miniTile}><span style={styles.miniTileText}>2</span></span>
          </span>
          , 4 mathematical operators{' '}
          <span style={styles.inlineOperationContainer}>
            <span style={styles.miniOperation}><span style={styles.miniOperationText}>+</span></span>
            <span style={styles.miniOperation}><span style={styles.miniOperationText}>−</span></span>
            <span style={styles.miniOperation}><span style={styles.miniOperationText}>×</span></span>
            <span style={styles.miniOperation}><span style={styles.miniOperationText}>÷</span></span>
          </span>
          , and a target number{' '}
          <span style={styles.inlineTargetContainer}>
            <span style={styles.miniTarget}><span style={styles.miniTargetText}>42</span></span>
          </span>
          .
        </span>
      </li>
      <li style={styles.instructionTextContainer}>
        <span style={styles.instructionText}>
        • Select two numbers from the available digits and one of the math symbols to perform an operation.
        </span>
      </li>
      <li style={styles.instructionTextContainer}>
        <span style={styles.instructionText}>
        • Only operations that result in positive integers are valid.
        </span>
      </li>
      <li style={styles.instructionTextContainer}>
        <span style={styles.instructionText}>
        • Continue performing operations until you are left with a single number tile equal to the target number.
        </span>
      </li>
    </ul>
  );
}

