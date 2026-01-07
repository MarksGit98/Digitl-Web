import { Difficulty, Puzzle } from '../types';
import dailyTimedEasyPuzzles from '../assets/data/dailyTimedEasy.json';
import dailyTimedMediumPuzzles from '../assets/data/dailyTimedMedium.json';
import dailyTimedHardPuzzles from '../assets/data/dailyTimedHard.json';

// Reference date for daily timed puzzles: January 1, 2025 (midnight EST)
const REFERENCE_DATE = new Date('2025-01-01T05:00:00.000Z'); // 12 AM EST = 5 AM UTC

// Get the number of days since reference date
function getDaysSinceReference(): number {
  const now = new Date();
  const currentDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  
  // Reset to midnight
  currentDate.setHours(0, 0, 0, 0);
  const referenceDate = new Date(REFERENCE_DATE);
  referenceDate.setHours(0, 0, 0, 0);
  
  const diffTime = currentDate.getTime() - referenceDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Get puzzle for a specific round (1=easy, 2=medium, 3=hard)
export function getDailyTimedPuzzle(round: 1 | 2 | 3): Puzzle | null {
  const dayIndex = getDaysSinceReference();
  
  let puzzles: Puzzle[];
  switch (round) {
    case 1:
      puzzles = dailyTimedEasyPuzzles as Puzzle[];
      break;
    case 2:
      puzzles = dailyTimedMediumPuzzles as Puzzle[];
      break;
    case 3:
      puzzles = dailyTimedHardPuzzles as Puzzle[];
      break;
    default:
      return null;
  }
  
  // Use modulo to cycle through puzzles
  const puzzleIndex = dayIndex % puzzles.length;
  return puzzles[puzzleIndex];
}

// Get difficulty for a specific round
export function getDailyTimedDifficulty(round: 1 | 2 | 3): Difficulty {
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

// Get the current day's date string for display/storage
export function getDailyTimedDateString(): string {
  const now = new Date();
  const estDate = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
  return estDate.toISOString().split('T')[0];
}

