import type { Lesson, UserAnswer } from "@/types/lesson";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mmkvStorage } from "./storage";

export interface LessonState {
  // Progress
  currentExerciseIndex: number;
  hearts: number;
  xp: number;
  streak: number;
  answers: UserAnswer[];

  // Status
  isStarted: boolean;
  isComplete: boolean;
  showFeedback: boolean;
  lastAnswerCorrect: boolean | null;
  lastExplanation: string;

  // Lesson reference
  lessonId: string | null;
  totalExercises: number;
}

export interface LessonActions {
  startLesson: (lesson: Lesson) => void;
  submitAnswer: (
    exerciseId: string,
    answer: string | string[],
    correct: boolean,
    explanation: string,
    xpPerCorrect: number,
  ) => void;
  nextExercise: (totalExercises: number) => void;
  completeLesson: (streakIncrement: number) => void;
  resetLesson: () => void;
  hydrate: () => void;
}

export type LessonStore = LessonState & LessonActions;

const initialState: LessonState = {
  currentExerciseIndex: 0,
  hearts: 3,
  xp: 0,
  streak: 0,
  answers: [],
  isStarted: false,
  isComplete: false,
  showFeedback: false,
  lastAnswerCorrect: null,
  lastExplanation: "",
  lessonId: null,
  totalExercises: 0,
};

export const useLessonStore = create<LessonStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      startLesson: (lesson: Lesson) => {
        const state = get();
        // If resuming same lesson, keep state
        if (
          state.lessonId === lesson.id &&
          state.isStarted &&
          !state.isComplete
        ) {
          return;
        }
        // Start fresh
        set({
          ...initialState,
          isStarted: true,
          lessonId: lesson.id,
          totalExercises: lesson.exercises.length,
          streak: state.streak, // keep global streak
        });
      },

      submitAnswer: (
        exerciseId: string,
        answer: string | string[],
        correct: boolean,
        explanation: string,
        xpPerCorrect: number,
      ) => {
        const state = get();
        const newAnswer: UserAnswer = { exerciseId, answer, correct };
        const newHearts =
          correct ? state.hearts : Math.max(0, state.hearts - 1);
        const newXp = correct ? state.xp + xpPerCorrect : state.xp;

        set({
          answers: [...state.answers, newAnswer],
          hearts: newHearts,
          xp: newXp,
          showFeedback: true,
          lastAnswerCorrect: correct,
          lastExplanation: explanation,
        });
      },

      nextExercise: (totalExercises: number) => {
        const state = get();
        const nextIndex = state.currentExerciseIndex + 1;

        if (nextIndex >= totalExercises) {
          // Lesson complete
          set({
            isComplete: true,
            showFeedback: false,
            lastAnswerCorrect: null,
            lastExplanation: "",
          });
        } else {
          set({
            currentExerciseIndex: nextIndex,
            showFeedback: false,
            lastAnswerCorrect: null,
            lastExplanation: "",
          });
        }
      },

      completeLesson: (streakIncrement: number) => {
        const state = get();
        set({
          isComplete: true,
          streak: state.streak + streakIncrement,
        });
      },

      resetLesson: () => {
        const state = get();
        set({
          ...initialState,
          streak: state.streak, // keep global streak
        });
      },

      hydrate: () => {
        // Trigger rehydration — handled by persist middleware
      },
    }),
    {
      name: "lesson-progress",
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        currentExerciseIndex: state.currentExerciseIndex,
        hearts: state.hearts,
        xp: state.xp,
        streak: state.streak,
        answers: state.answers,
        isStarted: state.isStarted,
        isComplete: state.isComplete,
        lessonId: state.lessonId,
        totalExercises: state.totalExercises,
      }),
    },
  ),
);
