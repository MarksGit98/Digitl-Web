const fs = require('fs');

// Puzzle solver that tracks which operations are used
function solvePuzzleWithOperations(digits, target, usedOps = new Set()) {
  if (digits.length === 1) {
    return digits[0] === target ? usedOps : null;
  }

  const operations = ['+', '-', '*', '/'];

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
          const newOps = new Set([...usedOps, op]);
          const solution = solvePuzzleWithOperations([...remaining, result], target, newOps);
          if (solution) {
            return solution;
          }
        }

        // Try reverse operation for non-commutative operations
        if (op === '-' || op === '/') {
          const reverseResult = performOperation(b, a, op);
          if (reverseResult !== null && reverseResult >= 0) {
            const newOps = new Set([...usedOps, op]);
            const solution = solvePuzzleWithOperations([...remaining, reverseResult], target, newOps);
            if (solution) {
              return solution;
            }
          }
        }
      }
    }
  }

  return null;
}

function performOperation(a, b, operation) {
  switch (operation) {
    case '+':
      return a + b;
    case '-':
      if (a - b < 0) return null;
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

function isPuzzleSolvable(digits, target) {
  return solvePuzzleWithOperations(digits, target) !== null;
}

function requiresDivision(digits, target) {
  const solution = solvePuzzleWithOperations(digits, target);
  return solution && solution.has('/');
}

// Target distribution based on difficulty
function getTargetRange(difficulty) {
  const rand = Math.random();
  
  switch (difficulty) {
    case 'easy':
      // 5-99, 80% between 10-65
      if (rand < 0.8) {
        return Math.floor(Math.random() * (65 - 10 + 1)) + 10;
      } else {
        const remaining = Math.random() < 0.5 ? 
          Math.floor(Math.random() * (9 - 5 + 1)) + 5 :  // 5-9
          Math.floor(Math.random() * (99 - 66 + 1)) + 66; // 66-99
        return remaining;
      }
    
    case 'medium':
      // 10-125, 85% between 15-90
      if (rand < 0.85) {
        return Math.floor(Math.random() * (90 - 15 + 1)) + 15;
      } else {
        const remaining = Math.random() < 0.5 ?
          Math.floor(Math.random() * (14 - 10 + 1)) + 10 : // 10-14
          Math.floor(Math.random() * (125 - 91 + 1)) + 91; // 91-125
        return remaining;
      }
    
    case 'hard':
      // 20-149, 90% between 24-120
      if (rand < 0.9) {
        return Math.floor(Math.random() * (120 - 24 + 1)) + 24;
      } else {
        const remaining = Math.random() < 0.5 ?
          Math.floor(Math.random() * (23 - 20 + 1)) + 20 : // 20-23
          Math.floor(Math.random() * (149 - 121 + 1)) + 121; // 121-149
        return remaining;
      }
  }
}

function getDigitCount(difficulty) {
  switch (difficulty) {
    case 'easy': return 4;
    case 'medium': return 5;
    case 'hard': return 6;
  }
}

function generatePuzzle(difficulty, requireDiv = false) {
  const maxAttempts = 50000;
  let attempts = 0;
  const digitCount = getDigitCount(difficulty);

  while (attempts < maxAttempts) {
    // Generate random digits (1-9)
    const digits = [];
    for (let i = 0; i < digitCount; i++) {
      digits.push(Math.floor(Math.random() * 9) + 1);
    }

    // Generate target within the range
    const target = getTargetRange(difficulty);

    // Check if solvable
    if (isPuzzleSolvable(digits, target)) {
      // If division is required, check for it
      if (requireDiv) {
        if (requiresDivision(digits, target)) {
          return { digits, target };
        }
      } else {
        return { digits, target };
      }
    }

    attempts++;
  }

  console.error(`Failed to generate ${difficulty} puzzle${requireDiv ? ' with division' : ''} after ${maxAttempts} attempts`);
  return null;
}

function generatePuzzleSet(difficulty, count) {
  const puzzles = [];
  const needsDivision = ['medium', 'hard'].includes(difficulty);
  const divisionCount = needsDivision ? Math.ceil(count / 3) : 0;
  
  console.log(`Generating ${count} ${difficulty} puzzles...`);
  if (needsDivision) {
    console.log(`  - ${divisionCount} puzzles requiring division`);
    console.log(`  - ${count - divisionCount} puzzles without division requirement`);
  }

  // Generate puzzles that require division first
  for (let i = 0; i < divisionCount; i++) {
    process.stdout.write(`\r  Division puzzles: ${i + 1}/${divisionCount}`);
    const puzzle = generatePuzzle(difficulty, true);
    if (puzzle) {
      puzzles.push(puzzle);
    }
  }
  
  if (divisionCount > 0) console.log(''); // New line

  // Generate remaining puzzles
  for (let i = 0; i < count - divisionCount; i++) {
    process.stdout.write(`\r  Regular puzzles: ${i + 1}/${count - divisionCount}`);
    const puzzle = generatePuzzle(difficulty, false);
    if (puzzle) {
      puzzles.push(puzzle);
    }
  }
  
  console.log(''); // New line
  console.log(`✓ Generated ${puzzles.length} ${difficulty} puzzles\n`);
  
  return puzzles;
}

function appendPuzzlesToFile(filePath, newPuzzles) {
  // Read existing puzzles
  let existingPuzzles = [];
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    existingPuzzles = JSON.parse(content);
  }

  // Append new puzzles
  const allPuzzles = [...existingPuzzles, ...newPuzzles];

  // Write back to file
  fs.writeFileSync(filePath, JSON.stringify(allPuzzles, null, 2));
  console.log(`✓ Appended ${newPuzzles.length} puzzles to ${filePath}`);
  console.log(`  Total puzzles in file: ${allPuzzles.length}\n`);
}

// Main execution
console.log('='.repeat(60));
console.log('Number Brain Puzzle Generator');
console.log('='.repeat(60));
console.log('\nConstraints:');
console.log('  Easy (4 digits): Target 5-99 (80% between 10-65)');
console.log('  Medium (5 digits): Target 10-125 (85% between 15-90, 33%+ use division)');
console.log('  Hard (6 digits): Target 20-149 (90% between 24-120, 33%+ use division)');
console.log('\n' + '='.repeat(60) + '\n');

const files = [
  { path: 'src/assets/data/puzzles.json', difficulty: 'easy' },
  { path: 'src/assets/data/puzzles5tile.json', difficulty: 'medium' },
  { path: 'src/assets/data/puzzles6tile.json', difficulty: 'hard' },
  { path: 'src/assets/data/dailyTimedEasy.json', difficulty: 'easy' },
  { path: 'src/assets/data/dailyTimedMedium.json', difficulty: 'medium' },
  { path: 'src/assets/data/dailyTimedHard.json', difficulty: 'hard' }
];

for (const file of files) {
  console.log(`Processing: ${file.path}`);
  const newPuzzles = generatePuzzleSet(file.difficulty, 100);
  appendPuzzlesToFile(file.path, newPuzzles);
}

console.log('='.repeat(60));
console.log('✓ All puzzles generated successfully!');
console.log('='.repeat(60));
