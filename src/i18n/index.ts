import type { Locale } from "@/types/lesson";
import { en, type TranslationKey } from "./en";
import { es } from "./es";

const translations: Record<Locale, Record<TranslationKey, string>> = {
  en,
  es,
};

export function t(key: TranslationKey, locale: Locale = "en"): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}

export function getExercisePrompt(
  exercise: { prompt_en: string; prompt_es?: string },
  locale: Locale,
): string {
  if (locale === "es" && exercise.prompt_es) {
    return exercise.prompt_es;
  }
  return exercise.prompt_en;
}

export function getExplanation(
  exercise: { explanation_en: string; explanation_es?: string },
  locale: Locale,
): string {
  if (locale === "es" && exercise.explanation_es) {
    return exercise.explanation_es;
  }
  return exercise.explanation_en;
}

export { en, es };
export type { TranslationKey };
