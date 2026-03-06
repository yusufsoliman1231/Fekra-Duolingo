import { FireIcon } from '@/components/icons/fire-icon';
import { HeartIcon } from '@/components/icons/heart-icon';
import { StarIcon } from '@/components/icons/star-icon';
import { TrophyIcon } from '@/components/icons/trophy-icon';
import { Button } from '@/components/ui/button';
import { Confetti } from '@/components/ui/confetti';
import { Colors } from '@/constants/Colors';
import { rw, Sizes } from '@/constants/Responsive';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { TranslationKey } from '@/i18n/en';

interface CompletionScreenProps {
    xp: number;
    streak: number;
    hearts: number;
    totalExercises: number;
    correctAnswers: number;
    onRestart: () => void;
    onGoHome: () => void;
    translate: (key: TranslationKey) => string;
}

export function CompletionScreen({
    xp,
    streak,
    hearts,
    totalExercises,
    correctAnswers,
    onRestart,
    onGoHome,
    translate,
}: CompletionScreenProps) {
    const [showConfetti, setShowConfetti] = useState(true);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.3)).current;
    const slideAnim = React.useRef(new Animated.Value(50)).current;
    const confettiAnims = React.useRef(
        Array.from({ length: 12 }, () => ({
            x: new Animated.Value(0),
            y: new Animated.Value(0),
            opacity: new Animated.Value(1),
            rotate: new Animated.Value(0),
        }))
    ).current;

    useEffect(() => {
        // Main animation
        Animated.sequence([
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 6,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Confetti animation
        confettiAnims.forEach((anim, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const distance = 80 + Math.random() * 60;

            Animated.parallel([
                Animated.timing(anim.x, {
                    toValue: Math.cos(angle) * distance,
                    duration: 800,
                    delay: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.y, {
                    toValue: Math.sin(angle) * distance - 40,
                    duration: 800,
                    delay: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.opacity, {
                    toValue: 0,
                    duration: 800,
                    delay: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(anim.rotate, {
                    toValue: Math.random() * 4 - 2,
                    duration: 800,
                    delay: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        });
    }, [fadeAnim, scaleAnim, slideAnim, confettiAnims]);

    const confettiColors = [
        Colors.primary,
        Colors.secondary,
        Colors.orange,
        Colors.purple,
        Colors.pink,
        Colors.heartRed,
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* Full-screen confetti */}
            <Confetti visible={showConfetti} onComplete={() => setShowConfetti(false)} />

            <View style={styles.content}>
                {/* Confetti */}
                <View style={styles.confettiContainer}>
                    {confettiAnims.map((anim, i) => (
                        <Animated.View
                            key={i}
                            style={[
                                styles.confettiPiece,
                                {
                                    backgroundColor:
                                        confettiColors[i % confettiColors.length],
                                    transform: [
                                        { translateX: anim.x },
                                        { translateY: anim.y },
                                        {
                                            rotate: anim.rotate.interpolate({
                                                inputRange: [-2, 2],
                                                outputRange: ['-180deg', '180deg'],
                                            }),
                                        },
                                    ],
                                    opacity: anim.opacity,
                                },
                            ]}
                        />
                    ))}
                </View>

                {/* Trophy */}
                <Animated.View
                    style={[
                        styles.trophyContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.trophyCircle}>
                        <TrophyIcon size={rw(64)} color={Colors.orange} />
                    </View>
                </Animated.View>

                {/* Title */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <Text style={styles.title}>{translate('lessonComplete')}</Text>
                    <Text style={styles.subtitle}>{translate('youDidIt')}</Text>
                </Animated.View>

                {/* Stats */}
                <Animated.View
                    style={[
                        styles.statsContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.statCard}>
                        <StarIcon size={rw(32)} color={Colors.xpPurple} />
                        <Text style={styles.statValue}>{xp}</Text>
                        <Text style={styles.statLabel}>{translate('xpEarned')}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <FireIcon size={rw(32)} />
                        <Text style={styles.statValue}>{streak}</Text>
                        <Text style={styles.statLabel}>{translate('streakCount')}</Text>
                    </View>

                    <View style={styles.statCard}>
                        <HeartIcon size={rw(32)} />
                        <Text style={styles.statValue}>{hearts}/3</Text>
                        <Text style={styles.statLabel}>{translate('hearts')}</Text>
                    </View>
                </Animated.View>

                {/* Accuracy */}
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }}
                >
                    <Text style={styles.accuracy}>
                        {correctAnswers}/{totalExercises} correct (
                        {Math.round((correctAnswers / totalExercises) * 100)}%)
                    </Text>
                </Animated.View>

                {/* Actions */}
                <Animated.View
                    style={[
                        styles.actions,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <Button
                        onPress={onRestart}
                        variant="primary"
                        style={styles.actionButton}
                        accessibilityLabel={translate('restartLesson')}
                    >
                        <Button.Text>{translate('restartLesson')}</Button.Text>
                    </Button>

                    <Button
                        onPress={onGoHome}
                        variant="outline"
                        style={styles.actionButton}
                        accessibilityLabel="Go Home"
                    >
                        <Button.Text variant="outline">Go Home</Button.Text>
                    </Button>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Sizes.screenPadding,
    },
    confettiContainer: {
        position: 'absolute',
        top: '35%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    confettiPiece: {
        position: 'absolute',
        width: rw(10),
        height: rw(10),
        borderRadius: rw(2),
    },
    trophyContainer: {
        marginBottom: Sizes.lg,
    },
    trophyCircle: {
        width: rw(120),
        height: rw(120),
        borderRadius: rw(60),
        backgroundColor: '#FFF3D6',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: Colors.orange,
    },
    title: {
        fontSize: Sizes.fontXxl,
        fontWeight: '700',
        color: Colors.darkText,
        textAlign: 'center',
        marginBottom: Sizes.xs,
    },
    subtitle: {
        fontSize: Sizes.fontMd,
        color: Colors.mediumText,
        textAlign: 'center',
        marginBottom: Sizes.xl,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: Sizes.md,
        marginBottom: Sizes.lg,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: Sizes.md,
        paddingHorizontal: Sizes.sm,
        borderRadius: Sizes.radiusMd,
        borderWidth: 2,
        borderColor: Colors.borderLight,
        borderBottomWidth: 4,
        backgroundColor: Colors.white,
        gap: Sizes.xs,
    },
    statValue: {
        fontSize: Sizes.fontXl,
        fontWeight: '700',
        color: Colors.darkText,
    },
    statLabel: {
        fontSize: Sizes.fontXs,
        color: Colors.mediumText,
        fontWeight: '600',
        textAlign: 'center',
    },
    accuracy: {
        fontSize: Sizes.fontSm,
        color: Colors.mediumText,
        marginBottom: Sizes.xl,
    },
    actions: {
        width: '100%',
        gap: Sizes.sm,
    },
    actionButton: {
        width: '100%',
    },
});
