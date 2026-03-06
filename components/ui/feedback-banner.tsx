import { CheckIcon } from '@/components/icons/check-icon';
import { CloseIcon } from '@/components/icons/close-icon';
import { Colors } from '@/constants/Colors';
import { rw, Sizes } from '@/constants/Responsive';
import React from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

interface FeedbackBannerProps {
    correct: boolean;
    explanation: string;
    style?: StyleProp<ViewStyle>;
}

export function FeedbackBanner({
    correct,
    explanation,
    style,
}: FeedbackBannerProps) {
    const slideAnim = React.useRef(new Animated.Value(100)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 80,
                friction: 12,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [slideAnim, fadeAnim]);

    return (
        <Animated.View
            style={[
                styles.container,
                correct ? styles.correctBg : styles.incorrectBg,
                {
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim,
                },
                style,
            ]}
            accessibilityRole="alert"
            accessibilityLabel={
                correct
                    ? `Correct! ${explanation}`
                    : `Incorrect. ${explanation}`
            }
        >
            <View style={styles.header}>
                {correct ? (
                    <CheckIcon size={rw(28)} color={Colors.primaryDark} />
                ) : (
                    <CloseIcon size={rw(28)} color={Colors.incorrect} />
                )}
                <Text
                    style={[
                        styles.title,
                        correct ? styles.correctText : styles.incorrectText,
                    ]}
                >
                    {correct ? 'Correct!' : 'Incorrect'}
                </Text>
            </View>
            <Text
                style={[
                    styles.explanation,
                    correct ? styles.correctSubText : styles.incorrectSubText,
                ]}
            >
                {explanation}
            </Text>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Sizes.md,
        borderRadius: Sizes.radiusMd,
        marginTop: Sizes.md,
    },
    correctBg: {
        backgroundColor: Colors.correctBg,
    },
    incorrectBg: {
        backgroundColor: Colors.incorrectBg,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Sizes.sm,
        marginBottom: Sizes.xs,
    },
    title: {
        fontSize: Sizes.fontLg,
        fontWeight: '700',
    },
    correctText: {
        color: Colors.primaryDark,
    },
    incorrectText: {
        color: Colors.incorrect,
    },
    explanation: {
        fontSize: Sizes.fontSm,
        lineHeight: Sizes.fontSm * 1.4,
        marginLeft: rw(36),
    },
    correctSubText: {
        color: Colors.primaryDark,
    },
    incorrectSubText: {
        color: Colors.incorrect,
    },
});
