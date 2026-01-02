import { Difficulty, Puzzle } from '../types';

type Operation = '+' | '-' | '*' | '/';

// Helper function to perform operations (matching puzzleSolver.ts logic)
function performOperation(a: number, b: number, operation: Operation): number | null {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      if (a - b < 0) return null; // No negative results
      return a - b;
    case '*':
      return a * b;
    case '/':
      if (b === 0) return null;
      const result = a / b;
      return Number.isInteger(result) ? result : null;
    default:
      return null;
  }
}

// Solvability checker (from puzzleSolver.ts)
function solvePuzzle(digits: number[], target: number): boolean {
  if (digits.length === 1) {
    return digits[0] === target;
  }

  const operations: Operation[] = ['+', '-', '*', '/'];

  // Try all pairs of digits
  for (let i = 0; i < digits.length; i++) {
    for (let j = i + 1; j < digits.length; j++) {
      const a = digits[i];
      const b = digits[j];
      const remaining = digits.filter((_, idx) => idx !== i && idx !== j);

      // Try all operations
      for (const op of operations) {
        const result = performOperation(a, b, op);
        if (result !== null && result >= 0) {
          // Try solving with the new number
          if (solvePuzzle([...remaining, result], target)) {
            return true;
          }
        }

        // Try reverse operation (b op a) for non-commutative operations
        if (op === '-' || op === '/') {
          const reverseResult = performOperation(b, a, op);
          if (reverseResult !== null && reverseResult >= 0) {
            if (solvePuzzle([...remaining, reverseResult], target)) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

export function isPuzzleSolvable(puzzle: Puzzle): boolean {
  return solvePuzzle([...puzzle.digits], puzzle.target);
}

// Target number limits by difficulty
const TARGET_LIMITS = {
  easy: 99,
  medium: 149,
  hard: 199,
};

// Number of digits by difficulty
const DIGIT_COUNTS = {
  easy: 4,
  medium: 5,
  hard: 6,
};

export function generateSolvablePuzzle(difficulty: Difficulty): Puzzle {
  let attempts = 0;
  const maxAttempts = 10000;
  const maxTarget = TARGET_LIMITS[difficulty];
  const digitCount = DIGIT_COUNTS[difficulty];

  while (attempts < maxAttempts) {
    // Generate random single-digit numbers (1-9)
    const digits: number[] = [];
    for (let i = 0; i < digitCount; i++) {
      digits.push(Math.floor(Math.random() * 9) + 1);
    }

    // Generate a target within the limit for this difficulty
    const target = Math.floor(Math.random() * maxTarget) + 1;

    const puzzle = { digits, target };
    if (isPuzzleSolvable(puzzle)) {
      return puzzle;
    }

    attempts++;
  }

  // Fallback: return a known solvable puzzle
  const fallbacks: Record<Difficulty, Puzzle> = {
    easy: { digits: [9, 7, 7, 6], target: 56 },
    medium: { digits: [8, 5, 3, 2, 1], target: 42 },
    hard: { digits: [9, 8, 7, 6, 5, 4], target: 100 },
  };
  return fallbacks[difficulty];
}

