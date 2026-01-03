import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Difficulty, GameState } from './types';
import { getPuzzlesByDifficulty } from './utils';
import { loadCompletedPuzzles, saveCompletedPuzzles } from './utils/storage';
import { adManager } from './utils/adManager';
import { getDailyChallengePuzzle, getDailyChallengeDifficulty } from './utils/dailyChallenge';
import { generateSolvablePuzzle } from './utils/puzzleGenerator';
import GameContainer from './components/GameContainer';
import MainMenuScreen from './screens/MainMenuScreen';
import GameScreen from './screens/GameScreen';

type GameMode = 'regular' | 'dailyChallenge' | 'sandbox';

export default function App() {
  const [, setShowMenu] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(0);
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<string>>(new Set());
  const [isLoadingSavedData, setIsLoadingSavedData] = useState(true);
  const [gameMode, setGameMode] = useState<GameMode>('regular');
  const [dailyChallengeRound, setDailyChallengeRound] = useState<1 | 2 | 3>(1);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatingDigit, setAnimatingDigit] = useState<number | null>(null);
  const [showAllPuzzlesComplete, setShowAllPuzzlesComplete] = useState(false);
  const [nextPuzzle, setNextPuzzle] = useState<{ digits: number[]; target: number } | null>(null);

  useEffect(() => {
    const loadSavedData = async () => {
      try {
        await adManager.initialize();
        const savedCompletedPuzzles = await loadCompletedPuzzles();
        setCompletedPuzzles(savedCompletedPuzzles);
      } catch (error) {
        console.warn('Failed to load saved data:', error);
      } finally {
        setIsLoadingSavedData(false);
      }
    };
    loadSavedData();
  }, []);

  useEffect(() => {
    if (!isLoadingSavedData && completedPuzzles.size > 0) {
      saveCompletedPuzzles(completedPuzzles);
    }
  }, [completedPuzzles, isLoadingSavedData]);

  const loadPuzzleByIndex = (index: number) => {
    if (!difficulty) return;
    const puzzles = getPuzzlesByDifficulty(difficulty);
    if (index >= 0 && index < puzzles.length) {
      const puzzle = puzzles[index];
      setCurrentPuzzleIndex(index);
      setGameState({
        digits: puzzle.digits,
        target: puzzle.target,
        history: [],
      });
    }
  };

  const startDailyChallenge = () => {
    setGameMode('dailyChallenge');
    setDailyChallengeRound(1);
    const puzzle = getDailyChallengePuzzle(1);
    if (puzzle) {
      setDifficulty(getDailyChallengeDifficulty(1));
      setCurrentPuzzleIndex(0);
      setGameState({
        digits: puzzle.digits,
        target: puzzle.target,
        history: [],
      });
      // Reset animation and success states
      setIsAnimating(false);
      setAnimatingDigit(null);
      setShowSuccessBanner(false);
      setShowAllPuzzlesComplete(false);
      setShowMenu(false);
    }
  };

  const startSandbox = () => {
    if (!selectedDifficulty) return;
    setGameMode('sandbox');
    setDifficulty(selectedDifficulty);
    const puzzle = generateSolvablePuzzle(selectedDifficulty);
    setCurrentPuzzleIndex(-1); // Use -1 to indicate generated puzzle
    setGameState({
      digits: puzzle.digits,
      target: puzzle.target,
      history: [],
    });
    setShowMenu(false);
  };

  const goToNextLevel = () => {
    if (difficulty !== null) {
      const puzzles = getPuzzlesByDifficulty(difficulty);
      const nextIndex = currentPuzzleIndex + 1;
      if (nextIndex < puzzles.length) {
        loadPuzzleByIndex(nextIndex);
      } else {
        // If we've completed all puzzles, loop back to the first one
        loadPuzzleByIndex(0);
      }
    }
  };

  const returnToMenu = () => {
    setShowMenu(true);
    setGameState(null);
    setDifficulty(null);
    setCurrentPuzzleIndex(0);
    setGameMode('regular');
    setDailyChallengeRound(1);
    // Reset animation and success states
    setIsAnimating(false);
    setAnimatingDigit(null);
    setShowSuccessBanner(false);
    setShowAllPuzzlesComplete(false);
  };

  const loadNextSandboxPuzzle = () => {
    if (!difficulty || !nextPuzzle) return;
    
    // Load the pre-generated puzzle
    setGameState({
      digits: nextPuzzle.digits,
      target: nextPuzzle.target,
      history: [],
    });
    
    // Generate the next puzzle in the background
    const newNextPuzzle = generateSolvablePuzzle(difficulty);
    setNextPuzzle(newNextPuzzle);
    
    // Reset animation states when loading new puzzle
    setIsAnimating(false);
    setAnimatingDigit(null);
    setShowSuccessBanner(false);
  };

  const generateNewSandboxPuzzle = () => {
    if (!difficulty) return;
    
    // Generate a new puzzle
    const puzzle = generateSolvablePuzzle(difficulty);
    setGameState({
      digits: puzzle.digits,
      target: puzzle.target,
      history: [],
    });
    
    // Generate the next puzzle in the background for pre-loading
    const newNextPuzzle = generateSolvablePuzzle(difficulty);
    setNextPuzzle(newNextPuzzle);
    
    // Reset animation states
    setIsAnimating(false);
    setAnimatingDigit(null);
    setShowSuccessBanner(false);
    setShowAllPuzzlesComplete(false);
  };

  const goToNextDailyChallengeRound = () => {
    if (dailyChallengeRound < 3) {
      const nextRound = (dailyChallengeRound + 1) as 1 | 2 | 3;
      setDailyChallengeRound(nextRound);
      const puzzle = getDailyChallengePuzzle(nextRound);
      if (puzzle) {
        setDifficulty(getDailyChallengeDifficulty(nextRound));
        setCurrentPuzzleIndex(0);
        setGameState({
          digits: puzzle.digits,
          target: puzzle.target,
          history: [],
        });
        // Reset animation states when loading new puzzle
        setIsAnimating(false);
        setAnimatingDigit(null);
        setShowSuccessBanner(false);
      }
    } else {
      // Completed all rounds, return to menu
      returnToMenu();
    }
  };

  const handlePuzzleComplete = (puzzleKey: string, finalDigit: number) => {
    setCompletedPuzzles(prev => new Set([...prev, puzzleKey]));
    
    if (gameMode === 'dailyChallenge') {
      // For daily challenge, start bounce animation and show success message
      setTimeout(() => {
        setIsAnimating(true);
        setAnimatingDigit(finalDigit);
        
        // Check if this is the final puzzle (round 3)
        if (dailyChallengeRound === 3) {
          // Show congratulations banner for completing all 3 puzzles
          setShowAllPuzzlesComplete(true);
        } else {
          // Show success banner with random affirmation
          const affirmations = ['Amazing', 'Awesome', 'Great', 'Excellent', 'Perfect', 'Brilliant', 'Fantastic', 'Incredible', 'Outstanding', 'Superb'];
          const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
          setSuccessMessage(randomAffirmation);
          setShowSuccessBanner(true);
        }
        // Keep bounce animation running - don't stop it
      }, 500);
    } else if (gameMode === 'sandbox') {
      // For sandbox, show bounce animation and success banner, then load next puzzle
      setTimeout(() => {
        setIsAnimating(true);
        setAnimatingDigit(finalDigit);
        
        // Show success banner with random affirmation
        const affirmations = ['Amazing', 'Awesome', 'Great', 'Excellent', 'Perfect', 'Brilliant', 'Fantastic', 'Incredible', 'Outstanding', 'Superb'];
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        setSuccessMessage(randomAffirmation);
        setShowSuccessBanner(true);
        
        // Keep bounce animation running - don't stop it
        // After a delay, load next puzzle (which will reset the animation)
        setTimeout(() => {
          loadNextSandboxPuzzle();
        }, 2000);
      }, 500);
    } else {
      // Auto-advance to next level after a short delay for regular mode
      setTimeout(() => {
        goToNextLevel();
      }, 1500);
    }
  };

  if (isLoadingSavedData) {
    return (
      <GameContainer>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Loading...
        </div>
      </GameContainer>
    );
  }

  if (gameState && difficulty !== null) {
    // Wrapper function to ensure GameState is never null when passed to GameScreen
    const handleSetGameState: Dispatch<SetStateAction<GameState>> = (newState) => {
      if (typeof newState === 'function') {
        setGameState((prev) => {
          if (prev === null) return null;
          const result = newState(prev);
          return result;
        });
      } else {
        setGameState(newState);
      }
    };

    return (
      <GameContainer>
        <GameScreen
          gameState={gameState}
          setGameState={handleSetGameState}
          difficulty={difficulty}
          currentPuzzleIndex={currentPuzzleIndex}
          onReturnToMenu={returnToMenu}
          onPuzzleComplete={handlePuzzleComplete}
          completedPuzzles={completedPuzzles}
          gameMode={gameMode}
          dailyChallengeRound={gameMode === 'dailyChallenge' ? dailyChallengeRound : null}
          onGoToNextRound={gameMode === 'dailyChallenge' ? goToNextDailyChallengeRound : undefined}
          onNewPuzzle={gameMode === 'sandbox' ? generateNewSandboxPuzzle : undefined}
          showSuccessBanner={showSuccessBanner}
          successMessage={successMessage}
          isAnimating={isAnimating}
          animatingDigit={animatingDigit}
          showAllPuzzlesComplete={showAllPuzzlesComplete}
        />
      </GameContainer>
    );
  }

  return (
    <GameContainer>
      <MainMenuScreen
        selectedDifficulty={selectedDifficulty}
        onDifficultyChange={setSelectedDifficulty}
        onStartDailyChallenge={startDailyChallenge}
        onStartSandbox={startSandbox}
      />
    </GameContainer>
  );
}

