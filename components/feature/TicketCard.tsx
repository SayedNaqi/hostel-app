// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Colors, FontSize, Radius, Shadow, Spacing } from '@/constants/theme';
import { Ticket } from '@/services/mockData';

interface TicketCardProps {
  ticket: Ticket;
  onPress?: () => void;
}

const CATEGORY_ICONS: Record<Ticket['category'], keyof typeof MaterialIcons.glyphMap> = {
  maintenance: 'build',
  complaint: 'report',
  request: 'assignment',
  other: 'help-outline',
};

export function TicketCard({ ticket, onPress }: TicketCardProps) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, Shadow.sm, pressed && { opacity: 0.85 }]}
    >
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <MaterialIcons name={CATEGORY_ICONS[ticket.category]} size={18} color={Colors.primary} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>{ticket.title}</Text>
          <Text style={styles.meta}>#{ticket.id.slice(-4)} · {ticket.user_name}</Text>
        </View>
        <Badge variant={ticket.status} />
      </View>

      <Text style={styles.description} numberOfLines={2}>{ticket.description}</Text>

      <View style={styles.footer}>
        <Badge variant={ticket.priority} label={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} size="sm" />
        {ticket.room_number ? (
          <View style={styles.roomTag}>
            <MaterialIcons name="door-front" size={12} color={Colors.textMuted} />
            <Text style={styles.roomText}>Room {ticket.room_number}</Text>
          </View>
        ) : null}
        <Text style={styles.time}>{timeAgo(ticket.created_at)}</Text>
      </View>

      {ticket.assigned_to ? (
        <View style={styles.assigned}>
          <MaterialIcons name="person" size={12} color={Colors.textMuted} />
          <Text style={styles.assignedText}>Assigned to {ticket.assigned_to}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    marginBottom: Spacing.sm,
  },
  header: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
  iconWrap: {
    width: 36, height: 36, borderRadius: Radius.sm,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center', justifyContent: 'center', marginRight: Spacing.sm,
  },
  headerText: { flex: 1, marginRight: Spacing.sm },
  title: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary, marginBottom: 2 },
  meta: { fontSize: FontSize.xs, color: Colors.textMuted },
  description: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginBottom: Spacing.sm },
  footer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  roomTag: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  roomText: { fontSize: FontSize.xs, color: Colors.textMuted },
  time: { fontSize: FontSize.xs, color: Colors.textMuted, marginLeft: 'auto' },
  assigned: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: Spacing.sm, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.surfaceBorder },
  assignedText: { fontSize: FontSize.xs, color: Colors.textMuted },
});
