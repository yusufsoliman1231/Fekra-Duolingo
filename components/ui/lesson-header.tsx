import { Colors } from '@/constants/Colors';
import { rw, Sizes } from '@/constants/Responsive';
import React, { type ReactNode } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Header Root ---
interface HeaderRootProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}

function HeaderRoot({ children, style }: HeaderRootProps) {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[
                styles.container,
                { paddingTop: insets.top + Sizes.sm },
                style,
            ]}
        >
            <View style={styles.inner}>{children}</View>
        </View>
    );
}

// --- Header Left ---
interface HeaderSectionProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}

function HeaderLeft({ children, style }: HeaderSectionProps) {
    return <View style={[styles.left, style]}>{children}</View>;
}

// --- Header Center ---
function HeaderCenter({ children, style }: HeaderSectionProps) {
    return <View style={[styles.center, style]}>{children}</View>;
}

// --- Header Right ---
function HeaderRight({ children, style }: HeaderSectionProps) {
    return <View style={[styles.right, style]}>{children}</View>;
}

// --- Header Close Button ---
interface HeaderCloseProps {
    onPress: () => void;
    accessibilityLabel?: string;
}

function HeaderClose({
    onPress,
    accessibilityLabel = 'Close',
}: HeaderCloseProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            style={styles.closeButton}
        >
            <View style={styles.closeLine1} />
            <View style={styles.closeLine2} />
        </TouchableOpacity>
    );
}

// --- Compound Export ---
export const Header = Object.assign(HeaderRoot, {
    Left: HeaderLeft,
    Center: HeaderCenter,
    Right: HeaderRight,
    Close: HeaderClose,
});

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        paddingBottom: Sizes.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.screenPadding,
        height: Sizes.headerHeight,
    },
    left: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Sizes.sm,
    },
    center: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: Sizes.sm,
        gap: Sizes.sm,
    },
    closeButton: {
        width: rw(32),
        height: rw(32),
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeLine1: {
        position: 'absolute',
        width: rw(20),
        height: 2.5,
        backgroundColor: Colors.lightText,
        borderRadius: 2,
        transform: [{ rotate: '45deg' }],
    },
    closeLine2: {
        position: 'absolute',
        width: rw(20),
        height: 2.5,
        backgroundColor: Colors.lightText,
        borderRadius: 2,
        transform: [{ rotate: '-45deg' }],
    },
});
