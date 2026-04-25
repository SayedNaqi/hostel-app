// Powered by OnSpace.AI
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, Pressable,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { Colors, FontSize, Radius, Spacing } from '@/constants/theme';
import { Message } from '@/services/mockData';

export default function ChatRoomScreen() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();
  const { getRoomMessages, sendMessage, markAsRead } = useChat();
  const [text, setText] = useState('');
  const flatRef = useRef<FlatList>(null);

  const messages = getRoomMessages(id || '');

  useEffect(() => {
    if (id) markAsRead(id);
  }, [id]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!text.trim() || !id) return;
    const content = text.trim();
    setText('');
    await sendMessage(id, content);
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMe = item.user_id === user?.id;
    const showAvatar = !isMe && (index === 0 || messages[index - 1]?.user_id !== item.user_id);

    return (
      <View style={[styles.msgRow, isMe && styles.msgRowMe]}>
        {!isMe ? (
          <View style={[styles.avatar, !showAvatar && { opacity: 0 }]}>
            <Text style={styles.avatarText}>{item.user_name[0].toUpperCase()}</Text>
          </View>
        ) : null}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          {showAvatar && !isMe ? (
            <Text style={styles.bubbleName}>
              {item.user_name}
              {item.user_role === 'admin' ? ' 🛡️' : ''}
            </Text>
          ) : null}
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>{item.content}</Text>
          <Text style={[styles.bubbleTime, isMe && { color: 'rgba(255,255,255,0.6)' }]}>{formatTime(item.created_at)}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Nav Bar */}
      <View style={[styles.navBar, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <MaterialIcons name="arrow-back" size={22} color={Colors.textPrimary} />
        </Pressable>
        <View style={styles.navCenter}>
          <Text style={styles.navTitle}>{name}</Text>
          <View style={styles.liveDot}><View style={styles.dotInner} /><Text style={styles.liveText}>Live</Text></View>
        </View>
        <View style={{ width: 38 }} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.msgList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textMuted}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
          blurOnSubmit={false}
        />
        <Pressable
          onPress={handleSend}
          style={({ pressed }) => [styles.sendBtn, !text.trim() && styles.sendBtnDisabled, pressed && { opacity: 0.8 }]}
          disabled={!text.trim()}
        >
          <MaterialIcons name="send" size={20} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.surfaceBorder, backgroundColor: Colors.surface },
  backBtn: { width: 38, height: 38, borderRadius: Radius.md, backgroundColor: Colors.surfaceElevated, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.surfaceBorder },
  navCenter: { alignItems: 'center' },
  navTitle: { fontSize: FontSize.body, fontWeight: '700', color: Colors.textPrimary },
  liveDot: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  dotInner: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  liveText: { fontSize: FontSize.xs, color: Colors.success },
  msgList: { padding: Spacing.md, gap: 8 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 4 },
  msgRowMe: { flexDirection: 'row-reverse' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.primaryMuted, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  avatarText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  bubble: { maxWidth: '75%', borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: 10 },
  bubbleOther: { backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.surfaceBorder, borderBottomLeftRadius: 4 },
  bubbleMe: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  bubbleName: { fontSize: FontSize.xs, fontWeight: '600', color: Colors.primary, marginBottom: 3 },
  bubbleText: { fontSize: FontSize.md, color: Colors.textPrimary, lineHeight: 21 },
  bubbleTextMe: { color: '#fff' },
  bubbleTime: { fontSize: 10, color: Colors.textMuted, marginTop: 4, alignSelf: 'flex-end' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm, paddingHorizontal: Spacing.md, paddingTop: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.surfaceBorder, backgroundColor: Colors.surface },
  input: { flex: 1, backgroundColor: Colors.surfaceElevated, borderRadius: Radius.lg, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: FontSize.md, color: Colors.textPrimary, maxHeight: 120, borderWidth: 1, borderColor: Colors.surfaceBorder },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: Colors.primaryMuted },
});
