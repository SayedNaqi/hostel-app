// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useTickets } from '@/hooks/useTickets';
import { useRooms } from '@/hooks/useRooms';
import { StatCard } from '@/components/ui/StatCard';
import { TicketCard } from '@/components/feature/TicketCard';
import { Badge } from '@/components/ui/Badge';
import { Colors, FontSize, Radius, Shadow, Spacing } from '@/constants/theme';
import { ADMIN_STATS } from '@/services/mockData';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tickets } = useTickets();
  const { myBooking, stats } = useRooms();

  const isAdmin = user?.role === 'admin';
  const recentTickets = tickets.slice(0, 3);
  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: Spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.userName}>{user?.full_name?.split(' ')[0]} 👋</Text>
        </View>
        <View style={styles.roleBadgeWrap}>
          <Badge variant={user?.role as 'admin' | 'student'} />
          <Pressable style={styles.notifBtn} hitSlop={8}>
            <MaterialIcons name="notifications-none" size={22} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      {/* Room / Status Card */}
      {!isAdmin ? (
        <Pressable
          onPress={() => router.push('/(tabs)/rooms')}
          style={({ pressed }) => [styles.myRoomCard, pressed && { opacity: 0.9 }]}
        >
          <View style={styles.myRoomLeft}>
            <MaterialIcons name="bed" size={28} color={Colors.primary} />
            <View style={{ marginLeft: Spacing.sm }}>
              <Text style={styles.myRoomLabel}>My Room</Text>
              {myBooking ? (
                <Text style={styles.myRoomNum}>Room {myBooking.room_number}</Text>
              ) : (
                <Text style={styles.myRoomNum}>No room assigned</Text>
              )}
              {myBooking ? <Badge variant={myBooking.status} size="sm" /> : null}
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={22} color={Colors.textMuted} />
        </Pressable>
      ) : null}

      {/* Stats Grid */}
      <Text style={styles.sectionTitle}>Overview</Text>
      {isAdmin ? (
        <>
          <View style={styles.statsRow}>
            <StatCard label="Total Rooms" value={ADMIN_STATS.total_rooms} icon="domain" color={Colors.primary} />
            <StatCard label="Available" value={ADMIN_STATS.available_rooms} icon="check-circle" color={Colors.success} />
          </View>
          <View style={styles.statsRow}>
            <StatCard label="Students" value={ADMIN_STATS.total_students} icon="school" color={Colors.adminColor} />
            <StatCard label="Open Tickets" value={ADMIN_STATS.open_tickets} icon="confirmation-number" color={Colors.warning} />
          </View>
        </>
      ) : (
        <View style={styles.statsRow}>
          <StatCard label="My Tickets" value={tickets.length} icon="confirmation-number" color={Colors.primary} />
          <StatCard label="Open" value={openCount} icon="pending" color={Colors.warning} />
          <StatCard label="In Progress" value={inProgressCount} icon="autorenew" color={Colors.info} />
        </View>
      )}

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <Pressable style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.8 }]} onPress={() => router.push('/new-ticket')}>
          <View style={[styles.qaIcon, { backgroundColor: Colors.primaryMuted }]}>
            <MaterialIcons name="add-circle-outline" size={22} color={Colors.primary} />
          </View>
          <Text style={styles.qaLabel}>New Ticket</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.8 }]} onPress={() => router.push('/(tabs)/rooms')}>
          <View style={[styles.qaIcon, { backgroundColor: Colors.successMuted }]}>
            <MaterialIcons name="bed" size={22} color={Colors.success} />
          </View>
          <Text style={styles.qaLabel}>Rooms</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.8 }]} onPress={() => router.push('/(tabs)/chat')}>
          <View style={[styles.qaIcon, { backgroundColor: Colors.infoMuted }]}>
            <MaterialIcons name="chat" size={22} color={Colors.info} />
          </View>
          <Text style={styles.qaLabel}>Chat</Text>
        </Pressable>
        {isAdmin ? (
          <Pressable style={({ pressed }) => [styles.quickAction, pressed && { opacity: 0.8 }]} onPress={() => router.push('/(tabs)/tickets')}>
            <View style={[styles.qaIcon, { backgroundColor: Colors.warningMuted }]}>
              <MaterialIcons name="assignment" size={22} color={Colors.warning} />
            </View>
            <Text style={styles.qaLabel}>All Tickets</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Recent Tickets */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Tickets</Text>
        <Pressable onPress={() => router.push('/(tabs)/tickets')}>
          <Text style={styles.seeAll}>See All</Text>
        </Pressable>
      </View>

      {recentTickets.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialIcons name="confirmation-number" size={40} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No tickets yet</Text>
        </View>
      ) : (
        recentTickets.map(ticket => (
          <TicketCard key={ticket.id} ticket={ticket} onPress={() => router.push({ pathname: '/ticket-detail', params: { id: ticket.id } })} />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  greeting: { fontSize: FontSize.sm, color: Colors.textSecondary },
  userName: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  roleBadgeWrap: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  notifBtn: { width: 38, height: 38, borderRadius: Radius.md, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  myRoomCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg, borderWidth: 1, borderColor: Colors.primary + '44', ...Shadow.sm },
  myRoomLeft: { flexDirection: 'row', alignItems: 'center' },
  myRoomLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 2 },
  myRoomNum: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: 4 },
  sectionTitle: { fontSize: FontSize.body, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, marginTop: Spacing.sm },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  seeAll: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  quickActions: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md, flexWrap: 'wrap' },
  quickAction: { alignItems: 'center', gap: 6, flex: 1, minWidth: 70 },
  qaIcon: { width: 52, height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '500', textAlign: 'center' },
  emptyState: { alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted },
});
