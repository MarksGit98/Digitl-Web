import { Difficulty, Puzzle } from '../types';
import { getPuzzlesByDifficulty, getPuzzleByIndex } from '../utils';

// Reference date: January 1, 2024, 12:00 AM EST
// Puzzles rotate at 12am EST (midnight) every 24 hours
function getDaysSinceReference(): number {
  const now = new Date();
  
  // Get current date/time string in EST
  const estDateString = now.toLocaleString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  // Parse: "MM/DD/YYYY, HH:MM"
  const [datePart] = estDateString.split(', ');
  const [month, day, year] = datePart.split('/');
  
  const currentDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  
  // Puzzles rotate at 12am EST (midnight) - no day adjustment needed
  // The current date from the EST timezone is used directly
  
  // Reference date: January 1, 2024
  const referenceDate = new Date(2024, 0, 1);
  
  // Calculate difference in days
  const diffTime = currentDate.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

// Get daily challenge puzzle indices based on date (rotates at 12pm EST)
function getDailyChallengeIndices(): { easy: number; medium: number; hard: number } {
  const easyPuzzles = getPuzzlesByDifficulty('easy');
  const mediumPuzzles = getPuzzlesByDifficulty('medium');
  const hardPuzzles = getPuzzlesByDifficulty('hard');
  
  const daysSinceReference = getDaysSinceReference();
  
  // Cycle through puzzles sequentially based on days since reference date
  const easyIndex = daysSinceReference % easyPuzzles.length;
  const mediumIndex = daysSinceReference % mediumPuzzles.length;
  const hardIndex = daysSinceReference % hardPuzzles.length;
  
  return { easy: easyIndex, medium: mediumIndex, hard: hardIndex };
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
