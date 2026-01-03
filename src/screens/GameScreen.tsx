import React, { useState, useEffect, useRef } from 'react';
import { GameState, Operation, Difficulty } from '../types';
import { performOperation, getPuzzleKey } from '../utils';
import { 
  FONT_SIZES, SPACING, COLORS, BUTTON_BORDER, BUTTON_SIZES,
  CALCULATOR_DISPLAY, HISTORY_BOX, SCREEN_DIMENSIONS, BORDER_RADIUS
} from '../constants/sizing';
import DigitButton from '../components/DigitButton';
import OperationButton from '../components/OperationButton';
import UndoButton from '../components/UndoButton';
import HowToPlayModal from '../components/HowToPlayModal';
import { CalculatorDisplay } from '../components/CalculatorDisplay';
import nextArrowSvg from '../assets/svgs/next-arrow.svg';
import homeSvg from '../assets/svgs/home.svg';
import librarySvg from '../assets/svgs/library.svg';

const SCREEN_WIDTH = SCREEN_DIMENSIONS.WIDTH;

interface GameScreenProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  difficulty: Difficulty;
  currentPuzzleIndex: number;
  onReturnToMenu: () => void;
  onPuzzleComplete: (puzzleKey: string, finalDigit: number) => void;
  completedPuzzles: Set<string>;
  gameMode?: 'regular' | 'dailyChallenge' | 'sandbox';
  dailyChallengeRound?: 1 | 2 | 3 | null;
  onGoToNextRound?: () => void;
  onNewPuzzle?: () => void;
  showSuccessBanner?: boolean;
  successMessage?: string;
  isAnimating?: boolean;
  animatingDigit?: number | null;
  showAllPuzzlesComplete?: boolean;
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
}: GameScreenProps) {
  const [showHowToPlayModal, setShowHowToPlayModal] = useState(false);
  const [firstSelectedIndex, setFirstSelectedIndex] = useState<number | null>(null);
  const [secondSelectedIndex, setSecondSelectedIndex] = useState<number | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [shakingDigitIndices, setShakingDigitIndices] = useState<number[]>([]);
  const hasCompletedRef = useRef(false);
  
  // Height constant for top row elements (home button, DIGITL title, how to play button)
  // Calculate based on gameTitle element: fontSize + vertical padding * 2 + border * 2
  const titleFontSize = FONT_SIZES.TITLE * 0.85 * 0.9 * 1.1 * 0.85 * 0.6 * 0.9 * 1.4;
  const titleVerticalPadding = SPACING.PADDING_MEDIUM * 0.85 * 0.9 * 0.85 * 0.6 * 0.9 * 1.2;
  const topRowElementHeight = titleFontSize + (titleVerticalPadding * 2) + (BUTTON_BORDER.WIDTH * 2);

  // Target number alignment offset - adjust this value to align with "8888" grooves
  const targetNumberPaddingRight = CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.6344507389508233; // Calculated: 0.6220105283831601 * 1.02

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
      onPuzzleComplete(puzzleKey, newDigits[0]);
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

  // All vertical spacing uses single constant

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.BACKGROUND_LIGHT,
      paddingTop: `${SPACING.VERTICAL_SPACING}px`,
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
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.85 * 0.9 * 0.6 * 2}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE, // Match digit button background
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`, // Match digit button border
      padding: 0, // Remove default padding
      boxShadow: '4px 4px 0 0 rgba(0, 0, 0, 1)', // Match digit button shadow
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
      padding: `${SPACING.PADDING_MEDIUM * 0.85 * 0.9 * 0.85 * 0.6 * 0.9 * 1.2}px ${SPACING.PADDING_LARGE * 0.85 * 0.9 * 0.85 * 0.6 * 0.9 * 1.2}px`, // Scaled down substantially, then 10% more, then scaled up 20%
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.85 * 0.9 * 0.85 * 0.6 * 0.9 * 1.2}px`, // Scaled down substantially, then 10% more, then scaled up 20%
      fontSize: FONT_SIZES.TITLE * 0.85 * 0.9 * 1.1 * 0.85 * 0.6 * 0.9 * 1.4, // Scaled down substantially, then 10% more, then scaled up 40%
      fontFamily: 'Digital-7-Mono, monospace',
      color: COLORS.BACKGROUND_DARK,
      fontWeight: 900 as const, // Increased boldness (from 'bold' which is 700 to 900)
      textAlign: 'center' as const,
      boxShadow: '4px 4px 0 0 rgba(0, 0, 0, 1)',
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
      alignItems: 'flex-start',
      justifyContent: 'center',
      backgroundColor: COLORS.BACKGROUND_DARK,
      paddingLeft: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`, // Same as targetContainer
      paddingRight: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`, // Same as targetContainer
      paddingTop: `${SPACING.VERTICAL_SPACING}px`,
      paddingBottom: `${SPACING.VERTICAL_SPACING}px`,
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
      marginRight: `${SCREEN_WIDTH * 0.013}px`,
    },
    historyNumber: {
      fontSize: FONT_SIZES.SUBTEXT * 1.1 * 0.75, // Scaled down 25%
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
    },
    historyNumberEmpty: {
      color: COLORS.TEXT_SUCCESS,
      opacity: 0.3, // Faded when line is empty
    },
    historyTextEmpty: {
      fontSize: FONT_SIZES.SUBTEXT * 1.1 * 0.75, // Scaled down 25%
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
      flex: 1,
      opacity: 0.12, // Very faded like target display
      textAlign: 'left' as const, // Left-align the empty text
    },
    historyText: {
      fontSize: FONT_SIZES.SUBTEXT * 1.1 * 0.75, // Scaled down 25%
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
      flex: 1,
      textAlign: 'left' as const, // Left-align the equation text
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
      boxShadow: '4px 4px 0 0 rgba(0, 0, 0, 1)',
      transition: 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
    },
    undoButtonInRow: {
      width: `${BUTTON_SIZES.OPERATION_BUTTON_SIZE}px`,
      height: `${BUTTON_SIZES.OPERATION_BUTTON_SIZE}px`,
      borderRadius: '50%',
      marginLeft: `${BUTTON_SIZES.OPERATION_BUTTON_MARGIN * 0.5}px`, // Reduced margin to condense horizontally
    },
    allPuzzlesCompleteBanner: {
      position: 'fixed' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: COLORS.DIFFICULTY_EASY,
      color: COLORS.TEXT_WHITE,
      padding: '30px 50px',
      borderRadius: '16px',
      fontSize: FONT_SIZES.TITLE * 1.2,
      fontFamily: 'Digital-7-Mono, monospace',
      fontWeight: 'bold' as const,
      zIndex: 3000,
      boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
      textAlign: 'center' as const,
      pointerEvents: 'auto' as const,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '10px',
    },
  };

  // Handle 5-tile layout for medium/hard
  const isMedium5Layout = (difficulty === 'medium' || difficulty === 'hard') && gameState.digits.length === 5;
  // Handle 6-tile layout for hard (4 tiles top row, 2 tiles bottom row)
  const isHard6Layout = difficulty === 'hard' && gameState.digits.length === 6;

  return (
    <>
      {showAllPuzzlesComplete && (
        <div style={styles.allPuzzlesCompleteBanner}>
          <div style={{ fontSize: FONT_SIZES.TITLE * 1.5, marginBottom: `${SPACING.VERTICAL_SPACING}px` }}>Congratulations!</div>
          <div>You solved all 3 puzzles!</div>
        </div>
      )}
      <div style={styles.container} className="hide-scrollbar">
        {/* Game Title Row with Home Button */}
        <div style={styles.gameTitleRow}>
          <div style={styles.homeButtonContainer}>
            <div 
              onClick={onReturnToMenu}
              style={styles.iconButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '4px 5px 0 0 rgba(0, 0, 0, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(4px, 4px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
              }}
            >
              <img 
                src={homeSvg} 
                alt="Home" 
                width={topRowElementHeight * 0.5} 
                height={topRowElementHeight * 0.5}
                style={{ display: 'block', cursor: 'pointer' }}
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
                e.currentTarget.style.boxShadow = '4px 5px 0 0 rgba(0, 0, 0, 1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(4px, 4px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
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

        {/* Mode Title - Daily Challenge or Sandbox Mode */}
        {gameMode !== 'regular' && (
          <div style={styles.modeTitle}>
            {gameMode === 'dailyChallenge' ? 'Daily Challenge' : 'Sandbox Mode'}
          </div>
        )}

        {/* Difficulty Text - Centered between title and target */}
        <div style={styles.difficultyText}>
          Difficulty: {difficulty}
        </div>

        <div style={styles.gameContent}>
          {/* Target Display */}
          <CalculatorDisplay
            mode={(showSuccessMessage || showSuccessBanner) ? 'success' : 'target'}
            targetNumber={gameState.target}
            successMessage={showSuccessBanner && successMessage ? successMessage : undefined}
            targetNumberPaddingRight={targetNumberPaddingRight}
          />

          {/* Next Round Button - Only shown in daily challenge mode after puzzle is completed */}
          {gameMode === 'dailyChallenge' && dailyChallengeRound !== null && dailyChallengeRound < 3 && onGoToNextRound && (showSuccessMessage || showSuccessBanner) && (
            <button
              style={styles.actionButton}
              onClick={onGoToNextRound}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(4px, 4px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = 'none';
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
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = '4px 4px 0 0 rgba(0, 0, 0, 1)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(4px, 4px)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = 'none';
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
    </div>
    <HowToPlayModal 
      visible={showHowToPlayModal}
      onClose={() => setShowHowToPlayModal(false)}
    />
    </>
  );
}
