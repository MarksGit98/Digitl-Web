import { useState } from 'react';
import { Difficulty } from '../types';
import { FONT_SIZES, SPACING, COLORS, BUTTON_BORDER, SCREEN_DIMENSIONS, LETTER_SPACING, ANIMATION, CALCULATOR_DISPLAY, BORDER_RADIUS } from '../constants/sizing';
import { create3DButtonStyle } from '../styles/buttonStyles';
import presentSvg from '../assets/svgs/present.svg';
import calendarSvg from '../assets/svgs/calendar-icon.svg';
import InstructionsContent from '../components/InstructionsContent';
import { FadedEights } from '../components/FadedEights';

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
      paddingTop: `${SPACING.VERTICAL_SPACING}px`,
      paddingBottom: `${SPACING.VERTICAL_SPACING}px`,
      paddingLeft: '20px',
      paddingRight: '20px',
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
      scrollbarWidth: 'none' as const, // Firefox
      msOverflowStyle: 'none' as const, // IE and Edge
      userSelect: 'none' as const, // Prevent text selection and cursor
      WebkitUserSelect: 'none' as const,
      MozUserSelect: 'none' as const,
      msUserSelect: 'none' as const,
    },
    content: {
      maxWidth: '650px',
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
    },
    title: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.BACKGROUND_DARK,
      paddingHorizontal: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`,
      paddingTop: `${SPACING.VERTICAL_SPACING}px`,
      paddingBottom: `${SPACING.VERTICAL_SPACING}px`,
      borderRadius: `${CALCULATOR_DISPLAY.BORDER_RADIUS * 0.75}px`,
      width: `${CALCULATOR_DISPLAY.WIDTH * 0.5625}px`,
      height: `${CALCULATOR_DISPLAY.HEIGHT * 0.65}px`,
      position: 'relative' as const,
      pointerEvents: 'none' as const, // Prevent mouse interaction
      // Metallic border effect - scaled down borders
      borderTopColor: '#B0B0B0',
      borderLeftColor: '#909090',
      borderRightColor: '#404040',
      borderBottomColor: '#404040',
      borderTopWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`, // Scaled down from 4 to 2.5
      borderLeftWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
      borderRightWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
      borderBottomWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
      borderStyle: 'solid',
      boxShadow: '0 1px 2px rgba(160, 160, 160, 0.3)',
      overflow: 'hidden' as const,
      marginTop: `${SPACING.VERTICAL_SPACING}px`,
    },
    titleInnerBorder: {
      position: 'absolute' as const,
      top: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`, // Updated to match scaled border
      left: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      right: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      bottom: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      backgroundColor: '#1F1F1F',
      borderRadius: `${Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 2.5) - 2)}px`, // Updated to match scaled border
      zIndex: 0,
    },
    titleInner: {
      position: 'absolute' as const,
      top: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`, // Match inner border position
      left: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      right: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      bottom: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden' as const,
      zIndex: 1,
      paddingRight: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`, // Match container padding
      borderRadius: `${Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 2.5) - 2)}px`, // Match inner border radius
    },
    titleText: {
      fontSize: FONT_SIZES.TARGET_NUMBER * 0.5625, // Scaled down 25% more (to 56.25% of original)
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
      letterSpacing: `${LETTER_SPACING.WIDE * 0.75}px`, // Scaled down 25%
      textAlign: 'center' as const,
      textShadow: '2px 2px 3px rgba(0, 0, 0, 0.8)',
      zIndex: 1,
      position: 'relative' as const,
      lineHeight: `${FONT_SIZES.TARGET_NUMBER * 0.95}px`,
      display: 'inline-block', // Change from flex to inline-block for proper text alignment
      pointerEvents: 'none' as const, // Prevent mouse interaction
      whiteSpace: 'nowrap' as const,
      animation: 'chyron 10s linear infinite',
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
      marginTop: `${SPACING.VERTICAL_SPACING}px`,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      fontWeight: 'bold' as const,
      width: '100%',
    },
    sectionDescription: {
      fontSize: FONT_SIZES.SUBTEXT,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_PRIMARY,
      textAlign: 'center' as const,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      maxWidth: `${CALCULATOR_DISPLAY.WIDTH * 0.8}px`,
      opacity: 0.8,
    },
    instructionsContainer: {
      width: `${CALCULATOR_DISPLAY.WIDTH * 1.2}px`,
      maxWidth: `${CALCULATOR_DISPLAY.WIDTH * 1.2}px`,
      backgroundColor: 'transparent',
      maxHeight: SCREEN_HEIGHT * 0.5,
      overflowY: 'auto' as const,
    },
    actionButton: {
      padding: `${14 * 0.85 * 0.85}px ${24 * 0.85 * 0.85}px`, // Scaled down 15% then another 15%
      minWidth: `${200 * 0.85 * 0.85}px`,
      minHeight: `${50 * 0.85 * 0.85}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.85 * 0.85}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE,
      color: COLORS.TEXT_SECONDARY,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
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
    difficultyContainer: {
      display: 'flex',
      flexDirection: 'row' as const,
      gap: '15px',
      paddingTop: `${SPACING.VERTICAL_SPACING}px`,
      paddingBottom: `${SPACING.VERTICAL_SPACING}px`,

    },
    difficultyButton: {

      paddingLeft: `${SPACING.PADDING_MEDIUM * 0.85}px`,
      paddingRight: `${SPACING.PADDING_MEDIUM * 0.85}px`,
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
          <div style={styles.titleInnerBorder} />
          <FadedEights count={4} />
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
          style={styles.actionButton}
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
          style={{ ...styles.actionButton, marginTop: `${SPACING.VERTICAL_SPACING}px` }}
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
          <InstructionsContent />
        </div>
      </div>
    </div>
  );
}

