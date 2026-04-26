// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import { useAlert } from '@/template';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, Radius, Shadow, Spacing } from '@/constants/theme';
import { Ticket } from '@/services/mockData';

export default function TicketDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { allTickets, updateStatus } = useTickets();
  const { showAlert } = useAlert();
  const isAdmin = user?.role === 'admin';

  const ticket = allTickets.find(t => t.id === id);

  if (!ticket) {
    return (
      <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: Colors.textMuted }}>Ticket not found</Text>
      </View>
    );
  }

  const handleStatusUpdate = (newStatus: Ticket['status']) => {
    showAlert(
      'Update Status',
      `Change status to "${newStatus.replace('_', ' ')}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Update', onPress: () => { updateStatus(ticket.id, newStatus); router.back(); } },
      ]
    );
  };

  const timeFormatted = new Date(ticket.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.textPrimary} />
        </Pressable>
        <Text style={styles.navTitle}>Ticket Details</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + Spacing.xl }]} showsVerticalScrollIndicator={false}>
        {/* Status Row */}
        <View style={styles.statusRow}>
          <Badge variant={ticket.status} />
          <Badge variant={ticket.priority} label={ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} />
          <Badge variant={ticket.category as any} label={ticket.category.charAt(0).toUpperCase() + ticket.category.slice(1)} />
        </View>

        {/* Title */}
        <Text style={styles.title}>{ticket.title}</Text>
        <Text style={styles.meta}>#{ticket.id.slice(-6)} · Submitted by {ticket.user_name}</Text>
        {ticket.room_number ? <Text style={styles.meta}>Room {ticket.room_number}</Text> : null}
        <Text style={styles.time}>{timeFormatted}</Text>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.descBox}>
            <Text style={styles.descText}>{ticket.description}</Text>
          </View>
        </View>

        {/* Assignment */}
        {ticket.assigned_to ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assignment</Text>
            <View style={styles.assignBox}>
              <MaterialIcons name="person" size={18} color={Colors.success} />
              <Text style={styles.assignText}>Assigned to {ticket.assigned_to}</Text>
            </View>
          </View>
        ) : null}

        {/* Admin Actions */}
        {isAdmin ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Update Status</Text>
            <View style={styles.actionRow}>
              {ticket.status !== 'in_progress' ? (
                <Button label="Mark In Progress" onPress={() => handleStatusUpdate('in_progress')} variant="secondary" size="sm" style={{ flex: 1 }} />
              ) : null}
              {ticket.status !== 'resolved' ? (
                <Button label="Mark Resolved" onPress={() => handleStatusUpdate('resolved')} variant="primary" size="sm" style={{ flex: 1 }} />
              ) : null}
              {ticket.status !== 'closed' ? (
                <Button label="Close" onPress={() => handleStatusUpdate('closed')} variant="ghost" size="sm" style={{ flex: 1 }} />
              ) : null}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder },
  backBtn: { width: 38, height: 38, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  navTitle: { fontSize: FontSize.body, fontWeight: '600', color: Colors.textPrimary },
  content: { padding: Spacing.md },
  statusRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: Spacing.md },
  title: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: 6 },
  meta: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 2 },
  time: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.lg },
  section: { marginBottom: Spacing.lg },
  sectionTitle: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.5 },
  descBox: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.surfaceBorder, ...Shadow.sm },
  descText: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 24 },
  assignBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.successMuted, padding: Spacing.md, borderRadius: Radius.md },
  assignText: { fontSize: FontSize.md, color: Colors.success, fontWeight: '500' },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
});
