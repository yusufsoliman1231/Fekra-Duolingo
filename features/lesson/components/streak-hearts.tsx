import { FireIcon } from '@/components/icons/fire-icon';
import { HeartIcon } from '@/components/icons/heart-icon';
import { Colors } from '@/constants/Colors';
import { rw, Sizes } from '@/constants/Responsive';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StreakHeartsProps {
    hearts: number;
    streak: number;
    maxHearts?: number;
}

export function StreakHearts({
    hearts,
    streak,
    maxHearts = 3,
}: StreakHeartsProps) {
    return (
        <View style={styles.container}>
            {/* Streak */}
            <View
                style={styles.item}
                accessibilityLabel={`Streak: ${streak}`}
                accessibilityRole="text"
            >
                <FireIcon size={rw(20)} />
                <Text style={styles.streakValue}>{streak}</Text>
            </View>

            {/* Hearts */}
            <View
                style={styles.item}
                accessibilityLabel={`Hearts: ${hearts} of ${maxHearts}`}
                accessibilityRole="text"
            >
                <HeartIcon size={rw(20)} filled={hearts > 0} />
                <Text
                    style={[
                        styles.heartValue,
                        hearts === 0 && styles.heartValueEmpty,
                    ]}
                >
                    {hearts}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Sizes.md,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Sizes.xs,
    },
    streakValue: {
        fontSize: Sizes.fontMd,
        fontWeight: '700',
        color: Colors.streakOrange,
    },
    heartValue: {
        fontSize: Sizes.fontMd,
        fontWeight: '700',
        color: Colors.heartRed,
    },
    heartValueEmpty: {
        color: Colors.lightText,
    },
});
