import { Colors } from '@/constants/Colors';
import { Sizes } from '@/constants/Responsive';
import React, { type ReactNode } from 'react';
import {
    StyleSheet,
    View,
    type StyleProp,
    type ViewStyle,
} from 'react-native';

// --- Card Root ---
interface CardProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
    variant?: 'default' | 'correct' | 'incorrect' | 'highlighted';
}

function CardRoot({ children, style, variant = 'default' }: CardProps) {
    const variantStyle = variantStyles[variant];
    return (
        <View
            style={[styles.card, variantStyle, style]}
            accessibilityRole="none"
        >
            {children}
        </View>
    );
}

// --- Card Header ---
interface CardHeaderProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}

function CardHeader({ children, style }: CardHeaderProps) {
    return <View style={[styles.header, style]}>{children}</View>;
}

// --- Card Body ---
interface CardBodyProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}

function CardBody({ children, style }: CardBodyProps) {
    return <View style={[styles.body, style]}>{children}</View>;
}

// --- Card Footer ---
interface CardFooterProps {
    children: ReactNode;
    style?: StyleProp<ViewStyle>;
}

function CardFooter({ children, style }: CardFooterProps) {
    return <View style={[styles.footer, style]}>{children}</View>;
}

// --- Compound Export ---
export const Card = Object.assign(CardRoot, {
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter,
});

const variantStyles: Record<string, ViewStyle> = {
    default: {
        borderColor: Colors.cardBorderLight,
    },
    correct: {
        borderColor: Colors.correct,
        backgroundColor: Colors.correctLight,
    },
    incorrect: {
        borderColor: Colors.incorrect,
        backgroundColor: Colors.incorrectLight,
    },
    highlighted: {
        borderColor: Colors.secondary,
        backgroundColor: Colors.chipBgActive,
    },
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.cardLight,
        borderRadius: Sizes.radiusMd,
        borderWidth: 2,
        borderColor: Colors.cardBorderLight,
        overflow: 'hidden',
    },
    header: {
        paddingHorizontal: Sizes.cardPadding,
        paddingTop: Sizes.cardPadding,
        paddingBottom: Sizes.sm,
    },
    body: {
        paddingHorizontal: Sizes.cardPadding,
        paddingVertical: Sizes.sm,
    },
    footer: {
        paddingHorizontal: Sizes.cardPadding,
        paddingBottom: Sizes.cardPadding,
        paddingTop: Sizes.sm,
    },
});
