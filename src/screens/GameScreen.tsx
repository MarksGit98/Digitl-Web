import React, { useState, useEffect, useRef } from 'react';
import { GameState, Operation, Difficulty } from '../types';
import { performOperation, getPuzzleKey } from '../utils';
import { 
  FONT_SIZES, SPACING, COLORS, BUTTON_BORDER, BUTTON_SIZES,
  CALCULATOR_DISPLAY, HISTORY_BOX, SCREEN_DIMENSIONS, BORDER_RADIUS,
  OVERLAY_BORDER, LETTER_SPACING
} from '../constants/sizing';
import DigitButton from '../components/DigitButton';
import OperationButton from '../components/OperationButton';
import UndoButton from '../components/UndoButton';
import HowToPlayModal from '../components/HowToPlayModal';
import { CalculatorDisplay } from '../components/CalculatorDisplay';
import CloseButton from '../components/CloseButton';
import OverlayBackdrop from '../components/OverlayBackdrop';
import nextArrowSvg from '../assets/svgs/next-arrow.svg';
import homeSvg from '../assets/svgs/home.svg';
import librarySvg from '../assets/svgs/library.svg';
import presentSvg from '../assets/svgs/present.svg';
import calendarSvg from '../assets/svgs/calendar-icon.svg';
import stopwatchSvg from '../assets/svgs/stopwatch-icon.svg';
import paperPlaneSvg from '../assets/svgs/paper-plane-icon.svg';
import mailSvg from '../assets/svgs/mail-icon.svg';
import pptIcon from '../assets/ppt-icon.png';

const SCREEN_WIDTH = SCREEN_DIMENSIONS.WIDTH;

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  difficulty: Difficulty;
  currentPuzzleIndex: number;
  onReturnToMenu: () => void;
  onPuzzleComplete: (puzzleKey: string, finalDigit: number, completedHistory: any[]) => void;
  completedPuzzles: Set<string>;
  gameMode?: 'regular' | 'dailyChallenge' | 'dailyTimed' | 'sandbox';
  dailyChallengeRound?: 1 | 2 | 3 | null;
  onGoToNextRound?: () => void;
  onNewPuzzle?: () => void;
  showSuccessBanner?: boolean;
  successMessage?: string;
  isAnimating?: boolean;
  animatingDigit?: number | null;
  showAllPuzzlesComplete?: boolean;
  onStartSandbox?: () => void;
  onStartDailyChallenge?: () => void;
  onStartDailyTimed?: () => void;
  onCloseSuccessBanner?: () => void;
  onCloseAllPuzzlesComplete?: () => void;
  showCountdown?: boolean;
  countdownValue?: number;
  timerSeconds?: number;
  isTimerRunning?: boolean;
  roundTimes?: number[];
  userPercentile?: number | null;
  solutionUniqueness?: {
    easy: number | null;
    medium: number | null;
    hard: number | null;
  };
}

