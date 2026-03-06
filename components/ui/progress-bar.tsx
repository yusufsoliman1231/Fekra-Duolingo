import { Colors } from '@/constants/Colors';
import { rh, Sizes } from '@/constants/Responsive';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface ProgressBarProps {
    current: number;
    total: number;
    animated?: boolean;
}

export function ProgressBar({ current, total, animated = true }: ProgressBarProps) {
    const progress = total > 0 ? current / total : 0;
    const animatedWidth = React.useRef(new Animated.Value(progress)).current;

    React.useEffect(() => {
        if (animated) {
            Animated.timing(animatedWidth, {
                toValue: progress,
                duration: 400,
                useNativeDriver: false,
            }).start();
        } else {
            animatedWidth.setValue(progress);
        }
    }, [progress, animated, animatedWidth]);

    return (
        <View
            style={styles.container}
            accessibilityRole="progressbar"
            accessibilityLabel={`Progress: ${current} of ${total}`}
            accessibilityValue={{
                min: 0,
                max: total,
                now: current,
            }}
        >
            <Animated.View
                style={[
                    styles.fill,
                    {
                        width: animatedWidth.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: rh(12),
        backgroundColor: Colors.progressBg,
        borderRadius: rh(6),
        overflow: 'hidden',
        flex: 1,
        marginHorizontal: Sizes.sm,
    },
    fill: {
        height: '100%',
        backgroundColor: Colors.progressFill,
        borderRadius: rh(6),
    },
});
