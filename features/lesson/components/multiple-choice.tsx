import { Colors } from '@/constants/Colors';
import { rw, Sizes } from '@/constants/Responsive';
import type { Exercise } from '@/types/lesson';
import React, { useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface MultipleChoiceProps {
    exercise: Exercise;
    onAnswer: (answer: string, correct: boolean) => void;
    disabled: boolean;
    prompt: string;
}

export function MultipleChoice({
    exercise,
    onAnswer,
    disabled,
    prompt,
}: MultipleChoiceProps) {
    const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
    const scaleAnims = React.useRef(
        (exercise.choices ?? []).map(() => new Animated.Value(1))
    ).current;

    const handleSelect = (choice: string, index: number) => {
        if (disabled) return;

        // Bounce animation
        Animated.sequence([
            Animated.timing(scaleAnims[index], {
                toValue: 0.95,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnims[index], {
                toValue: 1,
                tension: 200,
                friction: 10,
                useNativeDriver: true,
            }),
        ]).start();

        setSelectedChoice(choice);
        const isCorrect = choice === exercise.answer;
        onAnswer(choice, isCorrect);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>{prompt}</Text>

            <View style={styles.choicesContainer}>
                {(exercise.choices ?? []).map((choice, index) => {
                    const isSelected = selectedChoice === choice;

                    return (
                        <Animated.View
                            key={choice}
                            style={{ transform: [{ scale: scaleAnims[index] }] }}
                        >
                            <TouchableOpacity
                                onPress={() => handleSelect(choice, index)}
                                disabled={disabled}
                                accessibilityRole="button"
                                accessibilityLabel={`Choice: ${choice}`}
                                accessibilityState={{ selected: isSelected }}
                                style={[
                                    styles.choiceButton,
                                    isSelected && styles.choiceSelected,
                                    disabled && isSelected && choice === exercise.answer && styles.choiceCorrect,
                                    disabled && isSelected && choice !== exercise.answer && styles.choiceIncorrect,
                                ]}
                            >
                                <View style={styles.choiceNumberContainer}>
                                    <Text
                                        style={[
                                            styles.choiceNumber,
                                            isSelected && styles.choiceNumberSelected,
                                        ]}
                                    >
                                        {index + 1}
                                    </Text>
                                </View>
                                <Text
                                    style={[
                                        styles.choiceText,
                                        isSelected && styles.choiceTextSelected,
                                    ]}
                                >
                                    {choice}
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
    choicesContainer: {
        gap: Sizes.sm,
    },
    choiceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Sizes.md,
        borderRadius: Sizes.radiusMd,
        borderWidth: 2,
        borderColor: Colors.borderLight,
        borderBottomWidth: 4,
        backgroundColor: Colors.white,
        gap: Sizes.md,
    },
    choiceSelected: {
        borderColor: Colors.secondary,
        backgroundColor: Colors.chipBgActive,
    },
    choiceCorrect: {
        borderColor: Colors.correct,
        backgroundColor: Colors.correctLight,
    },
    choiceIncorrect: {
        borderColor: Colors.incorrect,
        backgroundColor: Colors.incorrectLight,
    },
    choiceNumberContainer: {
        width: rw(28),
        height: rw(28),
        borderRadius: rw(14),
        borderWidth: 2,
        borderColor: Colors.borderLight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    choiceNumber: {
        fontSize: Sizes.fontSm,
        fontWeight: '600',
        color: Colors.mediumText,
    },
    choiceNumberSelected: {
        color: Colors.secondary,
    },
    choiceText: {
        fontSize: Sizes.fontMd,
        fontWeight: '600',
        color: Colors.darkText,
        flex: 1,
    },
    choiceTextSelected: {
        color: Colors.secondaryDark,
    },
});
