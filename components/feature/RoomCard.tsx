// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Colors, FontSize, Radius, Shadow, Spacing } from '@/constants/theme';
import { Room } from '@/services/mockData';

interface RoomCardProps {
  room: Room;
  onBook?: (roomId: string) => void;
  showBookButton?: boolean;
  isBooking?: boolean;
}

const TYPE_LABELS: Record<Room['type'], string> = { single: 'Single', double: 'Double', quad: 'Quad' };

export function RoomCard({ room, onBook, showBookButton = false, isBooking = false }: RoomCardProps) {
  const priceFormatted = new Intl.NumberFormat('fa-IR').format(room.price_per_month) + ' ﷼';

  return (
    <View style={[styles.card, Shadow.sm]}>
      <Image
        source={{ uri: room.image_url || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80' }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.roomNum}>Room {room.room_number}</Text>
            <Text style={styles.floor}>Floor {room.floor} · {TYPE_LABELS[room.type]}</Text>
          </View>
          <Badge variant={room.status} />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <MaterialIcons name="people" size={14} color={Colors.textMuted} />
            <Text style={styles.statText}>{room.occupied}/{room.capacity} occupied</Text>
          </View>
          <View style={styles.stat}>
            <MaterialIcons name="payments" size={14} color={Colors.textMuted} />
            <Text style={styles.statText}>{priceFormatted}/mo</Text>
          </View>
        </View>

        <View style={styles.amenities}>
          {room.amenities.map(a => (
            <View key={a} style={styles.chip}>
              <Text style={styles.chipText}>{a}</Text>
            </View>
          ))}
        </View>

        {showBookButton && room.status === 'available' ? (
          <Button
            label="Book This Room"
            onPress={() => onBook?.(room.id)}
            loading={isBooking}
            fullWidth
            style={{ marginTop: Spacing.sm }}
          />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  image: { width: '100%', height: 140 },
  body: { padding: Spacing.md },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.sm },
  roomNum: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  floor: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.sm },
  stat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: Colors.surfaceElevated, paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  chipText: { fontSize: FontSize.xs, color: Colors.textSecondary },
});
