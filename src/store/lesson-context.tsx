import { getExercisePrompt, getExplanation, t } from '@/i18n';
import type { Lesson, Locale } from '@/types/lesson';
import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

interface LessonDataContextValue {
    lesson: Lesson | null;
    loading: boolean;
    error: string | null;
    locale: Locale;
    setLocale: (locale: Locale) => void;
    loadLesson: () => void;
    translate: (key: Parameters<typeof t>[0]) => string;
    getPrompt: (exercise: { prompt_en: string; prompt_es?: string }) => string;
    getExplanationText: (exercise: {
        explanation_en: string;
        explanation_es?: string;
    }) => string;
}

const LessonDataContext = createContext<LessonDataContextValue | null>(null);

interface LessonDataProviderProps {
    children: ReactNode;
}

export function LessonDataProvider({ children }: LessonDataProviderProps) {
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [locale, setLocale] = useState<Locale>('en');

    const loadLesson = useCallback(() => {
        setLoading(true);
        setError(null);

        try {
            // Load static JSON bundled with the app
            const data = require('@/assets/data/lesson.json');

            // Validate lesson data
            if (
                !data ||
                !data.id ||
                !data.exercises ||
                !Array.isArray(data.exercises) ||
                data.exercises.length === 0
            ) {
                throw new Error('Invalid lesson data format');
            }

            setLesson(data as Lesson);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'Could not load lesson data. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const translate = useCallback(
        (key: Parameters<typeof t>[0]) => t(key, locale),
        [locale]
    );

    const getPrompt = useCallback(
        (exercise: { prompt_en: string; prompt_es?: string }) =>
            getExercisePrompt(exercise, locale),
        [locale]
    );

    const getExplanationText = useCallback(
        (exercise: { explanation_en: string; explanation_es?: string }) =>
            getExplanation(exercise, locale),
        [locale]
    );

    const value = useMemo(
        () => ({
            lesson,
            loading,
            error,
            locale,
            setLocale,
            loadLesson,
            translate,
            getPrompt,
            getExplanationText,
        }),
        [lesson, loading, error, locale, loadLesson, translate, getPrompt, getExplanationText]
    );

    return (
        <LessonDataContext.Provider value={value}>
            {children}
        </LessonDataContext.Provider>
    );
}

export function useLessonData(): LessonDataContextValue {
    const context = useContext(LessonDataContext);
    if (!context) {
        throw new Error('useLessonData must be used within a LessonDataProvider');
    }
    return context;
}
