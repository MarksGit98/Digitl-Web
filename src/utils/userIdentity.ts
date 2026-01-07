/**
 * Generates or retrieves a unique anonymous user ID
 * Stored in localStorage to persist across sessions
 */
export function getAnonymousUserId(): string {
  const STORAGE_KEY = 'digitl_user_id';
  
  // Try to get existing ID
  let userId = localStorage.getItem(STORAGE_KEY);
  
  // If no ID exists, generate a new one
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(STORAGE_KEY, userId);
    console.log('🆔 [User Identity] Generated new user ID:', userId);
  } else {
    console.log('🆔 [User Identity] Retrieved existing user ID:', userId);
  }
  
  return userId;
}

/**
 * Gets today's date in YYYY-MM-DD format
 */
export function getTodaysDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

