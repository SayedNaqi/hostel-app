// Powered by OnSpace.AI
import React from 'react';
import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useChat } from '@/hooks/useChat';
import { Colors, FontSize, Radius, Shadow, Spacing } from '@/constants/theme';
import { ChatRoom } from '@/services/mockData';

const ROOM_ICONS: Record<ChatRoom['type'], keyof typeof MaterialIcons.glyphMap> = {
  general: 'forum',
  support: 'support-agent',
  announcements: 'campaign',
};

const ROOM_COLORS: Record<ChatRoom['type'], string> = {
  general: Colors.primary,
  support: Colors.success,
  announcements: Colors.warning,
};

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { chatRooms } = useChat();

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderRoom = ({ item }: { item: ChatRoom }) => {
    const color = ROOM_COLORS[item.type];
    return (
      <Pressable
        onPress={() => router.push({ pathname: '/chat-room', params: { id: item.id, name: item.name } })}
        style={({ pressed }) => [styles.roomCard, pressed && { opacity: 0.85 }]}
      >
        <View style={[styles.roomIcon, { backgroundColor: color + '22' }]}>
          <MaterialIcons name={ROOM_ICONS[item.type]} size={24} color={color} />
        </View>
        <View style={styles.roomInfo}>
          <View style={styles.roomTop}>
            <Text style={styles.roomName}>{item.name}</Text>
            <Text style={styles.roomTime}>{formatTime(item.last_message_at)}</Text>
          </View>
          <View style={styles.roomBottom}>
            <Text style={styles.lastMsg} numberOfLines={1}>{item.last_message}</Text>
            {item.unread_count > 0 ? (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread_count}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Messages</Text>
        <View style={styles.onlineIndicator}>
          <View style={styles.dot} />
          <Text style={styles.onlineText}>Live</Text>
        </View>
      </View>

      <FlatList
        data={chatRooms}
        keyExtractor={item => item.id}
        renderItem={renderRoom}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder },
  pageTitle: { fontSize: FontSize.xxl, fontWeight: '700', color: Colors.textPrimary },
  onlineIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: Colors.successMuted, paddingHorizontal: 10, paddingVertical: 5, borderRadius: Radius.full },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
  onlineText: { fontSize: FontSize.xs, color: Colors.success, fontWeight: '600' },
  list: { padding: Spacing.md },
  roomCard: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.surfaceBorder, ...Shadow.sm },
  roomIcon: { width: 52, height: 52, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md },
  roomInfo: { flex: 1 },
  roomTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  roomName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textPrimary },
  roomTime: { fontSize: FontSize.xs, color: Colors.textMuted },
  roomBottom: { flexDirection: 'row', alignItems: 'center' },
  lastMsg: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary },
  unreadBadge: { backgroundColor: Colors.primary, borderRadius: Radius.full, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  unreadText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  separator: { height: Spacing.sm },
});
