# DIGITL Project Guidelines

## Puzzle Generation Constraints

When generating new puzzles for DIGITL, follow these constraints for each difficulty level:

### Easy Puzzles (4 tiles)
- **File**: `src/assets/data/puzzles.json`
- **Number of tiles**: 4
- **Target number range**: 5-90
- **Target distribution**: 80% of targets should be between 12-70
- **Division usage**: Not required (natural occurrence is fine)
- **All puzzles must be verified solvable**

### Medium Puzzles (5 tiles)
- **File**: `src/assets/data/puzzles5tile.json`
- **Number of tiles**: 5
- **Target number range**: 10-99
- **Target distribution**: 80% of targets should be between 20-80
- **Division usage**: At least 33% (one-third) of puzzles should require division in their solution
- **All puzzles must be verified solvable**

### Hard Puzzles (6 tiles)
- **File**: `src/assets/data/puzzles6tile.json`
- **Number of tiles**: 6
- **Target number range**: 20-125
- **Target distribution**: 80% of targets should be between 30-105
- **Division usage**: Approximately 40% of puzzles should require division in their solution
- **Maximum ones**: No more than ONE digit of value "1" per puzzle
- **All puzzles must be verified solvable**

## Puzzle Generation Process

1. Generate puzzle digits (random 1-9, respecting constraints)
2. Generate target within specified range (respecting distribution)
3. Verify puzzle is solvable using a recursive solver
4. Check for uniqueness against existing puzzles
5. Track division usage to meet percentage requirements

## Daily Challenge System

- Puzzles rotate daily at 12:00 AM EST
- Reference date: January 1, 2024
- Daily index = (days since reference) % (total puzzles for difficulty)
- Daily challenge has 3 rounds: Easy (round 1), Medium (round 2), Hard (round 3)

## Current Puzzle Counts (as of January 2026)

- Easy: 400 puzzles
- Medium: 450 puzzles
- Hard: 450 puzzles
