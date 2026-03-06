import { Colors } from '@/constants/Colors';
import { rw, Sizes } from '@/constants/Responsive';
import type { Exercise } from '@/types/lesson';
import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

interface DraggableWordBankProps {
    exercise: Exercise;
    onAnswer: (answer: string[], correct: boolean) => void;
    disabled: boolean;
    prompt: string;
    tapHint: string;
}

interface DraggableChipProps {
    word: string;
    index: number;
    onTap: (word: string, index: number) => void;
    disabled: boolean;
}

function DraggableChip({ word, index, onTap, disabled }: DraggableChipProps) {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const tap = Gesture.Tap()
        .enabled(!disabled)
        .onBegin(() => {
            scale.value = withSpring(0.9, { damping: 15 });
        })
        .onFinalize((_, success) => {
            scale.value = withSpring(1, { damping: 15 });
            if (success) {
                runOnJS(onTap)(word, index);
            }
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    return (
        <GestureDetector gesture={tap}>
            <Animated.View style={[styles.bankChip, animatedStyle]}>
                <Text style={styles.bankChipText}>{word}</Text>
            </Animated.View>
        </GestureDetector>
    );
}

interface SelectedChipProps {
    word: string;
    index: number;
    totalCount: number;
    onTap: (word: string, index: number) => void;
    onReorder: (fromIndex: number, toIndex: number) => void;
    disabled: boolean;
}

function SelectedChip({
    word,
    index,
    totalCount,
    onTap,
    onReorder,
    disabled,
}: SelectedChipProps) {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const zIndex = useSharedValue(0);
    const isActive = useSharedValue(false);

    const tap = Gesture.Tap()
        .enabled(!disabled)
        .onEnd(() => {
            runOnJS(onTap)(word, index);
        });

    const longPress = Gesture.LongPress()
        .enabled(!disabled)
        .minDuration(200)
        .onStart(() => {
            isActive.value = true;
            scale.value = withSpring(1.1, { damping: 15 });
            zIndex.value = 100;
        });

    const pan = Gesture.Pan()
        .enabled(!disabled)
        .activateAfterLongPress(200)
        .onUpdate((e) => {
            translateX.value = e.translationX;
            translateY.value = e.translationY;
        })
        .onEnd((e) => {
            // Calculate which position to swap to based on X movement
            const chipWidth = 80; // approximate chip width
            const movement = Math.round(e.translationX / chipWidth);
            const newIndex = Math.max(0, Math.min(totalCount - 1, index + movement));

            if (newIndex !== index) {
                runOnJS(onReorder)(index, newIndex);
            }

            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            scale.value = withSpring(1);
            zIndex.value = 0;
            isActive.value = false;
        });

    const composed = Gesture.Race(tap, Gesture.Simultaneous(longPress, pan));

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
        zIndex: zIndex.value,
        elevation: zIndex.value,
    }));

    return (
        <GestureDetector gesture={composed}>
            <Animated.View style={[styles.selectedChip, animatedStyle]}>
                <Text style={styles.selectedChipText}>{word}</Text>
            </Animated.View>
        </GestureDetector>
    );
}

