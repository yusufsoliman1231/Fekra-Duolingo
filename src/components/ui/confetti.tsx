import { Colors } from '@/constants/Colors';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COLORS = [
    Colors.primary,
    Colors.secondary,
    Colors.correct,
    '#FFD700', // gold
    '#FF69B4', // pink
    '#00CED1', // dark cyan
    '#FF6347', // tomato
];

const CONFETTI_COUNT = 50;

interface ConfettiPieceProps {
    index: number;
    onComplete?: () => void;
    isLast: boolean;
}

function ConfettiPiece({ index, onComplete, isLast }: ConfettiPieceProps) {
    const translateY = useSharedValue(-50);
    const translateX = useSharedValue(0);
    const rotate = useSharedValue(0);
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const startX = Math.random() * SCREEN_WIDTH;
    const endX = startX + (Math.random() - 0.5) * 200;
    const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
    const size = 8 + Math.random() * 8;
    const delay = Math.random() * 300;
    const duration = 2000 + Math.random() * 1000;
    const rotations = 2 + Math.random() * 4;
    const isSquare = Math.random() > 0.5;

    useEffect(() => {
        translateY.value = withDelay(
            delay,
            withTiming(SCREEN_HEIGHT + 100, {
                duration,
                easing: Easing.out(Easing.quad),
            })
        );
        translateX.value = withDelay(
            delay,
            withSequence(
                withTiming(endX - startX + 30, { duration: duration / 3 }),
                withTiming(endX - startX - 30, { duration: duration / 3 }),
                withTiming(endX - startX, { duration: duration / 3 })
            )
        );
        rotate.value = withDelay(
            delay,
            withTiming(rotations * 360, {
                duration,
                easing: Easing.linear,
            })
        );
        scale.value = withDelay(
            delay,
            withSequence(
                withTiming(1.2, { duration: 200 }),
                withTiming(0.8, { duration: duration - 400 }),
                withTiming(0, { duration: 200 }, () => {
                    if (isLast && onComplete) {
                        runOnJS(onComplete)();
                    }
                })
            )
        );
        opacity.value = withDelay(
            delay + duration - 500,
            withTiming(0, { duration: 500 })
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateY: translateY.value },
            { translateX: translateX.value },
            { rotate: `${rotate.value}deg` },
            { scale: scale.value },
        ],
        opacity: opacity.value,
    }));

    return (
        <Animated.View
            style={[
                styles.confettiPiece,
                {
                    left: startX,
                    width: size,
                    height: isSquare ? size : size * 1.5,
                    backgroundColor: color,
                    borderRadius: isSquare ? 2 : size / 2,
                },
                animatedStyle,
            ]}
        />
    );
}

interface ConfettiProps {
    visible: boolean;
    onComplete?: () => void;
}

export function Confetti({ visible, onComplete }: ConfettiProps) {
    if (!visible) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {Array.from({ length: CONFETTI_COUNT }).map((_, index) => (
                <ConfettiPiece
                    key={index}
                    index={index}
                    onComplete={onComplete}
                    isLast={index === CONFETTI_COUNT - 1}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
        zIndex: 1000,
    },
    confettiPiece: {
        position: 'absolute',
        top: 0,
    },
});
