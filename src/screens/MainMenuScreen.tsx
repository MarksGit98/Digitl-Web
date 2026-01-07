import { useState } from 'react';
import { Difficulty } from '../types';
import { FONT_SIZES, SPACING, COLORS, BUTTON_BORDER, SCREEN_DIMENSIONS, ANIMATION, CALCULATOR_DISPLAY, BORDER_RADIUS } from '../constants/sizing';
import { create3DButtonStyle } from '../styles/buttonStyles';
import presentSvg from '../assets/svgs/present.svg';
import calendarSvg from '../assets/svgs/calendar-icon.svg';
import stopwatchSvg from '../assets/svgs/stopwatch-icon.svg';
import mailSvg from '../assets/svgs/mail-icon.svg';
import InstructionsContent from '../components/InstructionsContent';
import { CalculatorDisplay } from '../components/CalculatorDisplay';

const SCREEN_HEIGHT = SCREEN_DIMENSIONS.HEIGHT;

// Shared constant for action buttons (Play Daily, Play Sandbox, Next Round, Next Puzzle)
const ACTION_BUTTON_SHADOW_OFFSET = 4; // Base shadow for action buttons
const ACTION_BUTTON_SHADOW_HOVER_OFFSET = 5; // Hover shadow for action buttons

interface MainMenuScreenProps {
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onStartDailyChallenge: () => void;
  onStartDailyTimed: () => void;
  onStartSandbox: () => void;
}

export default function MainMenuScreen({
  selectedDifficulty,
  onDifficultyChange,
  onStartDailyChallenge,
  onStartDailyTimed,
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
      paddingBottom: '20px',
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
    sectionTitle: {
      fontSize: FONT_SIZES.TITLE * 0.459, // 0.6 * 0.85 * 0.9
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: COLORS.BACKGROUND_DARK,
      color: COLORS.TEXT_WHITE,
      padding: `${SPACING.PADDING_SMALL * 0.765}px ${SPACING.PADDING_MEDIUM * 0.765}px`, // 0.85 * 0.9
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.765}px`, // 0.85 * 0.9
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
      marginTop: `${SPACING.VERTICAL_SPACING}px`,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      opacity: 0.8,
    },
    instructionsContainer: {
      width: '85%',
      backgroundColor: 'transparent',
    },
    actionButton: {
      padding: `${14 * 0.7225}px ${24 * 0.7225}px`, // 0.85 * 0.85
      minWidth: `${200 * 0.7225}px`,
      minHeight: `${50 * 0.7225}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.7225}px`, // 0.85 * 0.85
      backgroundColor: COLORS.BACKGROUND_WHITE,
      color: COLORS.TEXT_SECONDARY,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      fontSize: FONT_SIZES.DIFFICULTY_BUTTON * 0.7225, // 0.85 * 0.85
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
      boxShadow: `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`,
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
      width: '82.5px', // Increased by 10% (75px * 1.1)
      minWidth: '82.5px', // Increased by 10%
      minHeight: `${SCREEN_HEIGHT * 0.0425}px`, // 0.05 * 0.85
    },
    separatorLine: {
      width: '85%',
      height: '1px',
      backgroundColor: '#000000',
      margin: `${SPACING.VERTICAL_SPACING * 1.5}px auto`,
    },
    contactLink: {
      display: 'block',
      marginTop: '0px',
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      fontSize: FONT_SIZES.SUBTEXT,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_PRIMARY,
      textDecoration: 'none',
      textAlign: 'center' as const,
      opacity: 0.8,
      cursor: 'pointer',
      transition: 'opacity 0.2s ease',
      background: 'none',
      border: 'none',
      padding: '0',
      width: '100%',
    },
  };

  return (
    <div style={styles.container} className="hide-scrollbar">
        <div style={styles.content}>
        {/* Game Title - Calculator Display */}
        <CalculatorDisplay mode="chyron" chyronText="DIGITL" />
        
        {/* Daily Challenge Section */}
        <h2 style={styles.sectionTitle}>Daily Challenge</h2>
        
        {/* Daily Challenge Button */}
        <button 
          style={styles.actionButton}
          onClick={onStartDailyChallenge}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)';
            e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_HOVER_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = `translate(${ACTION_BUTTON_SHADOW_OFFSET}px, ${ACTION_BUTTON_SHADOW_OFFSET}px)`;
            e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Play Daily
            <img src={calendarSvg} alt="calendar" width="20" height="20" style={{ display: 'block' }} />
          </span>
        </button>
        
        <div style={styles.sectionDescription}>
          Complete three puzzles of increasing difficulty levels.
        </div>

        {/* Daily Timed Section */}
        <h2 style={styles.sectionTitle}>Daily Timed Challenge</h2>
        
        {/* Daily Timed Button */}
        <button 
          style={styles.actionButton}
          onClick={onStartDailyTimed}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translate(-1px, -1px)';
            e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_HOVER_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = `translate(${ACTION_BUTTON_SHADOW_OFFSET}px, ${ACTION_BUTTON_SHADOW_OFFSET}px)`;
            e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Play Daily Timed
            <img src={stopwatchSvg} alt="stopwatch" width="20" height="20" style={{ display: 'block' }} />
          </span>
        </button>
        
        <div style={styles.sectionDescription}>
          Exactly the same as the Daily Challenge but each puzzle is timed. Can you solve the Daily faster than your friends?
        </div>

        {/* Sandbox Mode Section */}
        <h2 style={styles.sectionTitle}>Sandbox Mode</h2>
        
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
              borderColor: (pressedDifficulty === 'easy' && selectedDifficulty !== 'easy') ? '#404040' : '#1B5E20', // Further darkened green (#2E7D32 -> #1B5E20)
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
              borderColor: (pressedDifficulty === 'medium' && selectedDifficulty !== 'medium') ? '#404040' : '#BF360C', // Further darkened orange (#E65100 -> #BF360C)
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
              borderColor: (pressedDifficulty === 'hard' && selectedDifficulty !== 'hard') ? '#404040' : '#B71C1C', // Further darkened red (#C62828 -> #B71C1C)
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
            e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_HOVER_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = `translate(${ACTION_BUTTON_SHADOW_OFFSET}px, ${ACTION_BUTTON_SHADOW_OFFSET}px)`;
            e.currentTarget.style.boxShadow = '0 0 0 0 rgba(0, 0, 0, 1)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translate(0, 0)';
            e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            Play Sandbox
            <img src={presentSvg} alt="present" width="20" height="20" style={{ display: 'block' }} />
          </span>
        </button>
        
        <div style={styles.sectionDescription}>
          Generate random puzzles at your selected difficulty level.
        </div>
        
        {/* How to Play Section */}
        <h2 style={styles.sectionTitle}>How to Play</h2>
        
        <div style={styles.instructionsContainer}>
          <InstructionsContent />
        </div>
        
        {/* Separator Line */}
        <div style={styles.separatorLine}></div>
        
        {/* Contact Section */}
        <button
          style={styles.contactLink}
          onClick={() => {
            const email = 'rubberduckygamescontact@gmail.com';
            // Try to open email client
            window.location.href = `mailto:${email}`;
            // Also copy to clipboard as backup
            navigator.clipboard.writeText(email).then(() => {
              alert(`Email copied to clipboard!\n${email}`);
            }).catch(() => {
              alert(`Contact email:\n${email}`);
            });
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <img src={mailSvg} alt="mail" width="20" height="20" style={{ display: 'block' }} />
            Contact me
          </span>
        </button>
      </div>
    </div>
  );
}