export function DraggableWordBank({
    exercise,
    onAnswer,
    disabled,
    prompt,
    tapHint,
}: DraggableWordBankProps) {
    const bank = exercise.bank ?? [];
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState<string[]>(bank);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const handleSelectWord = useCallback(
        (word: string, _bankIndex: number) => {
            if (disabled || hasSubmitted) return;

            const newSelected = [...selectedWords, word];
            const newAvailable = [...availableWords];
            const wordIndex = newAvailable.indexOf(word);
            if (wordIndex > -1) {
                newAvailable.splice(wordIndex, 1);
            }

            setSelectedWords(newSelected);
            setAvailableWords(newAvailable);

            // Check answer when all words selected
            const answer = Array.isArray(exercise.answer)
                ? exercise.answer
                : [exercise.answer];

            if (newSelected.length === answer.length) {
                setHasSubmitted(true);
                const isCorrect =
                    JSON.stringify(newSelected) === JSON.stringify(answer);
                onAnswer(newSelected, isCorrect);
            }
        },
        [disabled, hasSubmitted, selectedWords, availableWords, exercise.answer, onAnswer]
    );

    const handleRemoveWord = useCallback(
        (word: string, index: number) => {
            if (disabled || hasSubmitted) return;

            const newSelected = [...selectedWords];
            newSelected.splice(index, 1);
            setSelectedWords(newSelected);
            setAvailableWords([...availableWords, word]);
        },
        [disabled, hasSubmitted, selectedWords, availableWords]
    );

    const handleReorder = useCallback(
        (fromIndex: number, toIndex: number) => {
            if (disabled || hasSubmitted) return;

            const newSelected = [...selectedWords];
            const [moved] = newSelected.splice(fromIndex, 1);
            newSelected.splice(toIndex, 0, moved);
            setSelectedWords(newSelected);

            // Check answer after reorder
            const answer = Array.isArray(exercise.answer)
                ? exercise.answer
                : [exercise.answer];

            if (newSelected.length === answer.length) {
                setHasSubmitted(true);
                const isCorrect =
                    JSON.stringify(newSelected) === JSON.stringify(answer);
                onAnswer(newSelected, isCorrect);
            }
        },
        [disabled, hasSubmitted, selectedWords, exercise.answer, onAnswer]
    );

    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>{prompt}</Text>

            {/* Answer Area */}
            <View style={styles.answerArea}>
                {selectedWords.length === 0 ? (
                    <Text style={styles.placeholderText}>{tapHint}</Text>
                ) : (
                    <View style={styles.selectedContainer}>
                        {selectedWords.map((word, index) => (
                            <SelectedChip
                                key={`selected-${word}-${index}`}
                                word={word}
                                index={index}
                                totalCount={selectedWords.length}
                                onTap={handleRemoveWord}
                                onReorder={handleReorder}
                                disabled={disabled || hasSubmitted}
                            />
                        ))}
                    </View>
                )}
            </View>

            {/* Reorder hint */}
            {selectedWords.length > 1 && !hasSubmitted && (
                <Text style={styles.reorderHint}>Long press and drag to reorder</Text>
            )}

            {/* Word Bank */}
            <View style={styles.bankContainer}>
                {bank.map((word, index) => {
                    const isAvailable = availableWords.includes(word);

                    if (!isAvailable) {
                        return (
                            <View
                                key={`bank-${word}-${index}`}
                                style={[styles.bankChip, styles.bankChipUsed]}
                            >
                                <Text style={[styles.bankChipText, styles.bankChipTextUsed]}>
                                    {word}
                                </Text>
                            </View>
                        );
                    }

                    return (
                        <DraggableChip
                            key={`bank-${word}-${index}`}
                            word={word}
                            index={index}
                            onTap={handleSelectWord}
                            disabled={disabled || hasSubmitted}
                        />
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    prompt: {
        fontSize: Sizes.fontXl,
        fontWeight: '700',
        color: Colors.darkText,
        marginBottom: Sizes.lg,
        lineHeight: Sizes.fontXl * 1.3,
    },
    answerArea: {
        minHeight: rw(60),
        borderWidth: 2,
        borderColor: Colors.borderLight,
        borderRadius: Sizes.radiusMd,
        borderBottomWidth: 4,
        padding: Sizes.sm,
        marginBottom: Sizes.md,
        backgroundColor: Colors.white,
        justifyContent: 'center',
    },
    placeholderText: {
        fontSize: Sizes.fontSm,
        color: Colors.lightText,
        textAlign: 'center',
    },
    selectedContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Sizes.sm,
    },
    selectedChip: {
        paddingVertical: Sizes.sm,
        paddingHorizontal: Sizes.md,
        backgroundColor: Colors.chipBgActive,
        borderRadius: Sizes.radiusSm,
        borderWidth: 2,
        borderColor: Colors.chipBorderActive,
        borderBottomWidth: 3,
    },
    selectedChipText: {
        fontSize: Sizes.fontMd,
        fontWeight: '600',
        color: Colors.secondaryDark,
    },
    reorderHint: {
        fontSize: Sizes.fontXs,
        color: Colors.lightText,
        textAlign: 'center',
        marginBottom: Sizes.md,
    },
    bankContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Sizes.sm,
        justifyContent: 'center',
    },
    bankChip: {
        paddingVertical: Sizes.sm,
        paddingHorizontal: Sizes.md,
        backgroundColor: Colors.white,
        borderRadius: Sizes.radiusSm,
        borderWidth: 2,
        borderColor: Colors.chipBorder,
        borderBottomWidth: 3,
    },
    bankChipUsed: {
        backgroundColor: Colors.surfaceLight,
        borderColor: Colors.surfaceLight,
        borderBottomColor: Colors.surfaceLight,
    },
    bankChipText: {
        fontSize: Sizes.fontMd,
        fontWeight: '600',
        color: Colors.darkText,
    },
    bankChipTextUsed: {
        color: 'transparent',
    },
});
