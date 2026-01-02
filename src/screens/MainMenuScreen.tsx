import { useState } from 'react';
import { Difficulty } from '../types';
import { FONT_SIZES, SPACING, COLORS, BUTTON_BORDER, SCREEN_DIMENSIONS, LETTER_SPACING, ANIMATION, CALCULATOR_DISPLAY, BORDER_RADIUS } from '../constants/sizing';
import { create3DButtonStyle } from '../styles/buttonStyles';
import presentSvg from '../assets/svgs/present.svg';
import calendarSvg from '../assets/svgs/calendar-icon.svg';

const SCREEN_WIDTH = SCREEN_DIMENSIONS.WIDTH;
const SCREEN_HEIGHT = SCREEN_DIMENSIONS.HEIGHT;

interface MainMenuScreenProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStartDailyChallenge: () => void;
  onStartSandbox: () => void;
}

export default function MainMenuScreen({
  selectedDifficulty,
  onDifficultyChange,
  onStartDailyChallenge,
  onStartSandbox,
}: MainMenuScreenProps) {
  const [hoveredDifficulty, setHoveredDifficulty] = useState<Difficulty | null>(null);
  const [pressedDifficulty, setPressedDifficulty] = useState<Difficulty | null>(null);

  const easyButtonStyle = create3DButtonStyle('success', 'small');
  const mediumButtonStyle = create3DButtonStyle('warning', 'small');
  const hardButtonStyle = create3DButtonStyle('danger', 'small');

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: '20px',
      paddingBottom: '20px',
      paddingLeft: '20px',
      paddingRight: '20px',
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
      scrollbarWidth: 'none' as const, // Firefox
      msOverflowStyle: 'none' as const, // IE and Edge
    },
    content: {
      maxWidth: '650px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    title: {
      width: `${CALCULATOR_DISPLAY.WIDTH * 0.9 * 0.85 * 0.9}px`, // Scaled down 15% then another 10%
      height: `${CALCULATOR_DISPLAY.HEIGHT * 0.85 * 0.9}px`, // Scaled down 15% then another 10%
      borderRadius: `${CALCULATOR_DISPLAY.BORDER_RADIUS}px`,
      backgroundColor: COLORS.BACKGROUND_DARK,
      paddingHorizontal: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL}px`,
      paddingTop: `${CALCULATOR_DISPLAY.PADDING_VERTICAL}px`,
      paddingBottom: `${CALCULATOR_DISPLAY.PADDING_VERTICAL}px`,
      marginTop: SPACING.CALCULATOR_DISPLAY_MARGIN * 0.8, // Reduced by 20%
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      pointerEvents: 'none' as const, // Prevent mouse interaction
      // Metallic border effect matching calculator display
      borderTopColor: '#B0B0B0',
      borderLeftColor: '#909090',
      borderRightColor: '#404040',
      borderBottomColor: '#404040',
      borderTopWidth: `${BUTTON_BORDER.WIDTH * 5}px`,
      borderLeftWidth: `${BUTTON_BORDER.WIDTH * 5}px`,
      borderRightWidth: `${BUTTON_BORDER.WIDTH * 5}px`,
      borderBottomWidth: `${BUTTON_BORDER.WIDTH * 5}px`,
      borderStyle: 'solid',
      boxShadow: '0 1px 2px rgba(160, 160, 160, 0.3)',
    },
    titleInner: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      zIndex: 2,
      overflow: 'hidden' as const,
    },
    titleText: {
      fontSize: FONT_SIZES.PLAY_BUTTON_TEXT * 0.85 * 0.9 * 1.1, // Scaled down 15% then another 10%, then increased by 10%
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
      letterSpacing: `${LETTER_SPACING.WIDE * 0.85}px`, // Scaled down 15%
      textAlign: 'center' as const,
      lineHeight: `${FONT_SIZES.PLAY_BUTTON_TEXT * 0.95 * 0.85}px`, // Scaled down 15%
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: '2px 2px',
      textShadowRadius: '3px',
      zIndex: 2,
      position: 'relative' as const,
      whiteSpace: 'nowrap' as const,
      animation: 'chyron 10s linear infinite',
      pointerEvents: 'none' as const, // Prevent mouse interaction
      fontWeight: 900 as const, // Increased boldness (from default to 900)
    },
    sectionTitle: {
      fontSize: FONT_SIZES.TITLE * 0.6 * 0.85 * 0.9, // Scaled down 15% then another 10%
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: COLORS.BACKGROUND_DARK,
      color: COLORS.TEXT_WHITE,
      padding: `${SPACING.PADDING_SMALL * 0.85 * 0.9}px ${SPACING.PADDING_MEDIUM * 0.85 * 0.9}px`, // Scaled down 15% then another 10%
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.85 * 0.9}px`, // Scaled down 15% then another 10%
      textAlign: 'center' as const,
      marginTop: SPACING.BANNER_MARGIN * 0.8, // Reduced by 20%
      marginBottom: SPACING.BANNER_MARGIN * 0.8, // Reduced by 20%
      fontWeight: 'bold' as const,
      width: '100%',
    },
    sectionDescription: {
      fontSize: FONT_SIZES.HISTORY_TEXT,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_PRIMARY,
      textAlign: 'center' as const,
      marginBottom: SPACING.MARGIN_MEDIUM * 0.8, // Reduced by 20%
      maxWidth: `${CALCULATOR_DISPLAY.WIDTH * 0.8}px`,
      opacity: 0.8,
    },
    instructionsTitle: {
      fontSize: FONT_SIZES.TITLE,
      color: COLORS.TEXT_WHITE,
      backgroundColor: COLORS.BACKGROUND_DARK,
      padding: `${SPACING.PADDING_MEDIUM}px ${SPACING.PADDING_LARGE}px`,
      marginBottom: SPACING.MARGIN_MEDIUM * 0.8, // Reduced by 20%
      fontWeight: 'bold' as const,
      textAlign: 'center' as const,
      borderRadius: `${BORDER_RADIUS.MEDIUM}px`,
      display: 'inline-block' as const,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    },
    instructionsContainer: {
      width: `${CALCULATOR_DISPLAY.WIDTH * 1.2}px`,
      maxWidth: `${CALCULATOR_DISPLAY.WIDTH * 1.2}px`,
      backgroundColor: 'transparent',
      maxHeight: SCREEN_HEIGHT * 0.5,
      overflowY: 'auto' as const,
    },
    instructionsContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: `${SPACING.PADDING_MEDIUM}px`,
      paddingLeft: `${SPACING.PADDING_LARGE}px`,
      paddingRight: `${SPACING.PADDING_LARGE}px`,
      listStyleType: 'disc' as const,
      margin: 0,
      paddingTop: `${SPACING.PADDING_MEDIUM}px`,
      paddingBottom: `${SPACING.PADDING_MEDIUM}px`,
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
      fontSize: FONT_SIZES.HISTORY_TEXT * 0.85, // Decreased by 15%
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
      fontSize: FONT_SIZES.HISTORY_TEXT * 0.6,
      color: COLORS.TEXT_PRIMARY,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
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
      fontSize: FONT_SIZES.HISTORY_TEXT * 0.5,
      color: COLORS.TEXT_WHITE,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
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
      minWidth: `${SCREEN_WIDTH * 0.08}px`,
      height: `${SCREEN_WIDTH * 0.05}px`,
      backgroundColor: COLORS.BACKGROUND_DARK,
      borderRadius: `${SCREEN_WIDTH * 0.01}px`,
      border: `${BUTTON_BORDER.WIDTH * 2}px solid ${BUTTON_BORDER.COLOR}`,
      paddingHorizontal: `${SCREEN_WIDTH * 0.01}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    miniTargetText: {
      fontSize: FONT_SIZES.HISTORY_TEXT * 0.7,
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
    },
    playButton: {
      width: `${CALCULATOR_DISPLAY.WIDTH * 0.8}px`, // Reduced by 20%
      height: `${CALCULATOR_DISPLAY.HEIGHT}px`,
      borderRadius: `${CALCULATOR_DISPLAY.BORDER_RADIUS}px`,
      backgroundColor: COLORS.BACKGROUND_DARK,
      paddingHorizontal: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL}px`,
      paddingTop: `${CALCULATOR_DISPLAY.PADDING_VERTICAL}px`,
      paddingBottom: `${CALCULATOR_DISPLAY.PADDING_VERTICAL}px`,
      marginTop: SPACING.CALCULATOR_DISPLAY_MARGIN * 0.8, // Reduced by 20%
      marginBottom: SPACING.CALCULATOR_DISPLAY_MARGIN * 0.8, // Reduced by 20%
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      cursor: 'pointer',
      // Subtle glisten effect with shadow
      boxShadow: '0 1px 2px rgba(160, 160, 160, 0.3)',
    },
    dailyChallengeButton: {
      padding: `${14 * 0.85 * 0.85}px ${24 * 0.85 * 0.85}px`, // Scaled down 15% then another 15%
      minWidth: `${200 * 0.85 * 0.85}px`,
      minHeight: `${50 * 0.85 * 0.85}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.85 * 0.85}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE,
      color: COLORS.TEXT_SECONDARY,
      marginBottom: SPACING.MARGIN_SMALL * 0.8, // Reduced by 20%
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      fontSize: FONT_SIZES.DIFFICULTY_BUTTON * 0.85 * 0.85, // Scaled down 15% then another 15%
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
      boxShadow: '4px 4px 0 0 rgba(0, 0, 0, 1)',
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    },
    sandboxSection: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      marginTop: SPACING.MARGIN_LARGE * 0.8, // Reduced by 20%
    },
    sandboxModeButton: {
      padding: `${14 * 0.85 * 0.85}px ${24 * 0.85 * 0.85}px`, // Scaled down 15% then another 15%
      minWidth: `${200 * 0.85 * 0.85}px`,
      minHeight: `${50 * 0.85 * 0.85}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.85 * 0.85}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE,
      color: COLORS.TEXT_SECONDARY,
      marginTop: SPACING.MARGIN_MEDIUM,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      fontSize: FONT_SIZES.DIFFICULTY_BUTTON * 0.85 * 0.85, // Scaled down 15% then another 15%
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
      boxShadow: '4px 4px 0 0 rgba(0, 0, 0, 1)',
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    },
    sandboxDescription: {
      fontSize: FONT_SIZES.HISTORY_TEXT,
      color: COLORS.TEXT_PRIMARY,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center' as const,
      marginBottom: SPACING.MARGIN_SMALL * 0.8, // Reduced by 20%
      maxWidth: `${CALCULATOR_DISPLAY.WIDTH * 0.8}px`,
    },
    playButtonInner: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      zIndex: 2,
      overflow: 'hidden' as const,
    },
    playButtonInnerBorder: {
      position: 'absolute' as const,
      top: `${BUTTON_BORDER.WIDTH * 5 + 2}px`,
      left: `${BUTTON_BORDER.WIDTH * 5 + 2}px`,
      right: `${BUTTON_BORDER.WIDTH * 5 + 2}px`,
      bottom: `${BUTTON_BORDER.WIDTH * 5 + 2}px`,
      backgroundColor: '#1F1F1F',
      borderRadius: `${Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 5) - 2)}px`,
      zIndex: 0,
    },
    playButtonDarkenOverlay: {
      position: 'absolute' as const,
      top: `${BUTTON_BORDER.WIDTH * 5}px`,
      left: `${BUTTON_BORDER.WIDTH * 5}px`,
      right: `${BUTTON_BORDER.WIDTH * 5}px`,
      bottom: `${BUTTON_BORDER.WIDTH * 5}px`,
      backgroundColor: '#000000',
      borderRadius: `${CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 5)}px`,
      zIndex: 1,
      opacity: 0,
      transition: 'opacity 0.1s ease',
    },
    playButtonText: {
      fontSize: FONT_SIZES.PLAY_BUTTON_TEXT,
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      letterSpacing: `${LETTER_SPACING.WIDE}px`,
      textAlign: 'center' as const,
      lineHeight: `${FONT_SIZES.PLAY_BUTTON_TEXT * 0.95}px`,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: '2px 2px',
      textShadowRadius: '3px',
      zIndex: 2,
      position: 'relative' as const,
      whiteSpace: 'nowrap' as const,
      animation: 'chyronWrap 10s linear infinite',
    },
    difficultyContainer: {
      display: 'flex',
      flexDirection: 'row' as const,
      gap: '15px',

    },
    difficultyButton: {
      padding: `${SPACING.PADDING_SMALL * 0.85}px ${SPACING.PADDING_MEDIUM * 0.85}px`, // Scaled down 15%
      borderRadius: `${BORDER_RADIUS.SMALL * 0.85}px`, // Scaled down 15%
      fontSize: FONT_SIZES.DIFFICULTY_BUTTON * 0.85, // Scaled down 15%
      fontFamily: 'system-ui, -apple-system, sans-serif',
      width: '75px', // Fixed width - all buttons same size (matching medium button from buttonStyles small size)
      minWidth: '75px', // Fixed min width
      minHeight: `${SCREEN_HEIGHT * 0.05 * 0.85}px`, // Scaled down 15%
    },
  };

  return (
    <div style={styles.container} className="hide-scrollbar">
        <div style={styles.content}>
        {/* Game Title - Calculator Display */}
        <div style={styles.title}>
          <div style={styles.playButtonInnerBorder} />
          <div style={styles.titleInner}>
            <span style={styles.titleText}>DIGITL</span>
          </div>
        </div>
        
        {/* Daily Challenge Section */}
        <h2 style={styles.sectionTitle}>Daily Challenge</h2>
        <div style={styles.sectionDescription}>
          Complete three puzzles of increasing difficulty levels.
        </div>
        
        {/* Daily Challenge Button */}
        <button 
          style={styles.dailyChallengeButton}
          onClick={onStartDailyChallenge}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)';
            e.currentTarget.style.boxShadow = '4px 5px 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(4px, 4px)';
            e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Play Daily
            <img src={calendarSvg} alt="calendar" width="20" height="20" style={{ display: 'block' }} />
          </span>
        </button>

        {/* Sandbox Mode Section */}
        <h2 style={styles.sectionTitle}>Sandbox Mode</h2>
        <div style={styles.sectionDescription}>
          Generate random puzzles at your selected difficulty level.
        </div>
        
        <div style={styles.difficultyContainer}>
          <button
            style={{ 
              ...styles.difficultyButton,
              ...(selectedDifficulty === 'easy' ? {
                ...easyButtonStyle.base,
                transform: `translate(${ANIMATION.TRANSLATE_X_SELECTED}px, ${ANIMATION.TRANSLATE_Y_SELECTED}px)`,
                boxShadow: 'none',
                transition: `transform ${ANIMATION.DURATION_FAST}ms ease-out, box-shadow ${ANIMATION.DURATION_FAST}ms ease-out`,
              } : {
                ...easyButtonStyle.base,
                opacity: 0.7,
                transition: `transform ${ANIMATION.DURATION_FAST}ms ease-out, box-shadow ${ANIMATION.DURATION_FAST}ms ease-out`,
              }),
              ...(pressedDifficulty === 'easy' && selectedDifficulty !== 'easy' ? easyButtonStyle.pressed : {}),
              ...(hoveredDifficulty === 'easy' && pressedDifficulty !== 'easy' && selectedDifficulty !== 'easy' ? easyButtonStyle.hover : {}),
              // Border matching mobile (slightly thicker for home screen)
              borderWidth: `${BUTTON_BORDER.WIDTH * 1.5}px`,
              borderColor: BUTTON_BORDER.COLOR,
              borderStyle: 'solid',
            }}
            onClick={() => onDifficultyChange('easy')}
            onMouseEnter={() => setHoveredDifficulty('easy')}
            onMouseLeave={() => {
              setHoveredDifficulty(null);
              setPressedDifficulty(null);
            }}
            onMouseDown={() => setPressedDifficulty('easy')}
            onMouseUp={() => setPressedDifficulty(null)}
          >
            EASY
          </button>
          <button
            style={{ 
              ...styles.difficultyButton,
              ...(selectedDifficulty === 'medium' ? {
                ...mediumButtonStyle.base,
                transform: `translate(${ANIMATION.TRANSLATE_X_SELECTED}px, ${ANIMATION.TRANSLATE_Y_SELECTED}px)`,
                boxShadow: 'none',
                transition: `transform ${ANIMATION.DURATION_FAST}ms ease-out, box-shadow ${ANIMATION.DURATION_FAST}ms ease-out`,
              } : {
                ...mediumButtonStyle.base,
                opacity: 0.7,
                transition: `transform ${ANIMATION.DURATION_FAST}ms ease-out, box-shadow ${ANIMATION.DURATION_FAST}ms ease-out`,
              }),
              ...(pressedDifficulty === 'medium' && selectedDifficulty !== 'medium' ? mediumButtonStyle.pressed : {}),
              ...(hoveredDifficulty === 'medium' && pressedDifficulty !== 'medium' && selectedDifficulty !== 'medium' ? mediumButtonStyle.hover : {}),
              // Border matching mobile (slightly thicker for home screen)
              borderWidth: `${BUTTON_BORDER.WIDTH * 1.5}px`,
              borderColor: BUTTON_BORDER.COLOR,
              borderStyle: 'solid',
            }}
            onClick={() => onDifficultyChange('medium')}
            onMouseEnter={() => setHoveredDifficulty('medium')}
            onMouseLeave={() => {
              setHoveredDifficulty(null);
              setPressedDifficulty(null);
            }}
            onMouseDown={() => setPressedDifficulty('medium')}
            onMouseUp={() => setPressedDifficulty(null)}
          >
            MEDIUM
          </button>
          <button
            style={{ 
              ...styles.difficultyButton,
              ...(selectedDifficulty === 'hard' ? {
                ...hardButtonStyle.base,
                transform: `translate(${ANIMATION.TRANSLATE_X_SELECTED}px, ${ANIMATION.TRANSLATE_Y_SELECTED}px)`,
                boxShadow: 'none',
                transition: `transform ${ANIMATION.DURATION_FAST}ms ease-out, box-shadow ${ANIMATION.DURATION_FAST}ms ease-out`,
              } : {
                ...hardButtonStyle.base,
                opacity: 0.7,
                transition: `transform ${ANIMATION.DURATION_FAST}ms ease-out, box-shadow ${ANIMATION.DURATION_FAST}ms ease-out`,
              }),
              ...(pressedDifficulty === 'hard' && selectedDifficulty !== 'hard' ? hardButtonStyle.pressed : {}),
              ...(hoveredDifficulty === 'hard' && pressedDifficulty !== 'hard' && selectedDifficulty !== 'hard' ? hardButtonStyle.hover : {}),
              // Border matching mobile (slightly thicker for home screen)
              borderWidth: `${BUTTON_BORDER.WIDTH * 1.5}px`,
              borderColor: BUTTON_BORDER.COLOR,
              borderStyle: 'solid',
            }}
            onClick={() => onDifficultyChange('hard')}
            onMouseEnter={() => setHoveredDifficulty('hard')}
            onMouseLeave={() => {
              setHoveredDifficulty(null);
              setPressedDifficulty(null);
            }}
            onMouseDown={() => setPressedDifficulty('hard')}
            onMouseUp={() => setPressedDifficulty(null)}
          >
            HARD
          </button>
        </div>
        
        {/* Sandbox Mode Button */}
        <button 
          style={styles.sandboxModeButton}
          onClick={onStartSandbox}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)';
            e.currentTarget.style.boxShadow = '4px 5px 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translate(4px, 4px)';
            e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Play Sandbox
            <img src={presentSvg} alt="present" width="20" height="20" style={{ display: 'block' }} />
          </span>
        </button>
        
        {/* How to Play Section */}
        <h2 style={styles.sectionTitle}>How to Play</h2>
        
        <div style={styles.instructionsContainer}>
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
        </div>
      </div>
    </div>
  );
}

