/**
 * Analytics Stub - Local Logging Only
 *
 * A simple analytics module for development/debugging purposes.
 * All events are logged locally to the console.
 *
 * In production, these methods would be connected to a real analytics service
 * like Firebase Analytics, Amplitude, or Mixpanel.
 */

type EventName =
  | "lesson_started"
  | "lesson_completed"
  | "exercise_answered"
  | "exercise_skipped"
  | "heart_lost"
  | "xp_earned"
  | "streak_updated"
  | "app_opened"
  | "screen_viewed";

interface AnalyticsEvent {
  name: EventName;
  params?: Record<string, string | number | boolean>;
  timestamp: number;
}

// In-memory event log for debugging
const eventLog: AnalyticsEvent[] = [];

// Configuration
let isEnabled = __DEV__; // Only enabled in development by default
let logToConsole = true;

/**
 * Track an analytics event
 */
export function trackEvent(
  name: EventName,
  params?: Record<string, string | number | boolean>,
): void {
  if (!isEnabled) return;

  const event: AnalyticsEvent = {
    name,
    params,
    timestamp: Date.now(),
  };

  eventLog.push(event);

  // Keep only last 100 events in memory
  if (eventLog.length > 100) {
    eventLog.shift();
  }

  if (logToConsole) {
    console.log(`[Analytics] ${name}`, params ? JSON.stringify(params) : "");
  }
}

/**
 * Track when a lesson starts
 */
export function trackLessonStarted(
  lessonId: string,
  totalExercises: number,
): void {
  trackEvent("lesson_started", { lessonId, totalExercises });
}

/**
 * Track when a lesson is completed
 */
export function trackLessonCompleted(
  lessonId: string,
  xpEarned: number,
  correctAnswers: number,
  totalExercises: number,
  heartsRemaining: number,
): void {
  trackEvent("lesson_completed", {
    lessonId,
    xpEarned,
    correctAnswers,
    totalExercises,
    heartsRemaining,
    accuracy: Math.round((correctAnswers / totalExercises) * 100),
  });
}

/**
 * Track when an exercise is answered
 */
export function trackExerciseAnswered(
  exerciseId: string,
  exerciseType: string,
  correct: boolean,
  attemptNumber: number,
): void {
  trackEvent("exercise_answered", {
    exerciseId,
    exerciseType,
    correct,
    attemptNumber,
  });
}

/**
 * Track when a heart is lost
 */
export function trackHeartLost(remainingHearts: number): void {
  trackEvent("heart_lost", { remainingHearts });
}

/**
 * Track XP earned
 */
export function trackXpEarned(amount: number, source: string): void {
  trackEvent("xp_earned", { amount, source });
}

/**
 * Track streak updates
 */
export function trackStreakUpdated(newStreak: number): void {
  trackEvent("streak_updated", { newStreak });
}

/**
 * Track screen views
 */
export function trackScreenView(screenName: string): void {
  trackEvent("screen_viewed", { screenName });
}

/**
 * Get all logged events (for debugging)
 */
export function getEventLog(): AnalyticsEvent[] {
  return [...eventLog];
}

/**
 * Clear the event log
 */
export function clearEventLog(): void {
  eventLog.length = 0;
}

/**
 * Enable or disable analytics
 */
export function setAnalyticsEnabled(enabled: boolean): void {
  isEnabled = enabled;
}

/**
 * Enable or disable console logging
 */
export function setConsoleLogging(enabled: boolean): void {
  logToConsole = enabled;
}

/**
 * Check if analytics is enabled
 */
export function isAnalyticsEnabled(): boolean {
  return isEnabled;
}
