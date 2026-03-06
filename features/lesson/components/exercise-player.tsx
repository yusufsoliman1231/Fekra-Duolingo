import { Button } from '@/components/ui/button';
import { FeedbackBanner } from '@/components/ui/feedback-banner';
import { Header } from '@/components/ui/lesson-header';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Responsive';
import { useLessonData } from '@/store/lesson-context';
import { useLessonStore } from '@/store/lesson-store';
import * as Analytics from '@/utils/analytics';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import { CompletionScreen } from './completion-screen';
import { DraggableWordBank } from './draggable-word-bank';
import { MatchPairs } from './match-pairs';
import { MultipleChoice } from './multiple-choice';
import { StreakHearts } from './streak-hearts';
import { TypeAnswer } from './type-answer';

export function ExercisePlayer() {
    const router = useRouter();
    const { lesson, translate, getPrompt, getExplanationText } = useLessonData();

    const {
        currentExerciseIndex,
        hearts,
        xp,
        streak,
        isComplete,
        showFeedback,
        lastAnswerCorrect,
        lastExplanation,
        totalExercises,
        answers,
        submitAnswer,
        nextExercise,
        completeLesson,
        resetLesson,
    } = useLessonStore();

    const [userAnswer, setUserAnswer] = useState<{
        answer: string | string[];
        correct: boolean;
    } | null>(null);

    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const exercises = lesson?.exercises ?? [];
    const currentExercise = exercises[currentExerciseIndex];
    const xpPerCorrect = lesson?.xp_per_correct ?? 10;
    const streakIncrement = lesson?.streak_increment ?? 1;

    // Animate exercise transition
    const animateTransition = useCallback(() => {
        slideAnim.setValue(50);
        fadeAnim.setValue(0);
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, [slideAnim, fadeAnim]);

    useEffect(() => {
        animateTransition();
    }, [currentExerciseIndex, animateTransition]);

    const handleAnswer = useCallback(
        (answer: string | string[], correct: boolean) => {
            if (!currentExercise) return;

            // TypeAnswer sends empty string when input is cleared — clear the pending answer
            if (answer === '') {
                setUserAnswer(null);
                return;
            }

            setUserAnswer({ answer, correct });

            // For match_pairs and word_bank, auto-submit on completion
            if (
                currentExercise.type === 'match_pairs' ||
                currentExercise.type === 'word_bank'
            ) {
                const explanation = getExplanationText(currentExercise);
                submitAnswer(currentExercise.id, answer, correct, explanation, xpPerCorrect);

                // Track analytics
                Analytics.trackExerciseAnswered(
                    currentExercise.id,
                    currentExercise.type,
                    correct,
                    1
                );
                if (!correct) {
                    Analytics.trackHeartLost(hearts - 1);
                }
            }
        },
        [currentExercise, submitAnswer, getExplanationText, xpPerCorrect, hearts]
    );

    const handleCheck = useCallback(() => {
        if (!currentExercise || !userAnswer) return;
        const explanation = getExplanationText(currentExercise);
        submitAnswer(
            currentExercise.id,
            userAnswer.answer,
            userAnswer.correct,
            explanation,
            xpPerCorrect
        );

        // Track analytics
        Analytics.trackExerciseAnswered(
            currentExercise.id,
            currentExercise.type,
            userAnswer.correct,
            1
        );
        if (!userAnswer.correct) {
            Analytics.trackHeartLost(hearts - 1);
        }
    }, [currentExercise, userAnswer, submitAnswer, getExplanationText, xpPerCorrect, hearts]);

    const handleNext = useCallback(() => {
        setUserAnswer(null);
        if (currentExerciseIndex >= totalExercises - 1) {
            completeLesson(streakIncrement);
        } else {
            nextExercise(totalExercises);
        }
    }, [currentExerciseIndex, totalExercises, completeLesson, nextExercise, streakIncrement]);

    const handleClose = useCallback(() => {
        router.back();
    }, [router]);

    const handleRestart = useCallback(() => {
        setUserAnswer(null);
        resetLesson();
    }, [resetLesson]);

    const handleGoHome = useCallback(() => {
        resetLesson();
        router.back();
    }, [resetLesson, router]);

    // Show completion screen
    if (isComplete) {
        const correctAnswers = answers.filter(
            (a) => a.correct
        ).length;

        // Track lesson completion
        Analytics.trackLessonCompleted(
            lesson?.id ?? '',
            xp,
            correctAnswers,
            totalExercises,
            hearts
        );

        return (
            <CompletionScreen
                xp={xp}
                streak={streak}
                hearts={hearts}
                totalExercises={totalExercises}
                correctAnswers={correctAnswers}
                onRestart={handleRestart}
                onGoHome={handleGoHome}
                translate={translate}
            />
        );
    }

    if (!currentExercise) return null;

    const prompt = getPrompt(currentExercise);
    const needsManualSubmit =
        currentExercise.type === 'multiple_choice' ||
        currentExercise.type === 'type_answer';
    const showCheckButton = needsManualSubmit && userAnswer && !showFeedback;
    const showNextButton = showFeedback;

    return (
        <View style={styles.container}>
            {/* Header */}
            <Header>
                <Header.Left>
                    <Header.Close onPress={handleClose} />
                </Header.Left>
                <Header.Center>
                    <ProgressBar
                        current={currentExerciseIndex}
                        total={totalExercises}
                    />
                </Header.Center>
                <Header.Right>
                    <StreakHearts hearts={hearts} streak={streak} />
                </Header.Right>
            </Header>

            {/* Exercise Content */}
            <KeyboardAvoidingView
                style={styles.exerciseContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <Animated.View
                        style={[
                            styles.exerciseContent,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        {currentExercise.type === 'multiple_choice' && (
                            <MultipleChoice
                                exercise={currentExercise}
                                onAnswer={handleAnswer}
                                disabled={showFeedback}
                                prompt={prompt}
                            />
                        )}
                        {currentExercise.type === 'type_answer' && (
                            <TypeAnswer
                                key={currentExercise.id}
                                exercise={currentExercise}
                                onAnswer={handleAnswer}
                                onSubmit={handleCheck}
                                disabled={showFeedback}
                                prompt={prompt}
                                placeholder={translate('typeYourAnswer')}
                            />
                        )}
                        {currentExercise.type === 'word_bank' && (
                            <DraggableWordBank
                                exercise={currentExercise}
                                onAnswer={handleAnswer}
                                disabled={showFeedback}
                                prompt={prompt}
                                tapHint={translate('tapTheWords')}
                            />
                        )}
                        {currentExercise.type === 'match_pairs' && (
                            <MatchPairs
                                exercise={currentExercise}
                                onAnswer={handleAnswer}
                                disabled={showFeedback}
                                prompt={prompt}
                                tapHint={translate('matchThePairs')}
                            />
                        )}
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Bottom Actions */}
            <View style={styles.bottomContainer}>
                {showCheckButton && (
                    <Button
                        onPress={handleCheck}
                        variant="primary"
                        style={styles.actionButton}
                        accessibilityLabel={translate('check')}
                    >
                        <Button.Text>{translate('check')}</Button.Text>
                    </Button>
                )}

                {showNextButton && (
                    <Button
                        onPress={handleNext}
                        variant={lastAnswerCorrect ? 'primary' : 'secondary'}
                        style={styles.actionButton}
                        accessibilityLabel={
                            currentExerciseIndex >= totalExercises - 1
                                ? translate('lessonComplete')
                                : translate('continue')
                        }
                    >
                        <Button.Text>
                            {currentExerciseIndex >= totalExercises - 1
                                ? translate('lessonComplete')
                                : translate('continue')}
                        </Button.Text>
                    </Button>
                )}
            </View>

            {/* Feedback Banner */}
            {showFeedback && (
                <FeedbackBanner
                    correct={lastAnswerCorrect ?? false}
                    explanation={lastExplanation ?? ''}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    exerciseContainer: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: Sizes.screenPadding,
        paddingTop: Sizes.md,
    },
    exerciseContent: {
        flex: 1,
    },
    bottomContainer: {
        paddingHorizontal: Sizes.screenPadding,
        paddingBottom: Sizes.lg,
        paddingTop: Sizes.sm,
    },
    actionButton: {
        width: '100%',
    },
});
