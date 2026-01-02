import React, { useState, useEffect, useRef } from 'react';
import { GameState, Operation, Difficulty } from '../types';
import { performOperation, getPuzzleKey } from '../utils';
import { 
  FONT_SIZES, SPACING, COLORS, BUTTON_BORDER, BUTTON_SIZES,
  CALCULATOR_DISPLAY, HISTORY_BOX, LETTER_SPACING, SCREEN_DIMENSIONS, BORDER_RADIUS
} from '../constants/sizing';
import DigitButton from '../components/DigitButton';
import OperationButton from '../components/OperationButton';
import UndoButton from '../components/UndoButton';
import nextArrowSvg from '../assets/svgs/next-arrow.svg';

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
  const [firstSelectedIndex, setFirstSelectedIndex] = useState<number | null>(null);
  const [secondSelectedIndex, setSecondSelectedIndex] = useState<number | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [shakingDigitIndices, setShakingDigitIndices] = useState<number[]>([]);
  const hasCompletedRef = useRef(false);
  
  // Calculate DIGITL title banner height for home button
  const titleBannerHeight = (FONT_SIZES.TITLE * 0.85 * 0.9) + (SPACING.PADDING_MEDIUM * 0.85 * 0.9 * 2) + (BUTTON_BORDER.WIDTH * 2);

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

  // Standard vertical gap between all elements (except first 3)
  const STANDARD_VERTICAL_GAP = SPACING.MARGIN_SMALL * 0.5;
  // Larger gap for first 3 elements (title, banner, difficulty)
  const TOP_ELEMENTS_GAP = 12;

  const styles = {
    container: {
      width: '100%',
      height: '100%',
      backgroundColor: COLORS.BACKGROUND_LIGHT,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: `${SPACING.CONTAINER_PADDING_TOP * 0.7}px`, // Reduced by 30%
      paddingBottom: `${SPACING.PADDING_MEDIUM}px`,
      paddingLeft: `${SPACING.CONTAINER_PADDING_HORIZONTAL}px`,
      paddingRight: `${SPACING.CONTAINER_PADDING_HORIZONTAL}px`,
      position: 'relative' as const,
      overflowY: 'auto' as const,
      overflowX: 'hidden' as const,
      scrollbarWidth: 'none' as const, // Firefox
      msOverflowStyle: 'none' as const, // IE and Edge
    },
    homeButtonContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    homeIconButton: {
      width: `${titleBannerHeight}px`, // Same height as DIGITL title banner
      height: `${titleBannerHeight}px`,
      minWidth: `${titleBannerHeight}px`,
      minHeight: `${titleBannerHeight}px`,
      maxWidth: `${titleBannerHeight}px`,
      maxHeight: `${titleBannerHeight}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.85 * 0.9}px`, // Match title banner border radius
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
      justifyContent: 'space-between' as const, // Space between left and right items
      width: '100%',
      marginBottom: TOP_ELEMENTS_GAP, // 12px gap for first 3 elements
      marginTop: 0, // No top margin - container padding handles it
    },
    gameTitleBox: {
      width: `${CALCULATOR_DISPLAY.WIDTH * 0.85}px`, // 85% width
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      pointerEvents: 'none' as const, // Prevent mouse interaction
      marginLeft: 'auto', // Push to the right
    },
    gameTitle: {
      backgroundColor: COLORS.BACKGROUND_WHITE,
      padding: `${SPACING.PADDING_MEDIUM * 0.85 * 0.9}px ${SPACING.PADDING_LARGE * 0.85 * 0.9}px`, // Scaled down 15% then another 10%
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.85 * 0.9}px`, // Scaled down 15% then another 10%
      fontSize: FONT_SIZES.TITLE * 0.85 * 0.9 * 1.1, // Scaled down 15% then another 10%, then increased by 10%
      fontFamily: 'Digital-7-Mono, monospace',
      color: COLORS.BACKGROUND_DARK,
      fontWeight: 900 as const, // Increased boldness (from 'bold' which is 700 to 900)
      textAlign: 'center' as const,
      boxShadow: '4px 4px 0 0 rgba(0, 0, 0, 1)',
      border: `${BUTTON_BORDER.WIDTH}px solid ${BUTTON_BORDER.COLOR}`,
      pointerEvents: 'none' as const, // Prevent mouse interaction
      width: '100%', // Make it fill the gameTitleBox width
    },
    modeTitle: {
      backgroundColor: COLORS.BACKGROUND_DARK,
      padding: `${SPACING.PADDING_MEDIUM * 0.7}px ${SPACING.PADDING_LARGE * 0.7}px`, // Scaled down 30%
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.7}px`, // Scaled down 30%
      fontSize: FONT_SIZES.TITLE * 0.7 * 0.7, // Scaled down 30% more
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: COLORS.TEXT_WHITE,
      fontWeight: 'bold' as const,
      textAlign: 'center' as const,
      marginTop: 0, // No top margin - gap handled by previous element
      marginBottom: TOP_ELEMENTS_GAP, // 12px gap for first 3 elements
      width: '100%',
    },
    difficultyText: {
      fontSize: FONT_SIZES.TITLE * 0.6,
      fontFamily: 'Digital-7-Mono, monospace',
      color: COLORS.TEXT_SECONDARY,
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
      width: '100%',
      margin: 0,
      marginTop: 0,
      marginBottom: TOP_ELEMENTS_GAP, // 12px gap for first 3 elements
      marginLeft: 0,
      marginRight: 0,
    },
    gameContent: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      width: '100%',
      paddingTop: 0, // Remove padding - gap handled by difficultyText marginBottom
    },
    targetContainerWrapper: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0, // No top margin - gap handled by difficultyText marginBottom
      marginBottom: STANDARD_VERTICAL_GAP, // Standard gap
    },
    targetContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.BACKGROUND_DARK,
      paddingHorizontal: `${CALCULATOR_DISPLAY.PADDING_HORIZONTAL * 0.75}px`,
      paddingTop: `${CALCULATOR_DISPLAY.PADDING_VERTICAL * 0.75}px`, // Symmetric padding for vertical centering
      paddingBottom: `${CALCULATOR_DISPLAY.PADDING_VERTICAL * 0.75}px`,
      borderRadius: `${CALCULATOR_DISPLAY.BORDER_RADIUS * 0.75}px`,
      width: `${CALCULATOR_DISPLAY.WIDTH * 0.75 * 0.75}px`, // Reduced width to 75% then scaled down 25% more
      height: `${CALCULATOR_DISPLAY.HEIGHT * 0.65}px`, // Decreased from 0.75 to 0.65
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
    },
    targetInnerBorder: {
      position: 'absolute' as const,
      top: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`, // Updated to match scaled border
      left: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      right: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      bottom: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      backgroundColor: '#1F1F1F',
      borderRadius: `${Math.max(0, CALCULATOR_DISPLAY.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 2.5) - 2)}px`, // Updated to match scaled border
      zIndex: 0,
    },
    targetNumberWrapper: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start', // Align to start for chyron effect
      overflow: 'hidden' as const,
      zIndex: 1,
    },
    targetNumber: {
      fontSize: FONT_SIZES.TARGET_NUMBER * 0.75 * 0.75, // Scaled down 25% more (to 56.25% of original)
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
      letterSpacing: `${LETTER_SPACING.WIDE * 0.75}px`, // Scaled down 25%
      textAlign: 'center' as const,
      textShadow: '2px 2px 3px rgba(0, 0, 0, 0.8)',
      zIndex: 1,
      position: 'relative' as const,
      lineHeight: `${FONT_SIZES.TARGET_NUMBER * 0.95}px`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      pointerEvents: 'none' as const, // Prevent mouse interaction
    },
    targetNumberSuccess: {
      fontSize: FONT_SIZES.TARGET_NUMBER * 0.6,
      fontFamily: 'Digital-7-Mono, monospace',
      color: COLORS.DIFFICULTY_EASY,
      fontWeight: 'bold' as const,
      textAlign: 'left' as const, // Changed to left for chyron effect
      whiteSpace: 'nowrap' as const,
      pointerEvents: 'none' as const, // Prevent mouse interaction
      animation: 'chyronScroll 6s linear infinite',
      display: 'block' as const,
      textShadow: '2px 2px 3px rgba(0, 0, 0, 0.8)',
    },
    digitsContainerWrapper: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0, // No top margin - gap handled by targetContainerWrapper marginBottom
      marginBottom: STANDARD_VERTICAL_GAP, // Standard gap
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
      marginTop: 0, // No top margin - gap handled by digitsContainerWrapper marginBottom
      marginBottom: STANDARD_VERTICAL_GAP, // Standard gap
    },
    operationsContainer: {
      display: 'flex',
      flexDirection: 'row' as const,
      justifyContent: 'center',
      alignItems: 'center',
      width: '81%', // 90% of 90% (condensed to 90% of current width)
      gap: `${BUTTON_SIZES.OPERATION_BUTTON_MARGIN * 0.5}px`, // Reduced gap between buttons
    },
    historyContainerWrapper: {
      width: '100%',
      marginTop: SPACING.MARGIN_MEDIUM,
      marginBottom: SPACING.MARGIN_SMALL * 0.8, // Reduced by 20% // Decreased from CALCULATOR_DISPLAY_MARGIN to MARGIN_SMALL
      height: HISTORY_BOX.HEIGHT_HARD,
      textAlign: 'center' as const, // Center the history container horizontally
    },
    historyContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.BACKGROUND_DARK,
      paddingHorizontal: `${HISTORY_BOX.PADDING_HORIZONTAL * 0.75}px`,
      paddingTop: `${HISTORY_BOX.PADDING_VERTICAL * 0.75}px`,
      paddingBottom: `${HISTORY_BOX.PADDING_VERTICAL * 0.75}px`,
      borderRadius: `${HISTORY_BOX.BORDER_RADIUS * 0.75}px`,
      width: `${CALCULATOR_DISPLAY.WIDTH * 0.75}px`,
      maxWidth: `${HISTORY_BOX.MAX_WIDTH * 0.75}px`,
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
      borderTopWidth: `${BUTTON_BORDER.WIDTH * 2.5}px`, // Scaled down from 4 to 2.5
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
      top: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`, // Updated to match scaled border
      left: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      right: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      bottom: `${BUTTON_BORDER.WIDTH * 2.5 + 2}px`,
      backgroundColor: '#1F1F1F', // Same as targetInnerBorder
      borderRadius: `${Math.max(2, HISTORY_BOX.BORDER_RADIUS - (BUTTON_BORDER.WIDTH * 2.5) - 2)}px`, // Updated to match scaled border
      zIndex: 0,
    },
    historyContent: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column' as const,
      paddingLeft: `${HISTORY_BOX.PADDING_HORIZONTAL + SPACING.PADDING_SMALL}px`,
      paddingRight: `${HISTORY_BOX.PADDING_HORIZONTAL + SPACING.PADDING_SMALL}px`,
      paddingTop: `${HISTORY_BOX.PADDING_VERTICAL}px`,
      paddingBottom: `${HISTORY_BOX.PADDING_VERTICAL}px`,
      zIndex: 1,
      position: 'relative' as const,
    },
    historyBar: {
      display: 'flex',
      flexDirection: 'row' as const,
      alignItems: 'center',
      backgroundColor: 'transparent', // Transparent so inner border background (#1F1F1F) shows through
      paddingHorizontal: 0, // Padding handled by container
      paddingVertical: `${HISTORY_BOX.BAR_PADDING_VERTICAL}px`,
      // No borderRadius, margin, borders, or shadows for seamless calculator display appearance
      maxWidth: '100%',
      overflow: 'hidden' as const,
      zIndex: 1,
    },
    historyNumberContainer: {
      marginRight: `${SCREEN_WIDTH * 0.013}px`,
    },
    historyNumber: {
      fontSize: FONT_SIZES.HISTORY_TEXT * 1.1 * 0.75, // Scaled down 25%
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
    },
    historyNumberEmpty: {
      color: '#666',
    },
    historyText: {
      fontSize: FONT_SIZES.HISTORY_TEXT * 1.1 * 0.75, // Scaled down 25%
      color: COLORS.TEXT_SUCCESS,
      fontFamily: 'Digital-7-Mono, monospace',
      flex: 1,
    },
    historyTextEmpty: {
      fontSize: FONT_SIZES.HISTORY_TEXT * 1.1 * 0.75, // Scaled down 25%
      color: 'transparent',
      fontFamily: 'Digital-7-Mono, monospace',
      flex: 1,
    },
    successMessage: {
      position: 'absolute' as const,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: COLORS.DIFFICULTY_EASY,
      color: COLORS.TEXT_WHITE,
      padding: '20px 40px',
      borderRadius: '12px',
      fontSize: FONT_SIZES.TITLE,
      fontFamily: 'Digital-7-Mono, monospace',
      fontWeight: 'bold' as const,
      zIndex: 2000,
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      textAlign: 'center' as const,
      pointerEvents: 'none' as const,
    },
    nextRoundButton: {
      padding: `${14 * 0.85 * 0.85}px ${24 * 0.85 * 0.85}px`, // Scaled down 15% then another 15%
      minWidth: `${200 * 0.85 * 0.85}px`,
      minHeight: `${50 * 0.85 * 0.85}px`,
      borderRadius: `${BORDER_RADIUS.MEDIUM * 0.85 * 0.85}px`,
      backgroundColor: COLORS.BACKGROUND_WHITE,
      color: COLORS.TEXT_SECONDARY,
      marginTop: SPACING.MARGIN_SMALL, // Small top margin
      marginBottom: STANDARD_VERTICAL_GAP, // Standard gap
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
          <div style={{ fontSize: FONT_SIZES.TITLE * 1.5, marginBottom: '10px' }}>Congratulations!</div>
          <div>You solved all 3 puzzles!</div>
        </div>
      )}
      <div style={styles.container} className="hide-scrollbar">
        {/* Game Title Row with Home Button */}
        <div style={styles.gameTitleRow}>
          <div style={styles.homeButtonContainer}>
            <div 
              onClick={onReturnToMenu}
              style={styles.homeIconButton}
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
              <svg
                width={`${titleBannerHeight * 0.5}px`}
                height={`${titleBannerHeight * 0.5}px`}
                viewBox="0 0 122.88 112.07"
                style={{ display: 'block', cursor: 'pointer' }}
              >
                <path
                  fill="#000000"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M61.44,0L0,60.18l14.99,7.87L61.04,19.7l46.85,48.36l14.99-7.87L61.44,0L61.44,0z M18.26,69.63L18.26,69.63 L61.5,26.38l43.11,43.25h0v0v42.43H73.12V82.09H49.49v29.97H18.26V69.63L18.26,69.63L18.26,69.63z"
                />
              </svg>
            </div>
          </div>
          <div style={styles.gameTitleBox}>
            <div style={styles.gameTitle}>DIGITL</div>
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
          <div style={styles.targetContainerWrapper}>
            <div style={styles.targetContainer}>
              <div style={styles.targetInnerBorder} />
              {/* Show success message as chyron in target display, otherwise show target number */}
              {(showSuccessMessage || showSuccessBanner) ? (
                <div style={styles.targetNumberWrapper}>
                  <span style={styles.targetNumberSuccess}>
                    {showSuccessBanner && successMessage ? `${successMessage}!` : 'Success!'}
                  </span>
                </div>
              ) : (
                <span style={styles.targetNumber}>{gameState.target}</span>
              )}
            </div>
          </div>

          {/* Next Round Button - Only shown in daily challenge mode after puzzle is completed */}
          {gameMode === 'dailyChallenge' && dailyChallengeRound !== null && dailyChallengeRound < 3 && onGoToNextRound && (showSuccessMessage || showSuccessBanner) && (
            <button
              style={styles.nextRoundButton}
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
              style={styles.nextRoundButton}
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
              <div style={styles.historyContent}>
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
    </div>
    </>
  );
}
