export const en = {
  // Start Screen
  startLesson: "Start Lesson",
  resumeLesson: "Resume Lesson",
  estimatedTime: "~3 min",
  lessonDescription: "Learn basic greetings in Spanish",

  // Exercise Player
  check: "Done",
  continue: "Continue",
  skip: "Skip",
  typeYourAnswer: "Type your answer...",
  tapTheWords: "Tap the words to build the answer",
  matchThePairs: "Tap to match the pairs",

  // Feedback
  correct: "Correct!",
  incorrect: "Incorrect",
  greatJob: "Great job!",
  explanation: "Explanation",

  // Completion
  lessonComplete: "Lesson Complete!",
  xpEarned: "XP Earned",
  streakCount: "Streak",
  restartLesson: "Restart Lesson",
  congratulations: "Congratulations!",
  youDidIt: "You've completed the lesson!",

  // Hearts
  hearts: "Hearts",
  noHeartsLeft: "No hearts left!",

  // Progress
  exercise: "Exercise",
  of: "of",

  // Error
  errorTitle: "Something went wrong",
  errorMessage: "Could not load lesson data. Please try again.",
  retry: "Retry",

  // Settings
  language: "Language",
  english: "English",
  spanish: "Español",
} as const;

export type TranslationKey = keyof typeof en;
