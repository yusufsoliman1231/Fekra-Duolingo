import { Colors } from '@/constants/Colors';
import { rw, Sizes } from '@/constants/Responsive';
import React, { type ReactNode } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    type StyleProp,
    type TextStyle,
    type ViewStyle,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

// --- Button Root ---
interface ButtonRootProps {
    children: ReactNode;
    onPress: () => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    style?: StyleProp<ViewStyle>;
    accessibilityLabel?: string;
}

function ButtonRoot({
    children,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    accessibilityLabel,
}: ButtonRootProps) {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ disabled: isDisabled }}
            style={[
                styles.button,
                variantStyles[variant],
                isDisabled && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
                    size="small"
                />
            ) : (
                children
            )}
        </TouchableOpacity>
    );
}

// --- Button Text ---
interface ButtonTextProps {
    children: string;
    variant?: ButtonVariant;
    style?: StyleProp<TextStyle>;
}

function ButtonText({ children, variant = 'primary', style }: ButtonTextProps) {
    return (
        <Text style={[styles.text, textVariantStyles[variant], style]}>
            {children}
        </Text>
    );
}

// --- Button Icon ---
interface ButtonIconProps {
    icon: ReactNode;
    position?: 'left' | 'right';
}

function ButtonIcon({ icon }: ButtonIconProps) {
    return <>{icon}</>;
}

// --- Compound Export ---
export const Button = Object.assign(ButtonRoot, {
    Text: ButtonText,
    Icon: ButtonIcon,
});

const variantStyles: Record<ButtonVariant, ViewStyle> = {
    primary: {
        backgroundColor: Colors.buttonPrimary,
        borderColor: Colors.primaryDark,
        borderBottomWidth: 4,
    },
    secondary: {
        backgroundColor: Colors.buttonSecondary,
        borderColor: Colors.secondaryDark,
        borderBottomWidth: 4,
    },
    outline: {
        backgroundColor: 'transparent',
        borderColor: Colors.borderLight,
        borderWidth: 2,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    danger: {
        backgroundColor: Colors.incorrect,
        borderColor: '#CC3C3C',
        borderBottomWidth: 4,
    },
};

const textVariantStyles: Record<ButtonVariant, TextStyle> = {
    primary: {
        color: Colors.white,
    },
    secondary: {
        color: Colors.white,
    },
    outline: {
        color: Colors.primary,
    },
    ghost: {
        color: Colors.primary,
    },
    danger: {
        color: Colors.white,
    },
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.md,
        paddingHorizontal: Sizes.lg,
        borderRadius: Sizes.radiusMd,
        gap: Sizes.sm,
        minHeight: Sizes.buttonMd,
    },
    disabled: {
        backgroundColor: Colors.buttonDisabled,
        borderColor: Colors.buttonDisabled,
        borderBottomWidth: 4,
        borderBottomColor: '#CDCDCD',
    },
    text: {
        fontSize: Sizes.fontMd,
        fontWeight: '700',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: rw(1),
    },
});
