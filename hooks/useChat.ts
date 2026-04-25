// Powered by OnSpace.AI
import { useState, useCallback } from 'react';
import { Message, ChatRoom, MOCK_CHAT_ROOMS, MOCK_MESSAGES } from '@/services/mockData';
import { useAuth } from './useAuth';

export function useChat() {
  const { user } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(MOCK_CHAT_ROOMS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(MOCK_MESSAGES);

  const sendMessage = useCallback(async (roomId: string, content: string) => {
    if (!user || !content.trim()) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      room_id: roomId,
      user_id: user.id,
      user_name: user.full_name,
      user_role: user.role,
      content: content.trim(),
      created_at: new Date().toISOString(),
    };

    setMessages(prev => ({
      ...prev,
      [roomId]: [...(prev[roomId] || []), newMessage],
    }));

    setChatRooms(prev => prev.map(r =>
      r.id === roomId
        ? { ...r, last_message: content.trim(), last_message_at: new Date().toISOString(), unread_count: 0 }
        : r
    ));
  }, [user]);

  const markAsRead = useCallback((roomId: string) => {
    setChatRooms(prev => prev.map(r =>
      r.id === roomId ? { ...r, unread_count: 0 } : r
    ));
  }, []);

  const getRoomMessages = useCallback((roomId: string) => {
    return messages[roomId] || [];
  }, [messages]);

  const totalUnread = chatRooms.reduce((sum, r) => sum + r.unread_count, 0);

  return { chatRooms, getRoomMessages, sendMessage, markAsRead, totalUnread };
}
