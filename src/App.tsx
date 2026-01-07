import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { Difficulty, GameState } from './types';
import { getPuzzlesByDifficulty } from './utils';
import { loadCompletedPuzzles, saveCompletedPuzzles } from './utils/storage';
import { adManager } from './utils/adManager';
import { getDailyChallengePuzzle, getDailyChallengeDifficulty } from './utils/dailyChallenge';
import { getDailyTimedPuzzle, getDailyTimedDifficulty } from './utils/dailyTimed';
import { generateSolvablePuzzle } from './utils/puzzleGenerator';
import { submitDailyTimedResult, calculatePercentile } from './utils/leaderboard';
import GameContainer from './components/GameContainer';
import MainMenuScreen from './screens/MainMenuScreen';
import GameScreen from './screens/GameScreen';

type GameMode = 'regular' | 'dailyChallenge' | 'dailyTimed' | 'sandbox';

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
  
  // Daily Timed mode states
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [roundTimes, setRoundTimes] = useState<number[]>([]);
  const [userPercentile, setUserPercentile] = useState<number | null>(null);

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

  // Countdown effect for Daily Timed mode
  useEffect(() => {
    if (showCountdown && countdownValue > 0) {
      const timer = setTimeout(() => {
        setCountdownValue(countdownValue - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdownValue === 0) {
      // Countdown finished, start the timer
      setShowCountdown(false);
      setIsTimerRunning(true);
    }
  }, [showCountdown, countdownValue]);

  // Timer effect for Daily Timed mode
  useEffect(() => {
    if (isTimerRunning) {
      const timer = setInterval(() => {
        setTimerSeconds(prev => {
          // Stop timer at 1 hour (3600 seconds)
          if (prev >= 3599) {
            setIsTimerRunning(false);
            return 3600;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isTimerRunning]);

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
      setSuccessMessage('');
      setShowMenu(false);
    }
  };

  const startDailyTimed = () => {
    setGameMode('dailyTimed');
    setDailyChallengeRound(1);
    const puzzle = getDailyTimedPuzzle(1);
    if (puzzle) {
      setDifficulty(getDailyTimedDifficulty(1));
      setCurrentPuzzleIndex(0);
      setGameState({
        digits: puzzle.digits,
        target: puzzle.target,
        history: [],
      });
      // Reset states
      setIsAnimating(false);
      setAnimatingDigit(null);
      setShowSuccessBanner(false);
      setSuccessMessage('');
      setShowAllPuzzlesComplete(false);
      setRoundTimes([]);
      setTimerSeconds(0);
      setIsTimerRunning(false);
      setUserPercentile(null);
      setShowMenu(false);
      
      // Start countdown
      setShowCountdown(true);
      setCountdownValue(3);
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

  const generateNewSandboxPuzzle = () => {
    if (!difficulty) return;
    
    // Generate a new puzzle
    const puzzle = generateSolvablePuzzle(difficulty);
    setGameState({
      digits: puzzle.digits,
      target: puzzle.target,
      history: [],
    });
    
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
        setSuccessMessage(''); // Clear success message for next round
      }
    } else {
      // Completed all rounds, return to menu
      returnToMenu();
    }
  };

  const goToNextDailyTimedRound = () => {
    if (dailyChallengeRound < 3) {
      const nextRound = (dailyChallengeRound + 1) as 1 | 2 | 3;
      setDailyChallengeRound(nextRound);
      const puzzle = getDailyTimedPuzzle(nextRound);
      if (puzzle) {
        setDifficulty(getDailyTimedDifficulty(nextRound));
        setCurrentPuzzleIndex(0);
        setGameState({
          digits: puzzle.digits,
          target: puzzle.target,
          history: [],
        });
        // Reset animation and timer states
        setIsAnimating(false);
        setAnimatingDigit(null);
        setShowSuccessBanner(false);
        setSuccessMessage('');
        setTimerSeconds(0);
        setIsTimerRunning(false);
        
        // Start countdown for next round
        setShowCountdown(true);
        setCountdownValue(3);
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
          // For rounds 1 and 2, show success message in chyron (not overlay)
          const affirmations = ['Amazing', 'Awesome', 'Great', 'Excellent', 'Perfect', 'Brilliant', 'Fantastic', 'Incredible', 'Outstanding', 'Superb'];
          const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
          setSuccessMessage(randomAffirmation);
        }
        // Keep bounce animation running - don't stop it
      }, 500);
    } else if (gameMode === 'dailyTimed') {
      // Stop the timer immediately
      setIsTimerRunning(false);
      // Save the time for this round
      setRoundTimes(prev => [...prev, timerSeconds]);
      
      // Start bounce animation and show success message
      setTimeout(() => {
        setIsAnimating(true);
        setAnimatingDigit(finalDigit);
        
        // Set success message for timer highlight (all rounds)
        const affirmations = ['Amazing', 'Awesome', 'Great', 'Excellent', 'Perfect', 'Brilliant', 'Fantastic', 'Incredible', 'Outstanding', 'Superb'];
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        setSuccessMessage(randomAffirmation);
        
        // Check if this is the final puzzle (round 3)
        if (dailyChallengeRound === 3) {
          // Submit results to Firebase and calculate percentile
          const totalTime = roundTimes[0] + roundTimes[1] + timerSeconds;
          
          // Submit to Firebase (async, but don't wait for it)
          submitDailyTimedResult(currentPuzzleIndex, [roundTimes[0], roundTimes[1], timerSeconds] as [number, number, number])
            .then((submitted) => {
              if (submitted) {
                console.log('Successfully submitted daily timed result');
              }
            })
            .catch((error) => {
              console.error('Error submitting result:', error);
            });
          
          // Calculate percentile (async, don't wait for it)
          calculatePercentile(totalTime)
            .then((percentile) => {
              setUserPercentile(percentile);
            })
            .catch((error) => {
              console.error('Error calculating percentile:', error);
            });
          
          // Show congratulations banner for completing all 3 puzzles after a brief delay
          setTimeout(() => {
            setShowAllPuzzlesComplete(true);
          }, 1000); // Extra delay to show red timer and bounce animation
        }
      }, 500);
    } else if (gameMode === 'sandbox') {
      // For sandbox, show bounce animation and success banner (no auto-close)
      setTimeout(() => {
        setIsAnimating(true);
        setAnimatingDigit(finalDigit);
        
        // Show success banner with random affirmation
        const affirmations = ['Amazing', 'Awesome', 'Great', 'Excellent', 'Perfect', 'Brilliant', 'Fantastic', 'Incredible', 'Outstanding', 'Superb'];
        const randomAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
        setSuccessMessage(randomAffirmation);
        setShowSuccessBanner(true);
        
        // Keep bounce animation running - don't stop it
        // Banner stays open until user closes it
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
          dailyChallengeRound={gameMode === 'dailyChallenge' || gameMode === 'dailyTimed' ? dailyChallengeRound : null}
          onGoToNextRound={
            gameMode === 'dailyChallenge' ? goToNextDailyChallengeRound :
            gameMode === 'dailyTimed' ? goToNextDailyTimedRound :
            undefined
          }
          onNewPuzzle={gameMode === 'sandbox' ? generateNewSandboxPuzzle : undefined}
          showSuccessBanner={showSuccessBanner}
          successMessage={successMessage}
          isAnimating={isAnimating}
          animatingDigit={animatingDigit}
          showAllPuzzlesComplete={showAllPuzzlesComplete}
          onStartSandbox={startSandbox}
          onStartDailyChallenge={startDailyChallenge}
          onStartDailyTimed={startDailyTimed}
          onCloseSuccessBanner={() => setShowSuccessBanner(false)}
          onCloseAllPuzzlesComplete={() => setShowAllPuzzlesComplete(false)}
          showCountdown={showCountdown}
          countdownValue={countdownValue}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          roundTimes={roundTimes}
          userPercentile={userPercentile}
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
        onStartDailyTimed={startDailyTimed}
        onStartSandbox={startSandbox}
      />
    </GameContainer>
  );
}

