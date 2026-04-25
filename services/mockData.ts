// Powered by OnSpace.AI
// Mock data structured to mirror real Supabase schema

export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  room_number: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
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
  created_at: string;
  updated_at: string;
  assigned_to: string | null;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  user_name: string;
  user_role: UserRole;
  content: string;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'general' | 'support' | 'announcements';
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export const MOCK_USERS: Record<string, User & { password: string }> = {
  'student@hostel.com': {
    id: 'usr_001',
    email: 'student@hostel.com',
    password: '123456',
    full_name: 'Ali Rezaei',
    role: 'student',
    room_number: '204',
    avatar_url: null,
    phone: '+98 912 345 6789',
    created_at: '2024-09-01T00:00:00Z',
  },
  'admin@hostel.com': {
    id: 'usr_admin',
    email: 'admin@hostel.com',
    password: '123456',
    full_name: 'Sara Mohammadi',
    role: 'admin',
    room_number: null,
    avatar_url: null,
    phone: '+98 21 1234 5678',
    created_at: '2024-01-01T00:00:00Z',
  },
};

export const MOCK_ROOMS: Room[] = [
  {
    id: 'room_101', room_number: '101', floor: 1, capacity: 1, occupied: 1,
    type: 'single', status: 'occupied', price_per_month: 2500000,
    amenities: ['WiFi', 'AC', 'Private Bath'],
    image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
  },
  {
    id: 'room_102', room_number: '102', floor: 1, capacity: 1, occupied: 0,
    type: 'single', status: 'available', price_per_month: 2500000,
    amenities: ['WiFi', 'AC', 'Private Bath'],
    image_url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80',
  },
  {
    id: 'room_201', room_number: '201', floor: 2, capacity: 2, occupied: 2,
    type: 'double', status: 'occupied', price_per_month: 1800000,
    amenities: ['WiFi', 'AC', 'Shared Bath'],
    image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80',
  },
  {
    id: 'room_202', room_number: '202', floor: 2, capacity: 2, occupied: 1,
    type: 'double', status: 'available', price_per_month: 1800000,
    amenities: ['WiFi', 'AC', 'Shared Bath'],
    image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80',
  },
  {
    id: 'room_204', room_number: '204', floor: 2, capacity: 2, occupied: 2,
    type: 'double', status: 'occupied', price_per_month: 1800000,
    amenities: ['WiFi', 'AC', 'Balcony'],
    image_url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400&q=80',
  },
  {
    id: 'room_301', room_number: '301', floor: 3, capacity: 4, occupied: 2,
    type: 'quad', status: 'available', price_per_month: 1200000,
    amenities: ['WiFi', 'Fan', 'Shared Bath'],
    image_url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80',
  },
  {
    id: 'room_303', room_number: '303', floor: 3, capacity: 4, occupied: 0,
    type: 'quad', status: 'maintenance', price_per_month: 1200000,
    amenities: ['WiFi', 'Fan', 'Shared Bath'],
    image_url: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=400&q=80',
  },
];

export const MOCK_TICKETS: Ticket[] = [
  {
    id: 'tkt_001', user_id: 'usr_001', user_name: 'Ali Rezaei',
    title: 'AC not working in room 204',
    description: 'The air conditioner has been broken for 3 days. It makes noise but does not cool.',
    category: 'maintenance', priority: 'high', status: 'in_progress',
    room_number: '204', created_at: '2026-04-20T09:00:00Z', updated_at: '2026-04-21T14:00:00Z',
    assigned_to: 'Sara Mohammadi',
  },
  {
    id: 'tkt_002', user_id: 'usr_001', user_name: 'Ali Rezaei',
    title: 'Request for extra blanket',
    description: 'I need an extra blanket for the winter season.',
    category: 'request', priority: 'low', status: 'open',
    room_number: '204', created_at: '2026-04-22T08:00:00Z', updated_at: '2026-04-22T08:00:00Z',
    assigned_to: null,
  },
  {
    id: 'tkt_003', user_id: 'usr_003', user_name: 'Reza Ahmadi',
    title: 'Water leak under sink in bathroom 2',
    description: 'There is water leaking from the pipe under the sink. Need urgent repair.',
    category: 'maintenance', priority: 'high', status: 'open',
    room_number: '301', created_at: '2026-04-22T07:30:00Z', updated_at: '2026-04-22T07:30:00Z',
    assigned_to: null,
  },
  {
    id: 'tkt_004', user_id: 'usr_004', user_name: 'Maryam Hosseini',
    title: 'Noise complaint - neighbors',
    description: 'Residents in room 203 are very noisy late at night.',
    category: 'complaint', priority: 'medium', status: 'resolved',
    room_number: '204', created_at: '2026-04-18T22:00:00Z', updated_at: '2026-04-19T10:00:00Z',
    assigned_to: 'Sara Mohammadi',
  },
];

