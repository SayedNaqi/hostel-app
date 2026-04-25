// Powered by OnSpace.AI
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import { useRooms } from '@/hooks/useRooms';
import { useAlert } from '@/template';
import { RoomCard } from '@/components/feature/RoomCard';
import { StatCard } from '@/components/ui/StatCard';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { Room } from '@/services/mockData';

type FilterType = 'all' | 'available' | 'occupied' | 'maintenance';
type TypeFilter = 'all' | 'single' | 'double' | 'quad';

export default function RoomsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { rooms, stats, bookRoom, isBooking, myBooking } = useRooms();
  const { showAlert } = useAlert();
  const [statusFilter, setStatusFilter] = useState<FilterType>('all');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const isAdmin = user?.role === 'admin';

  const filtered = rooms.filter(r => {
    const statusOk = statusFilter === 'all' || r.status === statusFilter;
    const typeOk = typeFilter === 'all' || r.type === typeFilter;
    return statusOk && typeOk;
  });

  const handleBook = async (roomId: string) => {
    if (myBooking) {
      showAlert('Already Booked', 'You already have an active booking. Contact admin to change rooms.');
      return;
    }
    showAlert(
      'Confirm Booking',
      'Submit a booking request for this room?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Book', style: 'default', onPress: async () => {
            const result = await bookRoom(roomId);
            if (result.success) {
              showAlert('Request Submitted', 'Your booking request has been submitted and is pending admin approval.');
            } else {
              showAlert('Error', result.error || 'Could not complete booking');
            }
          }
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.md, paddingBottom: Spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <Text style={styles.pageTitle}>
        {isAdmin ? 'Room Management' : 'Available Rooms'}
      </Text>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatCard label="Total" value={stats.total} icon="domain" color={Colors.primary} />
        <StatCard label="Available" value={stats.available} icon="check-circle" color={Colors.success} />
        <StatCard label="Occupied" value={stats.occupied} icon="person" color={Colors.danger} />
      </View>

      {/* Status Filter */}
      <Text style={styles.filterLabel}>Status</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ gap: 8, paddingRight: Spacing.md }}>
        {(['all', 'available', 'occupied', 'maintenance'] as FilterType[]).map(f => (
          <Pressable
            key={f}
            onPress={() => setStatusFilter(f)}
            style={[styles.chip, statusFilter === f && styles.chipActive]}
          >
            <Text style={[styles.chipText, statusFilter === f && styles.chipTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Type Filter */}
      <Text style={styles.filterLabel}>Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{ gap: 8, paddingRight: Spacing.md }}>
        {(['all', 'single', 'double', 'quad'] as TypeFilter[]).map(f => (
          <Pressable
            key={f}
            onPress={() => setTypeFilter(f)}
            style={[styles.chip, typeFilter === f && styles.chipActive]}
          >
            <Text style={[styles.chipText, typeFilter === f && styles.chipTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Room List */}
      <Text style={styles.resultCount}>{filtered.length} room{filtered.length !== 1 ? 's' : ''} found</Text>

      {filtered.map(room => (
        <RoomCard
          key={room.id}
          room={room}
          onBook={handleBook}
          showBookButton={!isAdmin}
          isBooking={isBooking}
        />
      ))}

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <MaterialIcons name="search-off" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No rooms match the filter</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Spacing.md },
  pageTitle: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
  statsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  filterLabel: { fontSize: FontSize.sm, fontWeight: '500', color: Colors.textSecondary, marginBottom: 8 },
  filterRow: { marginBottom: Spacing.md },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.surfaceBorder },
  chipActive: { backgroundColor: Colors.primaryMuted, borderColor: Colors.primary },
  chipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.primaryLight },
  resultCount: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.sm },
  empty: { alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted },
});
