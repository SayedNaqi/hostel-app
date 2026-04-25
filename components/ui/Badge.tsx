// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';

type BadgeVariant = 'open' | 'in_progress' | 'resolved' | 'closed' | 'available' | 'occupied' | 'maintenance' | 'pending' | 'active' | 'high' | 'medium' | 'low' | 'admin' | 'student' | 'cancelled';

const BADGE_STYLES: Record<BadgeVariant, { bg: string; text: string; label: string }> = {
  open: { bg: Colors.warningMuted, text: Colors.warning, label: 'Open' },
  in_progress: { bg: Colors.primaryMuted, text: Colors.primaryLight, label: 'In Progress' },
  resolved: { bg: Colors.successMuted, text: Colors.success, label: 'Resolved' },
  closed: { bg: '#1F1F2E', text: Colors.textSecondary, label: 'Closed' },
  available: { bg: Colors.successMuted, text: Colors.success, label: 'Available' },
  occupied: { bg: Colors.dangerMuted, text: Colors.danger, label: 'Occupied' },
  maintenance: { bg: Colors.warningMuted, text: Colors.warning, label: 'Maintenance' },
  pending: { bg: Colors.warningMuted, text: Colors.warning, label: 'Pending' },
  active: { bg: Colors.successMuted, text: Colors.success, label: 'Active' },
  cancelled: { bg: '#1F1F2E', text: Colors.textSecondary, label: 'Cancelled' },
  high: { bg: Colors.dangerMuted, text: Colors.danger, label: 'High' },
  medium: { bg: Colors.warningMuted, text: Colors.warning, label: 'Medium' },
  low: { bg: Colors.successMuted, text: Colors.success, label: 'Low' },
  admin: { bg: Colors.adminMuted, text: Colors.adminColor, label: 'Admin' },
  student: { bg: Colors.primaryMuted, text: Colors.primary, label: 'Student' },
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  size?: 'sm' | 'md';
}

export function Badge({ variant, label, size = 'md' }: BadgeProps) {
  const config = BADGE_STYLES[variant] || BADGE_STYLES.closed;
  const displayLabel = label || config.label;
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, size === 'sm' && styles.badgeSm]}>
      <Text style={[styles.text, { color: config.text }, size === 'sm' && styles.textSm]}>
        {displayLabel}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  textSm: {
    fontSize: 10,
  },
});
