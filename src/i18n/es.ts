import type { TranslationKey } from "./en";

export const es: Record<TranslationKey, string> = {
  // Start Screen
  startLesson: "Comenzar lección",
  resumeLesson: "Reanudar lección",
  estimatedTime: "~3 min",
  lessonDescription: "Aprende saludos básicos en español",

  // Exercise Player
  check: "Hecho",
  continue: "Continuar",
  skip: "Saltar",
  typeYourAnswer: "Escribe tu respuesta...",
  tapTheWords: "Toca las palabras para construir la respuesta",
  matchThePairs: "Toca para emparejar",

  // Feedback
  correct: "¡Correcto!",
  incorrect: "Incorrecto",
  greatJob: "¡Buen trabajo!",
  explanation: "Explicación",

  // Completion
  lessonComplete: "¡Lección completada!",
  xpEarned: "XP ganados",
  streakCount: "Racha",
  restartLesson: "Reiniciar lección",
  congratulations: "¡Felicidades!",
  youDidIt: "¡Has completado la lección!",

  // Hearts
  hearts: "Corazones",
  noHeartsLeft: "¡No quedan corazones!",

  // Progress
  exercise: "Ejercicio",
  of: "de",

  // Error
  errorTitle: "Algo salió mal",
  errorMessage: "No se pudo cargar la lección. Inténtalo de nuevo.",
  retry: "Reintentar",

  // Settings
  language: "Idioma",
  english: "English",
  spanish: "Español",
} as const;
