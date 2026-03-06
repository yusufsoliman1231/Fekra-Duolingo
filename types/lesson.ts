export type ExerciseType =
  | "multiple_choice"
  | "type_answer"
  | "word_bank"
  | "match_pairs";

export interface Tolerance {
  caseInsensitive?: boolean;
  trim?: boolean;
}

export interface MatchPair {
  left: string;
  right: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt_en: string;
  prompt_es?: string;
  choices?: string[];
  answer: string | string[];
  bank?: string[];
  pairs?: MatchPair[];
  tolerance?: Tolerance;
  explanation_en: string;
  explanation_es?: string;
}

export interface Lesson {
  id: string;
  title: string;
  title_es?: string;
  xp_per_correct: number;
  streak_increment: number;
  exercises: Exercise[];
}

export interface UserAnswer {
  exerciseId: string;
  answer: string | string[];
  correct: boolean;
}

export type Locale = "en" | "es";

export type LessonStatus = "idle" | "in_progress" | "completed";
