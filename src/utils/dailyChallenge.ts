import { Difficulty, Puzzle } from '../types';
import { getPuzzlesByDifficulty, getPuzzleByIndex } from '../utils';

const STORAGE_KEYS = {
  DAILY_CHALLENGE_DATE: '@NumberBrain:dailyChallengeDate',
  DAILY_CHALLENGE_EASY_INDEX: '@NumberBrain:dailyChallengeEasyIndex',
  DAILY_CHALLENGE_MEDIUM_INDEX: '@NumberBrain:dailyChallengeMediumIndex',
  DAILY_CHALLENGE_HARD_INDEX: '@NumberBrain:dailyChallengeHardIndex',
};

// Get current date in Eastern Time
function getEasternDate(): string {
  const now = new Date();
  // Convert to Eastern Time
  const easternTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  // Return YYYY-MM-DD format
  return easternTime.toISOString().split('T')[0];
}

// Check if we need to reset daily challenge (new day in Eastern Time)
function shouldResetDailyChallenge(): boolean {
  const savedDate = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE_DATE);
  const currentDate = getEasternDate();
  return savedDate !== currentDate;
}

// Get or generate daily challenge puzzle indices
function getDailyChallengeIndices(): { easy: number; medium: number; hard: number } {
  if (shouldResetDailyChallenge()) {
    // Generate new random indices for today
    const easyPuzzles = getPuzzlesByDifficulty('easy');
    const mediumPuzzles = getPuzzlesByDifficulty('medium');
    const hardPuzzles = getPuzzlesByDifficulty('hard');
    
    const easyIndex = Math.floor(Math.random() * easyPuzzles.length);
    const mediumIndex = Math.floor(Math.random() * mediumPuzzles.length);
    const hardIndex = Math.floor(Math.random() * hardPuzzles.length);
    
    // Save for today
    const currentDate = getEasternDate();
    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE_DATE, currentDate);
    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE_EASY_INDEX, JSON.stringify(easyIndex));
    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE_MEDIUM_INDEX, JSON.stringify(mediumIndex));
    localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE_HARD_INDEX, JSON.stringify(hardIndex));
    
    return { easy: easyIndex, medium: mediumIndex, hard: hardIndex };
  }
  
  // Load saved indices
  const easyIndexData = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE_EASY_INDEX);
  const mediumIndexData = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE_MEDIUM_INDEX);
  const hardIndexData = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE_HARD_INDEX);
  
  return {
    easy: easyIndexData ? JSON.parse(easyIndexData) : 0,
    medium: mediumIndexData ? JSON.parse(mediumIndexData) : 0,
    hard: hardIndexData ? JSON.parse(hardIndexData) : 0,
  };
}

export function getDailyChallengePuzzle(round: 1 | 2 | 3): Puzzle | null {
  const indices = getDailyChallengeIndices();
  
  switch (round) {
    case 1:
      return getPuzzleByIndex('easy', indices.easy);
    case 2:
      return getPuzzleByIndex('medium', indices.medium);
    case 3:
      return getPuzzleByIndex('hard', indices.hard);
    default:
      return null;
  }
}

export function getDailyChallengeDifficulty(round: 1 | 2 | 3): Difficulty {
  switch (round) {
    case 1:
      return 'easy';
    case 2:
      return 'medium';
    case 3:
      return 'hard';
    default:
      return 'easy';
  }
}

