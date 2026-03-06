import { Colors } from '@/constants/Colors';
import { rh, Sizes } from '@/constants/Responsive';
import type { Exercise } from '@/types/lesson';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

interface TypeAnswerProps {
    exercise: Exercise;
    onAnswer: (answer: string, correct: boolean) => void;
    onSubmit?: () => void;
    disabled: boolean;
    prompt: string;
    placeholder: string;
}

function normalizeAnswer(text: string, tolerance?: Exercise['tolerance']): string {
    let normalized = text;
    if (tolerance?.trim) {
        normalized = normalized.trim();
    }
    if (tolerance?.caseInsensitive) {
        normalized = normalized.toLowerCase();
    }
    // Basic accent normalization
    normalized = normalized
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
    return normalized;
}

export function TypeAnswer({
    exercise,
    onAnswer,
    onSubmit,
    disabled,
    prompt,
    placeholder,
}: TypeAnswerProps) {
    const [text, setText] = useState('');

    const computeAnswer = (value: string) => {
        const normalizedInput = normalizeAnswer(value, exercise.tolerance);
        const acceptedAnswers = Array.isArray(exercise.answer)
            ? exercise.answer
            : [exercise.answer];
        const isCorrect = acceptedAnswers.some(
            (ans) => normalizeAnswer(ans, exercise.tolerance) === normalizedInput
        );
        return isCorrect;
    };

    const handleTextChange = (value: string) => {
        setText(value);
        // Report live so the Done button in the parent can appear/disappear
        onAnswer(value, computeAnswer(value));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>{prompt}</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[
                        styles.input,
                        disabled && styles.inputDisabled,
                    ]}
                    value={text}
                    onChangeText={handleTextChange}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.lightText}
                    editable={!disabled}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={() => onSubmit?.()}
                    accessibilityLabel="Type your answer"
                    accessibilityHint="Type your translation and press Done to submit"
                />
            </View>
        </View>
    );
}

// Export the normalizeAnswer for testing
export { normalizeAnswer };

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
    inputContainer: {
        borderWidth: 2,
        borderColor: Colors.borderLight,
        borderRadius: Sizes.radiusMd,
        borderBottomWidth: 4,
        backgroundColor: Colors.white,
        overflow: 'hidden',
    },
    input: {
        fontSize: Sizes.fontLg,
        color: Colors.darkText,
        padding: Sizes.md,
        minHeight: rh(120),
        textAlignVertical: 'top',
    },
    inputDisabled: {
        backgroundColor: Colors.surfaceLight,
        color: Colors.mediumText,
    },
});