export const MOCK_CHAT_ROOMS: ChatRoom[] = [
  {
    id: 'chat_general', name: 'General Chat', type: 'general',
    last_message: 'Welcome everyone to the new semester!',
    last_message_at: '2026-04-22T10:00:00Z', unread_count: 3,
  },
  {
    id: 'chat_support', name: 'Support Channel', type: 'support',
    last_message: 'Your ticket has been assigned to maintenance team.',
    last_message_at: '2026-04-22T09:30:00Z', unread_count: 1,
  },
  {
    id: 'chat_announce', name: 'Announcements', type: 'announcements',
    last_message: 'Hostel inspection scheduled for April 25th.',
    last_message_at: '2026-04-21T16:00:00Z', unread_count: 0,
  },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
  chat_general: [
    { id: 'm1', room_id: 'chat_general', user_id: 'usr_admin', user_name: 'Sara (Admin)', user_role: 'admin', content: 'Welcome everyone to the new semester! Please make sure to review the hostel rules.', created_at: '2026-04-20T09:00:00Z' },
    { id: 'm2', room_id: 'chat_general', user_id: 'usr_003', user_name: 'Reza', user_role: 'student', content: 'Thank you! When is the orientation session?', created_at: '2026-04-20T09:15:00Z' },
    { id: 'm3', room_id: 'chat_general', user_id: 'usr_admin', user_name: 'Sara (Admin)', user_role: 'admin', content: 'Orientation is on April 24th at 3 PM in the common room.', created_at: '2026-04-20T09:20:00Z' },
    { id: 'm4', room_id: 'chat_general', user_id: 'usr_001', user_name: 'Ali', user_role: 'student', content: 'Great, I will be there!', created_at: '2026-04-20T09:25:00Z' },
    { id: 'm5', room_id: 'chat_general', user_id: 'usr_004', user_name: 'Maryam', user_role: 'student', content: 'Welcome everyone to the new semester!', created_at: '2026-04-22T10:00:00Z' },
  ],
  chat_support: [
    { id: 's1', room_id: 'chat_support', user_id: 'usr_admin', user_name: 'Sara (Admin)', user_role: 'admin', content: 'Hello! How can we help you today?', created_at: '2026-04-22T08:00:00Z' },
    { id: 's2', room_id: 'chat_support', user_id: 'usr_001', user_name: 'Ali', user_role: 'student', content: 'My AC is not working. I submitted a ticket.', created_at: '2026-04-22T09:20:00Z' },
    { id: 's3', room_id: 'chat_support', user_id: 'usr_admin', user_name: 'Sara (Admin)', user_role: 'admin', content: 'Your ticket has been assigned to maintenance team.', created_at: '2026-04-22T09:30:00Z' },
  ],
  chat_announce: [
    { id: 'a1', room_id: 'chat_announce', user_id: 'usr_admin', user_name: 'Sara (Admin)', user_role: 'admin', content: 'Hostel inspection scheduled for April 25th. Please keep your rooms tidy.', created_at: '2026-04-21T16:00:00Z' },
    { id: 'a2', room_id: 'chat_announce', user_id: 'usr_admin', user_name: 'Sara (Admin)', user_role: 'admin', content: 'Wifi maintenance on April 23rd from 2-4 AM. Brief interruption expected.', created_at: '2026-04-22T11:00:00Z' },
  ],
};

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk_001', user_id: 'usr_001', room_id: 'room_204', room_number: '204',
    check_in: '2026-09-01', check_out: null, status: 'active',
    total_amount: 1800000, created_at: '2026-08-15T00:00:00Z',
  },
];

export const ADMIN_STATS = {
  total_rooms: 7,
  available_rooms: 3,
  occupied_rooms: 3,
  maintenance_rooms: 1,
  total_students: 28,
  open_tickets: 2,
  monthly_revenue: 52400000,
};