export default function GameScreen({
  gameState,
  setGameState,
  difficulty,
  currentPuzzleIndex,
  onReturnToMenu,
  onPuzzleComplete,
  gameMode = 'regular',
  dailyChallengeRound = null,
  onGoToNextRound,
  onNewPuzzle,
  showSuccessBanner = false,
  successMessage = '',
  isAnimating = false,
  animatingDigit = null,
  showAllPuzzlesComplete = false,
  onStartSandbox,
  onStartDailyChallenge,
  onStartDailyTimed,
  onCloseSuccessBanner,
  onCloseAllPuzzlesComplete,
  showCountdown = false,
  countdownValue = 3,
  timerSeconds = 0,
  isTimerRunning = false,
  roundTimes = [],
  userPercentile = null,
  solutionUniqueness = { easy: null, medium: null, hard: null },
}: GameScreenProps) {
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [firstSelectedIndex, setFirstSelectedIndex] = useState<number | null>(null);
  const [secondSelectedIndex, setSecondSelectedIndex] = useState<number | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [shakingDigitIndices, setShakingDigitIndices] = useState<number[]>([]);
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const hasCompletedRef = useRef(false);
  
  // Helper function to format time (for plain text)
  const formatTime = (seconds: number): string => {
    if (seconds >= 3600) {
      return '1 hour+';
    }
    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''}`;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) {
      return `${mins} minute${mins !== 1 ? 's' : ''}`;
    }
    return `${mins} minute${mins !== 1 ? 's' : ''} and ${secs} second${secs !== 1 ? 's' : ''}`;
  };

  // Helper function to format time with bold styling (for overlay display)
  const formatTimeBold = (seconds: number): JSX.Element => {
    if (seconds >= 3600) {
      return <><b>1 hour+</b></>;
    }
    if (seconds < 60) {
      return <><b>{seconds} second{seconds !== 1 ? 's' : ''}</b></>;
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (secs === 0) {
      return <><b>{mins} minute{mins !== 1 ? 's' : ''}</b></>;
    }
    return <><b>{mins} minute{mins !== 1 ? 's' : ''}</b> and <b>{secs} second{secs !== 1 ? 's' : ''}</b></>;
  };

  // Helper function to share results (Daily Timed)
  const shareResults = () => {
    const [easy, medium, hard] = roundTimes;
    const totalSeconds = roundTimes.reduce((sum, time) => sum + time, 0);
    const percentile = userPercentile !== null ? userPercentile : 100;
    
    const message = `DIGITL - Daily Timed Challenge 🧮

🟩 Easy: ${formatTime(easy)}
🟨 Medium: ${formatTime(medium)}
🟥 Hard: ${formatTime(hard)}

⏱️ Total Time: ${formatTime(totalSeconds)}
🏆 Faster than ${percentile}% of players today!

Play now at:
https://www.digitlgame.com/`;

    navigator.clipboard.writeText(message).then(() => {
      // Show copied message
      setShowCopiedMessage(true);
      // Hide after 2 seconds
      setTimeout(() => {
        setShowCopiedMessage(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  // Helper function to share results (Daily Challenge)
  const shareDailyChallengeResults = () => {
    const easyPercent = solutionUniqueness.easy !== null ? solutionUniqueness.easy : 100;
    const mediumPercent = solutionUniqueness.medium !== null ? solutionUniqueness.medium : 100;
    const hardPercent = solutionUniqueness.hard !== null ? solutionUniqueness.hard : 100;
    
    const message = `DIGITL - Daily Challenge 🧮

🟩 Easy - Same solution as ${easyPercent}% of players
🟨 Medium - Same solution as ${mediumPercent}% of players
🟥 Hard - Same solution as ${hardPercent}% of players

Play now at:
https://www.digitlgame.com/`;

    navigator.clipboard.writeText(message).then(() => {
      // Show copied message
      setShowCopiedMessage(true);
      // Hide after 2 seconds
      setTimeout(() => {
        setShowCopiedMessage(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };
  
  // Height constant for top row elements (home button, DIGITL title, how to play button)
  // Calculate based on gameTitle element: fontSize + vertical padding * 2 + border * 2
  const titleFontSize = FONT_SIZES.TITLE * 0.5407479; // 0.85 * 0.9 * 1.1 * 0.85 * 0.6 * 0.9 * 1.4
  const titleVerticalPadding = SPACING.PADDING_MEDIUM * 0.421362; // 0.85 * 0.9 * 0.85 * 0.6 * 0.9 * 1.2
  const topRowElementHeight = titleFontSize + (titleVerticalPadding * 2) + (BUTTON_BORDER.WIDTH * 2);

  // Reset completion flag when puzzle index changes or game state changes
  useEffect(() => {
    hasCompletedRef.current = false;
    setShowSuccessMessage(false);
    setFirstSelectedIndex(null);
    setSecondSelectedIndex(null);
    setSelectedOperation(null);
  }, [currentPuzzleIndex, gameState]);

  // Keep success message visible until puzzle changes
  // No auto-hide - it will be reset when puzzle index changes

  // All puzzles complete banner stays open until user closes it (no auto-hide)

  const triggerInvalidOperationShake = (index1: number, index2: number) => {
    // Start shake animation
    setShakingDigitIndices([index1, index2]);
    
    // Shake animation duration: 0.55s (550ms) - matches mobile
    // CSS animation handles the shake, we just need to reset after it completes
    setTimeout(() => {
      setShakingDigitIndices([]);
      setFirstSelectedIndex(null);
      setSecondSelectedIndex(null);
      setSelectedOperation(null);
    }, 550);
  };

  const performOperationAndUpdate = (
    index1: number,
    index2: number,
    operation: Operation
  ) => {
    if (hasCompletedRef.current) return;
    
    const a = gameState.digits[index1];
    const b = gameState.digits[index2];
    const result = performOperation(a, b, operation);
    
    if (result === null || result < 0) {
      // Invalid operation - trigger shake animation
      // First set secondSelectedIndex to show it as selected (red)
      if (firstSelectedIndex === index1) {
        setSecondSelectedIndex(index2);
        triggerInvalidOperationShake(index1, index2);
      }
      return;
    }
    
    const previousDigits = [...gameState.digits];
    const newDigits = [...gameState.digits];
    // Remove the two selected digits and add the result
    const sortedIndices = [index1, index2].sort((a, b) => b - a);
    sortedIndices.forEach((idx) => newDigits.splice(idx, 1));
    newDigits.push(result);
    
    const newHistory = [...gameState.history, {
      operation,
      operands: [a, b] as [number, number],
      result,
      previousDigits,
    }];
    
    setGameState({
      ...gameState,
      digits: newDigits,
      history: newHistory,
    });
    
    setFirstSelectedIndex(null);
    setSecondSelectedIndex(null);
    setSelectedOperation(null);
    
    // Check if puzzle is completed
    if (newDigits.length === 1 && newDigits[0] === gameState.target && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const puzzleKey = getPuzzleKey(difficulty, currentPuzzleIndex);
      setShowSuccessMessage(true);
      onPuzzleComplete(puzzleKey, newDigits[0], newHistory); // Pass the complete history including final operation
    }
  };

  const handleDigitClick = (index: number) => {
    if (hasCompletedRef.current) return;
    
    // Case 1: Operation selected first, then first number, now selecting second number
    if (selectedOperation !== null && firstSelectedIndex !== null && secondSelectedIndex === null) {
      if (firstSelectedIndex === index) {
        // Deselect first number if clicking it again
        setFirstSelectedIndex(null);
        return;
      }
      // Select second number and perform operation
      const secondIndex = index;
      const a = gameState.digits[firstSelectedIndex];
      const b = gameState.digits[secondIndex];
      const result = performOperation(a, b, selectedOperation);
      
      if (result === null || result < 0) {
        // Invalid operation - show second as selected and shake
        setSecondSelectedIndex(secondIndex);
        triggerInvalidOperationShake(firstSelectedIndex, secondIndex);
        return;
      }
      
      performOperationAndUpdate(firstSelectedIndex, index, selectedOperation);
      return;
    }
    
    // Case 2: Operation selected first, now selecting first number
    if (selectedOperation !== null && firstSelectedIndex === null) {
      setFirstSelectedIndex(index);
      return;
    }
    
    // Case 3: First number and operation selected, selecting second number
    if (firstSelectedIndex !== null && selectedOperation !== null) {
      if (firstSelectedIndex === index) {
        // Deselect first number if clicking it again
        setFirstSelectedIndex(null);
        setSelectedOperation(null);
        setSecondSelectedIndex(null);
        return;
      }
      // Select second number and perform operation
      const secondIndex = index;
      const a = gameState.digits[firstSelectedIndex];
      const b = gameState.digits[secondIndex];
      const result = performOperation(a, b, selectedOperation);
      
      if (result === null || result < 0) {
        // Invalid operation - show second as selected and shake
        setSecondSelectedIndex(secondIndex);
        triggerInvalidOperationShake(firstSelectedIndex, secondIndex);
        return;
      }
      
      performOperationAndUpdate(firstSelectedIndex, index, selectedOperation);
      return;
    }
    
    // Case 4: First number selected, no operation yet - allow selecting second number
    if (firstSelectedIndex !== null && selectedOperation === null) {
      if (firstSelectedIndex === index) {
        // Deselect first number
        setFirstSelectedIndex(null);
        setSecondSelectedIndex(null);
        return;
      }
      // If second number is already selected and clicking it again, deselect it
      if (secondSelectedIndex === index) {
        setSecondSelectedIndex(null);
        return;
      }
      // Select or change second selection
      setSecondSelectedIndex(index);
      return;
    }
    
    // Case 5: Nothing selected, select first number
    if (firstSelectedIndex === null && selectedOperation === null) {
      setFirstSelectedIndex(index);
      return;
    }
  };

  const handleOperationClick = (operation: Operation) => {
    if (hasCompletedRef.current) return;
    
    // Allow deselecting operation by pressing it again
    if (selectedOperation === operation) {
      setSelectedOperation(null);
      return;
    }
    
    // Case 1: Operation selected, both numbers selected - perform operation
    if (selectedOperation !== null && firstSelectedIndex !== null && secondSelectedIndex !== null) {
      const a = gameState.digits[firstSelectedIndex];
      const b = gameState.digits[secondSelectedIndex];
      const result = performOperation(a, b, selectedOperation);
      
      if (result === null || result < 0) {
        // Invalid operation - trigger shake
        triggerInvalidOperationShake(firstSelectedIndex, secondSelectedIndex);
        return;
      }
      
      performOperationAndUpdate(firstSelectedIndex, secondSelectedIndex, selectedOperation);
      return;
    }
    
    // Case 2: Both numbers selected, no operation - perform operation
    if (firstSelectedIndex !== null && secondSelectedIndex !== null && selectedOperation === null) {
      const a = gameState.digits[firstSelectedIndex];
      const b = gameState.digits[secondSelectedIndex];
      const result = performOperation(a, b, operation);
      
      if (result === null || result < 0) {
        // Invalid operation - trigger shake
        triggerInvalidOperationShake(firstSelectedIndex, secondSelectedIndex);
        return;
      }
      
      performOperationAndUpdate(firstSelectedIndex, secondSelectedIndex, operation);
      return;
    }
    
    // Case 3: First number selected, no second number - set operation
    if (firstSelectedIndex !== null && secondSelectedIndex === null) {
      setSelectedOperation(operation);
      return;
    }
    
    // Case 4: Nothing selected - allow selecting operation first
    if (firstSelectedIndex === null && secondSelectedIndex === null && selectedOperation === null) {
      setSelectedOperation(operation);
      return;
    }
  };

  const handleUndo = () => {
    if (gameState.history.length > 0 && !hasCompletedRef.current) {
      const lastEntry = gameState.history[gameState.history.length - 1];
      setGameState({
        ...gameState,
        digits: lastEntry.previousDigits,
        history: gameState.history.slice(0, -1),
      });
      setFirstSelectedIndex(null);
      setSecondSelectedIndex(null);
      setSelectedOperation(null);
    }
  };

  const operations: Operation[] = ['+', '-', '*', '/'];
  const maxHistoryEntries = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5;

  // Single constant for button shadow offset (rounded down to integer)
  const GAME_SCREEN_BUTTON_SHADOW_OFFSET = 3;
  const GAME_SCREEN_BUTTON_SHADOW_HOVER_OFFSET = 4; // Rounded down from 4.75px
  
  // Shared constant for action buttons (Play Daily, Play Sandbox, Next Round, Next Puzzle)
  const ACTION_BUTTON_SHADOW_OFFSET = 4; // Base shadow for action buttons
  const ACTION_BUTTON_SHADOW_HOVER_OFFSET = 5; // Hover shadow for action buttons

  // All vertical spacing uses single constant

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.BACKGROUND_LIGHT,
      paddingTop: '0px',
      paddingBottom: `${SPACING.VERTICAL_SPACING}px`,
      paddingLeft: `${SPACING.CONTAINER_PADDING_HORIZONTAL}px`,
      paddingRight: `${SPACING.CONTAINER_PADDING_HORIZONTAL}px`,
      position: 'relative' as const,
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
      scrollbarWidth: 'none' as const, // Firefox
      msOverflowStyle: 'none' as const, // IE and Edge
      userSelect: 'none' as const, // Prevent text selection and cursor
      WebkitUserSelect: 'none' as const,
      MozUserSelect: 'none' as const,
      msUserSelect: 'none' as const,
    },
    homeButtonContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    iconButton: {
      width: `${topRowElementHeight}px`, // Use consistent height constant
      height: `${topRowElementHeight}px`,
      minWidth: `${topRowElementHeight}px`,
      minHeight: `${topRowElementHeight}px`,
      maxWidth: `${topRowElementHeight}px`,
      maxHeight: `${topRowElementHeight}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.918}px`, // 0.85 * 0.9 * 0.6 * 2
      backgroundColor: COLORS.BACKGROUND_WHITE, // Match digit button background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`, // Match digit button border
      padding: 0, // Remove default padding
      boxShadow: `${GAME_SCREEN_BUTTON_SHADOW_OFFSET}px ${GAME_SCREEN_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`,
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    },
    gameTitleRow: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      justifyContent: 'space-evenly' as const, // Evenly space all items
    
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      alignSelf: 'center' as const,
    },
    gameTitleBox: {
      width: `${CALCULATOR_DISPLAY.WIDTH}px`, // 85% width, then 85% again for web, then substantially scaled down, then 10% more
      height: `${topRowElementHeight}px`, // Use consistent height constant
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none' as const, // Prevent mouse interaction
    },
    gameTitle: {
      backgroundColor: COLORS.BACKGROUND_WHITE,
      padding: `${SPACING.PADDING_MEDIUM * 0.42}px ${SPACING.PADDING_LARGE * 0.42}px`, // 0.85 * 0.9 * 0.85 * 0.6 * 0.9 * 1.2
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.42}px`, // 0.85 * 0.9 * 0.85 * 0.6 * 0.9 * 1.2
      fontSize: FONT_SIZES.TITLE * 0.55,
      fontFamily: 'Digital-7-Mono, monospace',
      color: COLORS.BACKGROUND_DARK,
      fontWeight: 900 as const, // Increased boldness (from 'bold' which is 700 to 900)
      textAlign: 'center' as const,
      boxShadow: `${GAME_SCREEN_BUTTON_SHADOW_OFFSET}px ${GAME_SCREEN_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`,
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      pointerEvents: 'none' as const, // Prevent mouse interaction
      width: '80%',
    },
    modeTitle: {
      backgroundColor: COLORS.BACKGROUND_DARK,
      padding: `${SPACING.PADDING_MEDIUM * 0.7}px ${SPACING.PADDING_LARGE * 0.7}px`, // Scaled down 30%
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.7}px`, // Scaled down 30%
      fontSize: FONT_SIZES.TITLE * 0.49, // Scaled down 30% more
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_WHITE,
      fontWeight: 'bold' as const,
      textAlign: 'center' as const,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      width: '100%',
    },
    difficultyText: {
      fontSize: FONT_SIZES.TITLE * 0.5,
      fontFamily: 'Digital-7-Mono, monospace',
      color: COLORS.TEXT_SECONDARY,
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
      width: '100%',
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
    },
    gameContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      width: '100%',
    },
    digitsContainerWrapper: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: `${SPACING.VERTICAL_SPACING}px`,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
    },
    digitsContainer: {
      display: 'flex',
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      justifyContent: 'center',
      width: '100%',
    },
    digitsContainerMedium5: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      width: '100%',
    },
    digitRow: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'center',
      width: '100%',
    },
    operationsContainerWrapper: {
      width: '90%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
    },
    operationsContainer: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'center',
      alignItems: 'center',
    },
    historyContainerWrapper: {
      width: '100%',
      marginTop: `${SPACING.VERTICAL_SPACING}px`,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      height: HISTORY_BOX.HEIGHT_HARD,
      textAlign: 'center' as const, // Center the history container horizontally (not the text inside)
    },
    historyContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.BACKGROUND_DARK,
      paddingLeft: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`, // Same as targetContainer
      paddingRight: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`, // Same as targetContainer
      paddingTop: 0,
      paddingBottom: 0,
      borderRadius: `${HISTORY_BOX.BORDER_RADIUS * 0.75}px`,
      width: `${CALCULATOR_DISPLAY.WIDTH * 0.675}px`, // Reduced by 10% (0.75 * 0.9 = 0.675)
      height: difficulty === 'easy' ? `${HISTORY_BOX.HEIGHT_EASY * 0.75}px` 
             : difficulty === 'medium' ? `${HISTORY_BOX.HEIGHT_MEDIUM * 0.75}px` 
             : `${HISTORY_BOX.HEIGHT_HARD * 0.75}px`,
      margin: '0 auto', // Center horizontally
      pointerEvents: 'none' as const, // Prevent mouse interaction
      // Metallic border effect - scaled down borders
      borderTopColor: '#B0B0B0',
      borderLeftColor: '#909090',
      borderRightColor: '#404040',
      borderBottomColor: '#404040',
      borderTopWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
      borderLeftWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
      borderRightWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
      borderBottomWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`,
      borderStyle: 'solid',
      boxShadow: '0 1px 1.5px rgba(160, 160, 160, 0.25)',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      alignSelf: 'center' as const,
    },
    historyInnerBorder: {
      position: 'absolute' as const,
      top: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      left: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      right: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      bottom: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      backgroundColor: '#1F1F1F',
      borderRadius: `${Math.max(2, HISTORY_BOX.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 2.5) - 2)}px`,
      zIndex: 0,
    },
    historyContentWrapper: {
      position: 'relative' as const,
      width: '100%',
      height: '100%',
      paddingTop: `${HISTORY_BOX.INNER_PADDING}px`,
      paddingBottom: `${HISTORY_BOX.INNER_PADDING}px`,
      paddingLeft: `${HISTORY_BOX.INNER_PADDING}px`,
      paddingRight: `${HISTORY_BOX.INNER_PADDING}px`,
      zIndex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center' as const,
    },
    historyBar: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      backgroundColor: 'transparent', // Transparent so inner border background (#1F1F1F) shows through
      paddingHorizontal: 0, // Padding handled by container
      paddingVertical: `${SPACING.VERTICAL_SPACING}px`,
      width: '100%', // Fill container width to respect container padding
      overflow: 'hidden' as const,
      zIndex: 1,
    },
    historyNumberContainer: {
      marginRight: `${SCREEN_WIDTH * 0.015}px`,
    },
    historyNumber: {
      fontSize: FONT_SIZES.SUBTEXT * 0.825, 
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
      lineHeight: '1.9',
    },
    historyNumberEmpty: {
      color: COLORS.TEXT_SUCCESS,
      opacity: 0.3, // Faded when line is empty
    },
    historyTextEmpty: {
      fontSize: FONT_SIZES.SUBTEXT * 0.825,
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
      flex: 1,
      opacity: 0.12, 
      textAlign: 'left' as const,
      lineHeight: '1.5',
    },
    historyText: {
      fontSize: FONT_SIZES.SUBTEXT * 0.825, // 1.1 * 0.75
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
      flex: 1,
      textAlign: 'left' as const, // Left-align the equation text
      lineHeight: '1.5',
    },
    actionButton: {
      padding: `${14 * 0.7225}px ${24 * 0.7225}px`, // Scaled down 15% then another 15%
      minWidth: `${200 * 0.7225}px`,
      minHeight: `${50 * 0.7225}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.7225}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE,
      color: COLORS.TEXT_SECONDARY,
      marginTop: `${SPACING.VERTICAL_SPACING}px`,
      marginBottom: `${SPACING.VERTICAL_SPACING}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      fontSize: FONT_SIZES.DIFFICULTY_BUTTON * 0.7225, // Scaled down 15% then another 15%
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
      boxShadow: `${GAME_SCREEN_BUTTON_SHADOW_OFFSET}px ${GAME_SCREEN_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`,
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    },
    undoButtonInRow: {
      width: `${BUTTON_SIZES.OPERATION_BUTTON_SIZE}px`,
      height: `${BUTTON_SIZES.OPERATION_BUTTON_SIZE}px`,
      borderRadius: '50%',
      marginLeft: `${BUTTON_SIZES.OPERATION_BUTTON_MARGIN * 0.5}px`, // Reduced margin to condense horizontally
    },
    allPuzzlesCompleteBanner: {
      position: 'absolute' as const,
      top: `${BUTTON_BORDER.WIDTH * 2.5 + 4}px`, // Just below top border of target display
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: COLORS.BACKGROUND_WHITE,
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.7225}px`,
      padding: `${SPACING.PADDING_MEDIUM * 0.7225}px ${SPACING.PADDING_LARGE * 0.7225}px`,
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: `${SPACING.VERTICAL_SPACING}px`,
      boxShadow: `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`,
      minWidth: `${CALCULATOR_DISPLAY.WIDTH * 0.5625 * 0.9}px`,
    },
    successBannerOverlay: {
      position: 'fixed' as const,
      top: '15%', // Positioned at 15% from top of viewport
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: COLORS.BACKGROUND_WHITE,
      border: `${OVERLAY_BORDER.WIDTH}px solid ${OVERLAY_BORDER.COLOR}`,
      borderRadius: `${BORDER_RADIUS.MEDIUM}px`,
      padding: `${SPACING.PADDING_LARGE * 0.75}px ${SPACING.PADDING_XLARGE * 0.75}px`, // Increased padding for bigger gap between buttons and borders
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: `${SPACING.VERTICAL_SPACING}px`,
      boxShadow: '0 8px 24px rgba(6, 5, 5, 0.2)', // Natural shadow with blur
      width: `${SCREEN_DIMENSIONS.WIDTH * 0.5}px`,
    },
    successBannerTitle: {
      fontSize: FONT_SIZES.TITLE * 0.49, // Match modeTitle font size
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: COLORS.BACKGROUND_DARK,
      color: COLORS.TEXT_WHITE,
      padding: `${SPACING.PADDING_MEDIUM * 0.7}px ${SPACING.PADDING_LARGE * 0.7}px`, // Match modeTitle padding
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.7}px`, // Match modeTitle border radius
      textAlign: 'center' as const,
      fontWeight: 'bold' as const,
      width: '100%', 
    },
    successBannerMessage: {
      fontSize: FONT_SIZES.SUBTEXT, // Match sectionDescription font size
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_PRIMARY,
      textAlign: 'center' as const,
      opacity: 0.8, // Match sectionDescription opacity
    },
    successBannerButton: {
      padding: `${14 * 0.72}px ${24 * 0.72}px`,
      minWidth: `${200 * 0.72}px`,
      minHeight: `${50 * 0.72}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.72}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE,
      color: COLORS.TEXT_SECONDARY,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      fontSize: FONT_SIZES.DIFFICULTY_BUTTON * 0.7225,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontWeight: 'bold' as const,
      boxShadow: `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`,
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    },
    timerDisplay: {
      width: `${SCREEN_WIDTH * 0.24 * 0.9}px`, // Scaled down 10%
      height: `${SCREEN_WIDTH * 0.09 * 0.9}px`, // Scaled down 10%
      backgroundColor: COLORS.BACKGROUND_DARK,
      borderRadius: `${CALCULATOR_DISPLAY.BORDER_RADIUS}px`,
      borderTopWidth: `${BUTTON_BORDER.WIDTH * 1.3 }px`, // Thinner border
      borderLeftWidth: `${BUTTON_BORDER.WIDTH * 1.3 }px`,
      borderRightWidth: `${BUTTON_BORDER.WIDTH * 1.3 }px`,
      borderBottomWidth: `${BUTTON_BORDER.WIDTH * 1.3 }px`,
      borderColor: BUTTON_BORDER.COLOR,
      borderStyle: 'solid',
      boxShadow: '0 1px 1.5px rgba(160, 160, 160, 0.25)',
      position: 'relative' as const,
      overflow: 'hidden' as const,
      alignSelf: 'center' as const,
      marginBottom: `${SPACING.VERTICAL_SPACING * 0.72}px`,
    },
    timerInnerBorder: {
      position: 'absolute' as const,
      top: `${BUTTON_BORDER.WIDTH * 1.5 }px`,
      left: `${BUTTON_BORDER.WIDTH * 1.5 }px`,
      right: `${BUTTON_BORDER.WIDTH * 1.5 }px`,
      bottom: `${BUTTON_BORDER.WIDTH * 1.5 }px`,
      backgroundColor: '#c4d6a4', // LCD greenish-yellow background like digital timer
      borderRadius: `${Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 1.5) - 2)}px`,
      zIndex: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    timerText: {
      fontSize: FONT_SIZES.TARGET_NUMBER * 0.28 * 0.9, // Scaled down 10%
      color: '#000000', // Black text
      fontFamily: 'Digital-7-Mono, monospace', // Digital font
      fontWeight: 'normal' as const,
      letterSpacing: `${LETTER_SPACING.WIDE * 0.3 * 0.9}px`, // Scaled down 10%
      lineHeight: 1,
    },
    countdownOverlay: {
      position: 'fixed' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 3000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    countdownText: {
      fontSize: FONT_SIZES.TARGET_NUMBER * 1.5, // Smaller countdown
      color: '#F5F5F5', // Off-white text
      fontFamily: 'Digital-7-Mono, monospace', // Digital font
      fontWeight: 'normal' as const,
      WebkitTextStroke: '2px #000000', // Black stroke
      textShadow: '0 0 10px rgba(255, 255, 255, 0.8)', // White glow for visibility
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

  // Handle 5-tile layout for medium/hard
  const isMedium5Layout = (difficulty === 'medium' || difficulty === 'hard') && gameState.digits.length === 5;
  // Handle 6-tile layout for hard (4 tiles top row, 2 tiles bottom row)
  const isHard6Layout = difficulty === 'hard' && gameState.digits.length === 6;

  return (
    <>
      <div style={styles.container} className="hide-scrollbar">
        {/* Game Title Row with Home Button */}
        <div style={styles.gameTitleRow}>
          <div style={styles.homeButtonContainer}>
            <div 
              onClick={onReturnToMenu}
              style={styles.iconButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `${GAME_SCREEN_BUTTON_SHADOW_OFFSET}px ${GAME_SCREEN_BUTTON_SHADOW_HOVER_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(4px, 4px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
              }}
            >
              <img 
                src={homeSvg} 
                alt="Home" 
                width={topRowElementHeight * 0.5} 
                height={topRowElementHeight * 0.5}
                style={{ display: 'block', pointerEvents: 'none' }}
              />
            </div>
          </div>
          <div style={styles.gameTitleBox}>
            <div style={styles.gameTitle}>DIGITL</div>
          </div>
          <div 
              onClick={() => setShowHowToPlayModal(true)}
              style={styles.iconButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = `${GAME_SCREEN_BUTTON_SHADOW_OFFSET}px ${GAME_SCREEN_BUTTON_SHADOW_HOVER_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(4px, 4px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = `${ACTION_BUTTON_SHADOW_OFFSET}px ${ACTION_BUTTON_SHADOW_OFFSET}px 0 0 rgba(0, 0, 0, 1)`;
              }}
            >
              <img 
                src={librarySvg} 
                alt="How to Play" 
                width={topRowElementHeight * 0.5} 
                height={topRowElementHeight * 0.5}
                style={{ display: 'block', cursor: 'pointer' }}
              />
            </div>
        </div>

        {/* Mode Title - Daily Challenge, Daily Timed Challenge, or Sandbox Mode */}
        {gameMode !== 'regular' && (
          <div style={styles.modeTitle}>
            {gameMode === 'dailyChallenge' ? 'Daily Challenge' : 
             gameMode === 'dailyTimed' ? 'Daily Timed Challenge' : 
             'Sandbox Mode'}
          </div>
        )}

        {/* Difficulty Text - Centered between title and target */}
        <div style={styles.difficultyText}>
          Difficulty: {difficulty}
        </div>

        <div style={styles.gameContent}>
          {/* Timer Display (Daily Timed mode only) */}
          {gameMode === 'dailyTimed' && (
            <div style={styles.timerDisplay}>
              <div style={styles.timerInnerBorder}>
                <div style={{
                  ...styles.timerText,
                  color: !isTimerRunning && successMessage ? '#dc2626' : '#000000', // Red when stopped and puzzle complete
                }}>
                  {timerSeconds >= 3600 
                    ? '1:00:00+' 
                    : `${Math.floor(timerSeconds / 60).toString().padStart(2, '0')}:${(timerSeconds % 60).toString().padStart(2, '0')}`
                  }
                </div>
              </div>
            </div>
          )}
          
          {/* Target Display */}
          <div style={{ marginBottom: `${SPACING.VERTICAL_SPACING}px`, position: 'relative' as const }}>
            <CalculatorDisplay
              mode={(gameMode === 'dailyChallenge' || gameMode === 'dailyTimed') && dailyChallengeRound !== null && dailyChallengeRound < 3 && successMessage ? 'success' : 'target'}
              targetNumber={gameState.target}
              successMessage={(gameMode === 'dailyChallenge' || gameMode === 'dailyTimed') && dailyChallengeRound !== null && dailyChallengeRound < 3 ? successMessage : undefined}
            />
            {/* Success Banner Overlay (for rounds 1 and 2) */}
            {showSuccessBanner && (
              <>
                <OverlayBackdrop zIndex={2000} />
                <div style={styles.successBannerOverlay}>
                <div style={styles.successBannerMessage}>
                  {successMessage ? `${successMessage}!` : 'Success!'}
                </div>
                {onStartSandbox && (
                  <button
                    style={styles.successBannerButton}
                    onClick={() => {
                      onStartSandbox();
                      if (onCloseSuccessBanner) {
                        onCloseSuccessBanner();
                      }
                    }}
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
                )}
                {onCloseSuccessBanner && (
                  <CloseButton 
                    onClick={onCloseSuccessBanner}
                    style={{ marginTop: `${SPACING.VERTICAL_SPACING}px` }}
                  />
                )}
                </div>
              </>
            )}
            {/* All Puzzles Complete Banner (for round 3) */}
            {showAllPuzzlesComplete && (
              <>
                <OverlayBackdrop zIndex={2000} />
                <div style={styles.successBannerOverlay}>
                <div style={styles.successBannerTitle}>
                  Congratulations!
                </div>
                <div style={styles.successBannerMessage}>
                  {gameMode === 'dailyTimed' && roundTimes.length === 3 ? (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <div style={{ marginBottom: '12px', fontSize: FONT_SIZES.SUBTEXT }}>You solved all 3 puzzles!</div>
                      <div style={{ marginBottom: '6px', fontSize: FONT_SIZES.SUBTEXT * 0.85 }}>Easy Puzzle - {formatTimeBold(roundTimes[0])}</div>
                      <div style={{ marginBottom: '6px', fontSize: FONT_SIZES.SUBTEXT * 0.85 }}>Medium Puzzle - {formatTimeBold(roundTimes[1])}</div>
                      <div style={{ marginBottom: '6px', fontSize: FONT_SIZES.SUBTEXT * 0.85 }}>Hard Puzzle - {formatTimeBold(roundTimes[2])}</div>
                      <div style={{ marginTop: '16px', fontSize: FONT_SIZES.SUBTEXT, fontWeight: 'bold' }}>
                        Total Time: {formatTimeBold(roundTimes[0] + roundTimes[1] + roundTimes[2])} - Faster than <b style={{ color: '#16A34A' }}>{userPercentile !== null ? userPercentile : 100}%</b> of players today!
                      </div>
                    </div>
                  ) : gameMode === 'dailyChallenge' ? (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <div style={{ marginBottom: '12px', fontSize: FONT_SIZES.SUBTEXT }}>You solved all 3 puzzles!</div>
                      <div style={{ marginBottom: '6px', fontSize: FONT_SIZES.SUBTEXT * 0.85 }}>Easy - Same solution as <b>{solutionUniqueness.easy !== null ? solutionUniqueness.easy : 100}%</b> of players</div>
                      <div style={{ marginBottom: '6px', fontSize: FONT_SIZES.SUBTEXT * 0.85 }}>Medium - Same solution as <b>{solutionUniqueness.medium !== null ? solutionUniqueness.medium : 100}%</b> of players</div>
                      <div style={{ marginBottom: '6px', fontSize: FONT_SIZES.SUBTEXT * 0.85 }}>Hard - Same solution as <b>{solutionUniqueness.hard !== null ? solutionUniqueness.hard : 100}%</b> of players</div>
                    </div>
                  ) : (
                    'You solved all 3 puzzles!'
                  )}
                </div>
                {/* Share Results Button - appears first for Daily Timed and Daily Challenge */}
                {gameMode === 'dailyTimed' && roundTimes.length === 3 && (
                  <>
                    <button
                      style={{ ...styles.successBannerButton, marginTop: `${SPACING.VERTICAL_SPACING}px` }}
                      onClick={shareResults}
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
                        Share Results
                        <img src={paperPlaneSvg} alt="share" width="20" height="20" style={{ display: 'block' }} />
                      </span>
                    </button>
                    {showCopiedMessage && (
                      <div style={{
                        fontSize: FONT_SIZES.SUBTEXT,
                        fontStyle: 'italic',
                        color: COLORS.TEXT_SECONDARY,
                        marginTop: '8px',
                        textAlign: 'center',
                      }}>
                        Copied!
                      </div>
                    )}
                  </>
                )}
                
                {gameMode === 'dailyChallenge' && (
                  <>
                    <button
                      style={{ ...styles.successBannerButton, marginTop: `${SPACING.VERTICAL_SPACING}px` }}
                      onClick={shareDailyChallengeResults}
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
                        Share Results
                        <img src={paperPlaneSvg} alt="share" width="20" height="20" style={{ display: 'block' }} />
                      </span>
                    </button>
                    {showCopiedMessage && (
                      <div style={{
                        fontSize: FONT_SIZES.SUBTEXT,
                        fontStyle: 'italic',
                        color: COLORS.TEXT_SECONDARY,
                        marginTop: '8px',
                        textAlign: 'center',
                      }}>
                        Copied!
                      </div>
                    )}
                  </>
                )}
                
                {/* Divider line - separates Share Results from other buttons */}
                {(gameMode === 'dailyTimed' && roundTimes.length === 3) || gameMode === 'dailyChallenge' ? (
                  <div style={{
                    width: '100%',
                    height: '1px',
                    backgroundColor: '#000000',
                    marginTop: `${SPACING.VERTICAL_SPACING}px`,
                    marginBottom: `${SPACING.VERTICAL_SPACING * 0.5}px`,
                  }} />
                ) : null}
                
                {/* Show appropriate button based on game mode */}
                {gameMode === 'dailyTimed' && onStartDailyChallenge && (
                  <button
                    style={{ 
                      ...styles.successBannerButton, 
                      marginTop: roundTimes.length === 3 ? 0 : `${SPACING.VERTICAL_SPACING}px` 
                    }}
                    onClick={() => {
                      onStartDailyChallenge();
                      if (onCloseAllPuzzlesComplete) {
                        onCloseAllPuzzlesComplete();
                      } else if (onCloseSuccessBanner) {
                        onCloseSuccessBanner();
                      }
                    }}
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
                )}
                {gameMode === 'dailyChallenge' && onStartDailyTimed && (
                  <button
                    style={{ 
                      ...styles.successBannerButton, 
                      marginTop: `${SPACING.VERTICAL_SPACING}px` 
                    }}
                    onClick={() => {
                      onStartDailyTimed();
                      if (onCloseAllPuzzlesComplete) {
                        onCloseAllPuzzlesComplete();
                      } else if (onCloseSuccessBanner) {
                        onCloseSuccessBanner();
                      }
                    }}
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
                      Play Timed Daily
                      <img src={stopwatchSvg} alt="stopwatch" width="20" height="20" style={{ display: 'block' }} />
                    </span>
                  </button>
                )}
                {gameMode === 'sandbox' && onStartSandbox && (
                  <button
                    style={{ 
                      ...styles.successBannerButton, 
                      marginTop: `${SPACING.VERTICAL_SPACING}px` 
                    }}
                    onClick={() => {
                      onStartSandbox();
                      if (onCloseAllPuzzlesComplete) {
                        onCloseAllPuzzlesComplete();
                      } else if (onCloseSuccessBanner) {
                        onCloseSuccessBanner();
                      }
                    }}
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
                )}
                {(onCloseAllPuzzlesComplete || onCloseSuccessBanner) && (
                  <CloseButton 
                    onClick={onCloseAllPuzzlesComplete || onCloseSuccessBanner || (() => {})}
                    style={{ marginTop: `${SPACING.VERTICAL_SPACING}px` }}
                  />
                )}
                </div>
              </>
            )}
          </div>

          {/* Next Round Button - Only shown in daily challenge or daily timed mode after puzzle is completed */}
          {(gameMode === 'dailyChallenge' || gameMode === 'dailyTimed') && dailyChallengeRound !== null && dailyChallengeRound < 3 && onGoToNextRound && (showSuccessMessage || successMessage) && (
            <button
              style={styles.actionButton}
              onClick={onGoToNextRound}
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
                Next Round
                <img src={nextArrowSvg} alt="next" width="20" height="20" style={{ display: 'block' }} />
              </span>
            </button>
          )}

          {/* Digit Buttons */}
          <div style={styles.digitsContainerWrapper}>
            {isHard6Layout ? (
              <div style={styles.digitsContainerMedium5}>
                <div style={styles.digitRow}>
                  {gameState.digits.slice(0, 4).map((digit, index) => (
                    <DigitButton
                      key={index}
                      digit={digit}
                      onPress={() => handleDigitClick(index)}
                      isFirstSelected={firstSelectedIndex === index}
                      isSecondSelected={secondSelectedIndex === index}
                      isShaking={shakingDigitIndices.includes(index)}
                      isBouncing={isAnimating && animatingDigit === digit && gameState.digits.length === 1}
                    />
                  ))}
                </div>
                <div style={styles.digitRow}>
                  {gameState.digits.slice(4, 6).map((digit, index) => {
                    const actualIndex = index + 4;
                    return (
                      <DigitButton
                        key={actualIndex}
                        digit={digit}
                        onPress={() => handleDigitClick(actualIndex)}
                        isFirstSelected={firstSelectedIndex === actualIndex}
                        isSecondSelected={secondSelectedIndex === actualIndex}
                        isShaking={shakingDigitIndices.includes(actualIndex)}
                        isBouncing={isAnimating && animatingDigit === digit && gameState.digits.length === 1}
                      />
                    );
                  })}
                </div>
              </div>
            ) : isMedium5Layout ? (
              <div style={styles.digitsContainerMedium5}>
                <div style={styles.digitRow}>
                  {gameState.digits.slice(0, 3).map((digit, index) => (
                    <DigitButton
                      key={index}
                      digit={digit}
                      onPress={() => handleDigitClick(index)}
                      isFirstSelected={firstSelectedIndex === index}
                      isSecondSelected={secondSelectedIndex === index}
                      isShaking={shakingDigitIndices.includes(index)}
                      isBouncing={isAnimating && animatingDigit === digit && gameState.digits.length === 1}
                    />
                  ))}
                </div>
                <div style={styles.digitRow}>
                  {gameState.digits.slice(3, 5).map((digit, index) => {
                    const actualIndex = index + 3;
                    return (
                      <DigitButton
                        key={actualIndex}
                        digit={digit}
                        onPress={() => handleDigitClick(actualIndex)}
                        isFirstSelected={firstSelectedIndex === actualIndex}
                        isSecondSelected={secondSelectedIndex === actualIndex}
                        isShaking={shakingDigitIndices.includes(actualIndex)}
                        isBouncing={isAnimating && animatingDigit === digit && gameState.digits.length === 1}
                      />
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={styles.digitsContainer}>
                {gameState.digits.map((digit, index) => (
                  <DigitButton
                    key={index}
                    digit={digit}
                    onPress={() => handleDigitClick(index)}
                    isFirstSelected={firstSelectedIndex === index}
                    isSecondSelected={secondSelectedIndex === index}
                    isShaking={shakingDigitIndices.includes(index)}
                    isBouncing={isAnimating && animatingDigit === digit && gameState.digits.length === 1}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Operation Buttons */}
          <div style={styles.operationsContainerWrapper}>
            <div style={styles.operationsContainer}>
              {operations.map((op) => (
                <OperationButton
                  key={op}
                  operation={op}
                  onPress={() => handleOperationClick(op)}
                  isSelected={selectedOperation === op}
                  disabled={false}
                />
              ))}
              <UndoButton
                onPress={handleUndo}
                disabled={gameState.history.length === 0}
                style={styles.undoButtonInRow}
              />
            </div>
          </div>

          {/* New Puzzle Button - Only shown in sandbox mode, permanently visible */}
          {gameMode === 'sandbox' && onNewPuzzle && (
            <button
              style={styles.actionButton}
              onClick={onNewPuzzle}
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
                Next Puzzle
                <img src={nextArrowSvg} alt="next" width="20" height="20" style={{ display: 'block' }} />
              </span>
            </button>
          )}

          {/* History Container */}
          <div style={styles.historyContainerWrapper}>
            <div style={styles.historyContainer}>
              <div style={styles.historyInnerBorder} />
              <div style={styles.historyContentWrapper}>
              {Array.from({ length: maxHistoryEntries }, (_, i) => {
                  const hasEntry = i < gameState.history.length;
                  const entry = hasEntry ? gameState.history[i] : undefined;
                  
                  return (
                    <div key={i} style={styles.historyBar}>
                      <div style={styles.historyNumberContainer}>
                        <span style={{
                          ...styles.historyNumber,
                          ...(!hasEntry ? styles.historyNumberEmpty : {}),
                        }}>
                          {i + 1})
                        </span>
                      </div>
                      {hasEntry && entry ? (
                        <span style={styles.historyText}>
                          {entry.operands[0]} {entry.operation === '*' ? '×' : entry.operation === '/' ? '÷' : entry.operation} {entry.operands[1]} = {entry.result}
                        </span>
                      ) : (
                        <span style={styles.historyTextEmpty}> </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Separator Line */}
          <div style={styles.separatorLine}></div>

          {/* Footer Links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <button
              style={styles.contactLink}
              onClick={() => {
                const email = 'rubberduckygamescontact@gmail.com';
                window.location.href = `mailto:${email}`;
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

            <a
              href="https://peopleplacesandthings.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...styles.contactLink, display: 'flex', alignItems: 'center', gap: '8px' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              <img src={pptIcon} alt="People, Places & Things" width="20" height="20" style={{ borderRadius: '4px' }} />
              Play my other game
            </a>
          </div>
        </div>
    </div>
    <HowToPlayModal 
      visible={showHowToPlayModal}
      onClose={() => setShowHowToPlayModal(false)}
    />
    
    {/* Countdown Overlay (Daily Timed mode only) */}
    {showCountdown && countdownValue > 0 && (
      <div style={styles.countdownOverlay}>
        <div style={styles.countdownText}>{countdownValue}</div>
      </div>
    )}
    </>
  );
}
