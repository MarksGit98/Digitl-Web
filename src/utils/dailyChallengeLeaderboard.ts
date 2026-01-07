import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { getAnonymousUserId, getTodaysDate } from './userIdentity';
import { HistoryEntry } from '../types';

// Maximum submissions per day per difficulty to stay within Firebase free tier
// DISABLED: Not used until we re-enable hasReachedDailyLimitForDifficulty()
// const MAX_DAILY_SUBMISSIONS_PER_DIFFICULTY = 5000;

export interface DailyChallengeResult {
  date: string;
  userId: string;
  puzzleIndex: number;
  difficulty: 'easy' | 'medium' | 'hard';
  solution: string; // e.g., "4+2=6,6*3=18,18-1=17"
}

/**
 * Converts history to a solution string
 * Example: [{operands: [4, 2], operation: '+', result: 6}, ...] 
 *       -> "4+2=6,6*3=18,18-1=17"
 */
export function solutionToString(history: HistoryEntry[]): string {
  return history.map(step => `${step.operands[0]}${step.operation}${step.operands[1]}=${step.result}`).join(',');
}

/**
 * Checks if the user has already submitted a result for this difficulty today
 * DISABLED: Requires composite index on (date, userId, difficulty)
 */
/*
async function hasSubmittedTodayForDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<boolean> {
  try {
    const userId = getAnonymousUserId();
    const today = getTodaysDate();
    
    const resultsRef = collection(db, 'dailyChallengeResults');
    const q = query(
      resultsRef,
      where('date', '==', today),
      where('userId', '==', userId),
      where('difficulty', '==', difficulty),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking if user has submitted:', error);
    return false;
  }
}
*/

/**
 * Checks if we've reached the daily submission limit for this difficulty
 * DISABLED: Requires composite index on (date, difficulty)
 */
/*
async function hasReachedDailyLimitForDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Promise<boolean> {
  try {
    const today = getTodaysDate();
    const resultsRef = collection(db, 'dailyChallengeResults');
    const q = query(
      resultsRef,
      where('date', '==', today),
      where('difficulty', '==', difficulty)
    );
    
    const snapshot = await getDocs(q);
    const count = snapshot.size;
    
    if (count >= MAX_DAILY_SUBMISSIONS_PER_DIFFICULTY) {
      console.warn(`Daily submission limit reached for ${difficulty}: ${count}/${MAX_DAILY_SUBMISSIONS_PER_DIFFICULTY}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking daily limit:', error);
    return false;
  }
}
*/

/**
 * Submits a daily challenge result to Firebase
 */
export async function submitDailyChallengeResult(
  puzzleIndex: number,
  difficulty: 'easy' | 'medium' | 'hard',
  history: HistoryEntry[]
): Promise<boolean> {
  console.log(`🚀 [Daily Challenge - ${difficulty}] Starting submission...`, { puzzleIndex, historyLength: history.length });
  
  try {
    // TEMPORARILY DISABLED: These queries require composite indexes
    // Uncomment after creating indexes in Firebase Console
    
    // const alreadySubmitted = await hasSubmittedTodayForDifficulty(difficulty);
    // console.log(`📋 [Daily Challenge - ${difficulty}] Already submitted check:`, alreadySubmitted);
    // if (alreadySubmitted) {
    //   console.log(`⚠️ [Daily Challenge - ${difficulty}] User has already submitted result for today. Skipping submission.`);
    //   return false;
    // }
    
    // const limitReached = await hasReachedDailyLimitForDifficulty(difficulty);
    // console.log(`📊 [Daily Challenge - ${difficulty}] Daily limit check:`, limitReached);
    // if (limitReached) {
    //   console.warn(`⚠️ [Daily Challenge - ${difficulty}] Daily submission limit reached. Result not submitted.`);
    //   return false;
    // }
    
    console.log(`⚠️ [Daily Challenge - ${difficulty}] Skipping duplicate/limit checks (indexes not created yet)`);
    
    const userId = getAnonymousUserId();
    const today = getTodaysDate();
    const solution = solutionToString(history);
    
    console.log(`🔍 [Daily Challenge - ${difficulty}] Solution pattern:`, solution);
    
    const result: DailyChallengeResult = {
      date: today,
      userId,
      puzzleIndex,
      difficulty,
      solution,
    };
    
    console.log(`📤 [Daily Challenge - ${difficulty}] Submitting to Firebase:`, result);
    console.log(`🔍 [Daily Challenge - ${difficulty}] About to call addDoc with collection: 'dailyChallengeResults'`);
    
    try {
      const docRef = await addDoc(collection(db, 'dailyChallengeResults'), result);
      console.log(`✅ [Daily Challenge - ${difficulty}] Successfully submitted to Firebase! Doc ID:`, docRef.id);
      return true;
    } catch (submitError: any) {
      console.error(`❌ [Daily Challenge - ${difficulty}] AddDoc failed:`, submitError);
      console.error(`❌ [Daily Challenge - ${difficulty}] Error code:`, submitError?.code);
      console.error(`❌ [Daily Challenge - ${difficulty}] Error message:`, submitError?.message);
      throw submitError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error(`❌ [Daily Challenge - ${difficulty}] Error submitting:`, error);
    return false;
  }
}

/**
 * Calculates what percentage of users used the same solution
 */
export async function calculateSolutionUniqueness(
  difficulty: 'easy' | 'medium' | 'hard',
  userSolution: string
): Promise<number | null> {
  try {
    const today = getTodaysDate();
    
    const resultsRef = collection(db, 'dailyChallengeResults');
    const q = query(
      resultsRef,
      where('date', '==', today),
      where('difficulty', '==', difficulty)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    // Count how many users used the same solution
    let sameCount = 0;
    snapshot.forEach((doc) => {
      const data = doc.data() as DailyChallengeResult;
      if (data.solution === userSolution) {
        sameCount++;
      }
    });
    
    // Calculate percentage
    const percentage = Math.round((sameCount / snapshot.size) * 100);
    return percentage;
  } catch (error) {
    console.error('Error calculating solution uniqueness:', error);
    return null;
  }
}

/**
 * Calculates uniqueness for all three difficulties
 */
export async function calculateAllSolutionUniqueness(
  solutions: {
    easy: string;
    medium: string;
    hard: string;
  }
): Promise<{
  easy: number | null;
  medium: number | null;
  hard: number | null;
}> {
  try {
    const [easyPercent, mediumPercent, hardPercent] = await Promise.all([
      calculateSolutionUniqueness('easy', solutions.easy),
      calculateSolutionUniqueness('medium', solutions.medium),
      calculateSolutionUniqueness('hard', solutions.hard),
    ]);
    
    return {
      easy: easyPercent,
      medium: mediumPercent,
      hard: hardPercent,
    };
  } catch (error) {
    console.error('Error calculating all solution uniqueness:', error);
    return { easy: null, medium: null, hard: null };
  }
}

