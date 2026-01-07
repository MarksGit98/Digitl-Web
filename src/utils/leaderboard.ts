import { collection, addDoc, query, where, getDocs, limit, getCountFromServer } from 'firebase/firestore';
import { db } from './firebase';
import { getAnonymousUserId, getTodaysDate } from './userIdentity';

// Maximum submissions per day to stay within Firebase free tier
// Free tier: 20,000 writes/day. We cap at 15,000 to leave buffer for other operations
const MAX_DAILY_SUBMISSIONS = 15000;

export interface DailyTimedResult {
  date: string;
  userId: string;
  puzzleIndex: number;
  easyTime: number;
  mediumTime: number;
  hardTime: number;
  totalTime: number;
  completedAt: Date;
}

/**
 * Checks if the user has already submitted a result for today
 */
export async function hasSubmittedToday(): Promise<boolean> {
  try {
    const userId = getAnonymousUserId();
    const today = getTodaysDate();
    
    const resultsRef = collection(db, 'dailyTimedResults');
    const q = query(
      resultsRef,
      where('date', '==', today),
      where('userId', '==', userId),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking if user has submitted:', error);
    return false; // Fail gracefully, allow submission on error
  }
}

/**
 * Checks if we've reached the daily submission limit
 */
async function hasReachedDailyLimit(): Promise<boolean> {
  try {
    const today = getTodaysDate();
    const resultsRef = collection(db, 'dailyTimedResults');
    const q = query(resultsRef, where('date', '==', today));
    
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    
    if (count >= MAX_DAILY_SUBMISSIONS) {
      console.warn(`Daily submission limit reached: ${count}/${MAX_DAILY_SUBMISSIONS}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking daily limit:', error);
    // Fail open - if we can't check the limit, allow submission
    return false;
  }
}

/**
 * Submits a daily timed result to Firebase
 * Only submits if:
 * 1. User hasn't already submitted today
 * 2. Daily submission limit hasn't been reached (stays within free tier)
 */
export async function submitDailyTimedResult(
  puzzleIndex: number,
  roundTimes: [number, number, number]
): Promise<boolean> {
  try {
    // Check if user already submitted today
    const alreadySubmitted = await hasSubmittedToday();
    if (alreadySubmitted) {
      console.log('User has already submitted a result for today. Skipping submission.');
      return false;
    }
    
    // Check if we've reached the daily limit (free tier protection)
    const limitReached = await hasReachedDailyLimit();
    if (limitReached) {
      console.warn('Daily submission limit reached. Result not submitted to preserve free tier.');
      // Still return false, but user can still see percentile based on existing data
      return false;
    }
    
    const userId = getAnonymousUserId();
    const today = getTodaysDate();
    const totalTime = roundTimes[0] + roundTimes[1] + roundTimes[2];
    
    const result: DailyTimedResult = {
      date: today,
      userId,
      puzzleIndex,
      easyTime: roundTimes[0],
      mediumTime: roundTimes[1],
      hardTime: roundTimes[2],
      totalTime,
      completedAt: new Date(),
    };
    
    await addDoc(collection(db, 'dailyTimedResults'), result);
    console.log('Successfully submitted daily timed result');
    return true;
  } catch (error) {
    console.error('Error submitting daily timed result:', error);
    return false;
  }
}

/**
 * Calculates the user's percentile ranking for today
 * Returns the percentage of players they were faster than
 */
export async function calculatePercentile(userTotalTime: number): Promise<number | null> {
  try {
    const today = getTodaysDate();
    
    const resultsRef = collection(db, 'dailyTimedResults');
    const q = query(
      resultsRef,
      where('date', '==', today)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty || snapshot.size === 1) {
      // If no other players or only the current player, return null
      return null;
    }
    
    // Count how many players had a slower time
    let slowerCount = 0;
    snapshot.forEach((doc) => {
      const data = doc.data() as DailyTimedResult;
      if (data.totalTime > userTotalTime) {
        slowerCount++;
      }
    });
    
    // Calculate percentile
    const percentile = Math.round((slowerCount / snapshot.size) * 100);
    return percentile;
  } catch (error) {
    console.error('Error calculating percentile:', error);
    return null;
  }
}

/**
 * Gets the total number of players who completed today's challenge
 */
export async function getTodayPlayerCount(): Promise<number> {
  try {
    const today = getTodaysDate();
    
    const resultsRef = collection(db, 'dailyTimedResults');
    const q = query(
      resultsRef,
      where('date', '==', today)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting player count:', error);
    return 0;
  }
}

