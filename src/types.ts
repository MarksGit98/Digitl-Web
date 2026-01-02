// Copy types from main project
export type Operation = '+' | '-' | '*' | '/';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Puzzle {
  digits: number[];
  target: number;
}

export interface HistoryEntry {
  operation: Operation;
  operands: [number, number];
  result: number;
  previousDigits: number[];
}

export interface GameState {
  digits: number[];
  target: number;
  history: HistoryEntry[];
}

