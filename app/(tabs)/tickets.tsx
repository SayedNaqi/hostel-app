// Powered by OnSpace.AI
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useTickets } from '@/hooks/useTickets';
import { useAuth } from '@/hooks/useAuth';
import { TicketCard } from '@/components/feature/TicketCard';
import { Colors, FontSize, Radius, Shadow, Spacing } from '@/constants/theme';
import { Ticket } from '@/services/mockData';

type StatusFilter = 'all' | Ticket['status'];

export default function TicketsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { tickets } = useTickets();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const isAdmin = user?.role === 'admin';

  const filtered = statusFilter === 'all' ? tickets : tickets.filter(t => t.status === statusFilter);

  const counts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  };

  const filters: { label: string; value: StatusFilter; count: number }[] = [
    { label: 'All', value: 'all', count: counts.all },
    { label: 'Open', value: 'open', count: counts.open },
    { label: 'In Progress', value: 'in_progress', count: counts.in_progress },
    { label: 'Resolved', value: 'resolved', count: counts.resolved },
  ];

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.pageTitle}>{isAdmin ? 'All Tickets' : 'My Tickets'}</Text>
          <Text style={styles.subtitle}>{tickets.length} total</Text>
        </View>
        <Pressable
          onPress={() => router.push('/new-ticket')}
          style={({ pressed }) => [styles.newBtn, pressed && { opacity: 0.8 }]}
        >
          <MaterialIcons name="add" size={20} color="#fff" />
          <Text style={styles.newBtnText}>New</Text>
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {filters.map(f => (
          <Pressable
            key={f.value}
            onPress={() => setStatusFilter(f.value)}
            style={[styles.filterTab, statusFilter === f.value && styles.filterTabActive]}
          >
            <Text style={[styles.filterTabText, statusFilter === f.value && styles.filterTabTextActive]}>
              {f.label}
            </Text>
            {f.count > 0 ? (
              <View style={[styles.countBadge, statusFilter === f.value && styles.countBadgeActive]}>
                <Text style={[styles.countText, statusFilter === f.value && styles.countTextActive]}>{f.count}</Text>
              </View>
            ) : null}
          </Pressable>
        ))}
      </ScrollView>

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <MaterialIcons name="confirmation-number" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>No tickets</Text>
            <Text style={styles.emptySubtitle}>
              {statusFilter === 'all' ? 'Create your first ticket' : `No ${statusFilter.replace('_', ' ')} tickets`}
            </Text>
            <Pressable onPress={() => router.push('/new-ticket')} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>+ Create Ticket</Text>
            </Pressable>
          </View>
        ) : (
          filtered.map(t => (
            <TicketCard
              key={t.id}
              ticket={t}
              onPress={() => router.push({ pathname: '/ticket-detail', params: { id: t.id } })}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md },
  pageTitle: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
  newBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.primary, paddingHorizontal: Spacing.md, paddingVertical: 10, borderRadius: Radius.md, ...Shadow.sm },
  newBtnText: { color: '#fff', fontSize: FontSize.sm, fontWeight: '600' },
  filterScroll: { borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder },
  filterContent: { paddingHorizontal: Spacing.md, gap: 4, paddingBottom: 0 },
  filterTab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.md, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  filterTabActive: { borderBottomColor: Colors.primary },
  filterTabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  filterTabTextActive: { color: Colors.primary, fontWeight: '600' },
  countBadge: { backgroundColor: Colors.surfaceElevated, borderRadius: Radius.full, paddingHorizontal: 6, paddingVertical: 1 },
  countBadgeActive: { backgroundColor: Colors.primaryMuted },
  countText: { fontSize: FontSize.xs, color: Colors.textMuted, fontWeight: '600' },
  countTextActive: { color: Colors.primaryLight },
  list: { padding: Spacing.md, paddingBottom: Spacing.xl },
  empty: { alignItems: 'center', paddingTop: Spacing.xxl, gap: Spacing.sm },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textSecondary },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMuted },
  emptyBtn: { marginTop: Spacing.md, paddingHorizontal: Spacing.lg, paddingVertical: 10, backgroundColor: Colors.primaryMuted, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.primary },
  emptyBtnText: { color: Colors.primary, fontWeight: '600', fontSize: FontSize.sm },
});
