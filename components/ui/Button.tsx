// Powered by OnSpace.AI
import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  fullWidth?: boolean;
}

export function Button({
  label, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, style, fullWidth = false,
}: ButtonProps) {
  const variantStyle = {
    primary: { bg: Colors.primary, text: '#fff', border: Colors.primary },
    secondary: { bg: Colors.surfaceElevated, text: Colors.textPrimary, border: Colors.surfaceBorder },
    danger: { bg: Colors.danger, text: '#fff', border: Colors.danger },
    ghost: { bg: 'transparent', text: Colors.primary, border: 'transparent' },
  }[variant];

  const sizeStyle = {
    sm: { px: 12, py: 8, fontSize: FontSize.sm },
    md: { px: Spacing.md, py: 12, fontSize: FontSize.md },
    lg: { px: Spacing.lg, py: 15, fontSize: FontSize.body },
  }[size];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: variantStyle.bg, borderColor: variantStyle.border, paddingHorizontal: sizeStyle.px, paddingVertical: sizeStyle.py },
        fullWidth && styles.fullWidth,
        (pressed || disabled) && { opacity: 0.75 },
        style,
      ]}
    >
      {loading
        ? <ActivityIndicator size="small" color={variantStyle.text} />
        : <Text style={[styles.label, { color: variantStyle.text, fontSize: sizeStyle.fontSize }]}>{label}</Text>
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: Radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: { width: '100%' },
  label: { fontWeight: '600', letterSpacing: 0.2 },
});
