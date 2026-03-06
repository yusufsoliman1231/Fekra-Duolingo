import { Colors } from '@/constants/Colors';
import { rw, Sizes } from '@/constants/Responsive';
import type { Exercise } from '@/types/lesson';
import React, { useCallback, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface WordBankProps {
    exercise: Exercise;
    onAnswer: (answer: string[], correct: boolean) => void;
    disabled: boolean;
    prompt: string;
    tapHint: string;
}

export function WordBank({
    exercise,
    onAnswer,
    disabled,
    prompt,
    tapHint,
}: WordBankProps) {
    const bank = exercise.bank ?? [];
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState<string[]>(bank);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const chipAnims = React.useRef(
        bank.map(() => new Animated.Value(1))
    ).current;

    const handleSelectWord = useCallback(
        (word: string, bankIndex: number) => {
            if (disabled || hasSubmitted) return;

            // Animate chip
            Animated.sequence([
                Animated.timing(chipAnims[bankIndex], {
                    toValue: 0.9,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.spring(chipAnims[bankIndex], {
                    toValue: 1,
                    tension: 200,
                    friction: 10,
                    useNativeDriver: true,
                }),
            ]).start();

            const newSelected = [...selectedWords, word];
            const newAvailable = [...availableWords];
            const wordIndex = newAvailable.indexOf(word);
            if (wordIndex > -1) {
                newAvailable.splice(wordIndex, 1);
            }

            setSelectedWords(newSelected);
            setAvailableWords(newAvailable);

            // Check answer
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
        [
            disabled,
            hasSubmitted,
            selectedWords,
            availableWords,
            exercise.answer,
            onAnswer,
            chipAnims,
        ]
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
                            <TouchableOpacity
                                key={`selected-${word}-${index}`}
                                onPress={() => handleRemoveWord(word, index)}
                                disabled={disabled || hasSubmitted}
                                accessibilityRole="button"
                                accessibilityLabel={`Remove word: ${word}`}
                                style={[
                                    styles.selectedChip,
                                    hasSubmitted && styles.selectedChipDisabled,
                                ]}
                            >
                                <Text style={styles.selectedChipText}>{word}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>

            {/* Word Bank */}
            <View style={styles.bankContainer}>
                {bank.map((word, index) => {
                    const isAvailable = availableWords.includes(word);

                    return (
                        <Animated.View
                            key={`bank-${word}-${index}`}
                            style={{ transform: [{ scale: chipAnims[index] }] }}
                        >
                            <TouchableOpacity
                                onPress={() => handleSelectWord(word, index)}
                                disabled={disabled || hasSubmitted || !isAvailable}
                                accessibilityRole="button"
                                accessibilityLabel={`Word: ${word}`}
                                accessibilityState={{ disabled: !isAvailable }}
                                style={[
                                    styles.bankChip,
                                    !isAvailable && styles.bankChipUsed,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bankChipText,
                                        !isAvailable && styles.bankChipTextUsed,
                                    ]}
                                >
                                    {word}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
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
        marginBottom: Sizes.lg,
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
    selectedChipDisabled: {
        opacity: 0.7,
    },
    selectedChipText: {
        fontSize: Sizes.fontMd,
        fontWeight: '600',
        color: Colors.secondaryDark,
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
