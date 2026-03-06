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

interface MatchPairsProps {
    exercise: Exercise;
    onAnswer: (answer: string[], correct: boolean) => void;
    disabled: boolean;
    prompt: string;
    tapHint: string;
}

interface MatchState {
    selectedLeft: string | null;
    selectedRight: string | null;
    matchedPairs: { left: string; right: string }[];
    incorrectPair: { left: string; right: string } | null;
}

export function MatchPairs({
    exercise,
    onAnswer,
    disabled,
    prompt,
    tapHint,
}: MatchPairsProps) {
    const pairs = exercise.pairs ?? [];

    const [state, setState] = useState<MatchState>({
        selectedLeft: null,
        selectedRight: null,
        matchedPairs: [],
        incorrectPair: null,
    });
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const shakeAnim = React.useRef(new Animated.Value(0)).current;

    const isLeftMatched = useCallback(
        (left: string) => state.matchedPairs.some((p) => p.left === left),
        [state.matchedPairs]
    );

    const isRightMatched = useCallback(
        (right: string) => state.matchedPairs.some((p) => p.right === right),
        [state.matchedPairs]
    );

    const triggerShake = () => {
        Animated.sequence([
            Animated.timing(shakeAnim, {
                toValue: 10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: -10,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 6,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(shakeAnim, {
                toValue: 0,
                duration: 50,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleLeftSelect = (left: string) => {
        if (disabled || hasSubmitted || isLeftMatched(left)) return;
        setState((prev) => ({ ...prev, selectedLeft: left, incorrectPair: null }));
    };

    const handleRightSelect = (right: string) => {
        if (disabled || hasSubmitted || isRightMatched(right)) return;

        const { selectedLeft } = state;
        if (!selectedLeft) {
            setState((prev) => ({ ...prev, selectedRight: right, incorrectPair: null }));
            return;
        }

        // Check if the pair is correct
        const correctPair = pairs.find(
            (p) => p.left === selectedLeft && p.right === right
        );

        if (correctPair) {
            const newMatchedPairs = [...state.matchedPairs, correctPair];
            setState({
                selectedLeft: null,
                selectedRight: null,
                matchedPairs: newMatchedPairs,
                incorrectPair: null,
            });

            // Check if all pairs are matched
            if (newMatchedPairs.length === pairs.length) {
                setHasSubmitted(true);
                onAnswer(
                    newMatchedPairs.map((p) => `${p.left}-${p.right}`),
                    true
                );
            }
        } else {
            // Wrong match
            setState((prev) => ({
                ...prev,
                incorrectPair: { left: selectedLeft, right },
            }));
            triggerShake();

            // Clear after a brief delay
            setTimeout(() => {
                setState((prev) => ({
                    ...prev,
                    selectedLeft: null,
                    selectedRight: null,
                    incorrectPair: null,
                }));

                // If this is the only interaction allowed (for simplicity), mark wrong
                // But per Duolingo style, let them keep trying
            }, 800);
        }
    };

    // Shuffle the right side for display
    const shuffledRight = React.useMemo(() => {
        const rights = pairs.map((p) => p.right);
        // Simple shuffle
        return [...rights].sort(() => Math.random() - 0.5);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exercise.id]);

    return (
        <View style={styles.container}>
            <Text style={styles.prompt}>{prompt}</Text>
            <Text style={styles.hint}>{tapHint}</Text>

            <Animated.View
                style={[
                    styles.pairsContainer,
                    { transform: [{ translateX: shakeAnim }] },
                ]}
            >
                {/* Left column */}
                <View style={styles.column}>
                    {pairs.map((pair) => {
                        const matched = isLeftMatched(pair.left);
                        const isSelected = state.selectedLeft === pair.left;
                        const isIncorrect =
                            state.incorrectPair?.left === pair.left;

                        return (
                            <TouchableOpacity
                                key={`left-${pair.left}`}
                                onPress={() => handleLeftSelect(pair.left)}
                                disabled={disabled || hasSubmitted || matched}
                                accessibilityRole="button"
                                accessibilityLabel={`Left word: ${pair.left}`}
                                accessibilityState={{ selected: isSelected, disabled: matched }}
                                style={[
                                    styles.pairCard,
                                    isSelected && styles.pairCardSelected,
                                    matched && styles.pairCardMatched,
                                    isIncorrect && styles.pairCardIncorrect,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.pairText,
                                        isSelected && styles.pairTextSelected,
                                        matched && styles.pairTextMatched,
                                        isIncorrect && styles.pairTextIncorrect,
                                    ]}
                                >
                                    {pair.left}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Right column */}
                <View style={styles.column}>
                    {shuffledRight.map((right) => {
                        const matched = isRightMatched(right);
                        const isSelected = state.selectedRight === right;
                        const isIncorrect =
                            state.incorrectPair?.right === right;

                        return (
                            <TouchableOpacity
                                key={`right-${right}`}
                                onPress={() => handleRightSelect(right)}
                                disabled={disabled || hasSubmitted || matched}
                                accessibilityRole="button"
                                accessibilityLabel={`Right word: ${right}`}
                                accessibilityState={{ selected: isSelected, disabled: matched }}
                                style={[
                                    styles.pairCard,
                                    isSelected && styles.pairCardSelected,
                                    matched && styles.pairCardMatched,
                                    isIncorrect && styles.pairCardIncorrect,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.pairText,
                                        isSelected && styles.pairTextSelected,
                                        matched && styles.pairTextMatched,
                                        isIncorrect && styles.pairTextIncorrect,
                                    ]}
                                >
                                    {right}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </Animated.View>
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
        marginBottom: Sizes.xs,
        lineHeight: Sizes.fontXl * 1.3,
    },
    hint: {
        fontSize: Sizes.fontSm,
        color: Colors.mediumText,
        marginBottom: Sizes.lg,
    },
    pairsContainer: {
        flexDirection: 'row',
        gap: Sizes.md,
    },
    column: {
        flex: 1,
        gap: Sizes.sm,
    },
    pairCard: {
        padding: Sizes.md,
        borderRadius: Sizes.radiusMd,
        borderWidth: 2,
        borderColor: Colors.borderLight,
        borderBottomWidth: 4,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: rw(56),
    },
    pairCardSelected: {
        borderColor: Colors.secondary,
        backgroundColor: Colors.chipBgActive,
    },
    pairCardMatched: {
        borderColor: Colors.correct,
        backgroundColor: Colors.correctLight,
    },
    pairCardIncorrect: {
        borderColor: Colors.incorrect,
        backgroundColor: Colors.incorrectLight,
    },
    pairText: {
        fontSize: Sizes.fontMd,
        fontWeight: '700',
        color: Colors.darkText,
        textAlign: 'center',
    },
    pairTextSelected: {
        color: Colors.secondaryDark,
    },
    pairTextMatched: {
        color: Colors.primaryDark,
    },
    pairTextIncorrect: {
        color: Colors.incorrect,
    },
});
