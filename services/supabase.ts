// Powered by OnSpace.AI
import { getSupabaseClient } from '@/template';

export const supabase = getSupabaseClient();

// ─── Types ──────────────────────────────────────────────────────────────
export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  full_name: string | null;
  role: UserRole;
  room_number: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export interface Room {
  id: string;
  room_number: string;
  floor: number;
  capacity: number;
  occupied: number;
  type: 'single' | 'double' | 'quad';
  status: 'available' | 'occupied' | 'maintenance';
  price_per_month: number;
  amenities: string[];
  image_url: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  room_id: string;
  room_number: string;
  check_in: string;
  check_out: string | null;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  total_amount: number;
  created_at: string;
}

export interface Ticket {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  description: string;
  category: 'maintenance' | 'complaint' | 'request' | 'other';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  room_number: string | null;
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'general' | 'support' | 'announcements';
  last_message: string;
  last_message_at: string;
  unread_count?: number;
}

export interface Message {
  id: string;
  chat_room_id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  content: string;
  created_at: string;
}
