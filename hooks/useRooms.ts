// Powered by OnSpace.AI
import { useState, useCallback } from 'react';
import { Room, Booking, MOCK_ROOMS, MOCK_BOOKINGS } from '@/services/mockData';
import { useAuth } from './useAuth';

export function useRooms() {
  const { user } = useAuth();
  const [rooms] = useState<Room[]>(MOCK_ROOMS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [isBooking, setIsBooking] = useState(false);

  const myBooking = bookings.find(b => b.user_id === user?.id && b.status === 'active');

  const bookRoom = useCallback(async (roomId: string) => {
    if (!user) return { success: false, error: 'Not logged in' };
    const room = rooms.find(r => r.id === roomId);
    if (!room) return { success: false, error: 'Room not found' };
    if (room.status !== 'available') return { success: false, error: 'Room is not available' };

    setIsBooking(true);
    await new Promise(r => setTimeout(r, 800));

    const newBooking: Booking = {
      id: `bk_${Date.now()}`,
      user_id: user.id,
      room_id: room.id,
      room_number: room.room_number,
      check_in: new Date().toISOString().split('T')[0],
      check_out: null,
      status: 'pending',
      total_amount: room.price_per_month,
      created_at: new Date().toISOString(),
    };

    setBookings(prev => [...prev, newBooking]);
    setIsBooking(false);
    return { success: true, booking: newBooking };
  }, [user, rooms]);

  const availableRooms = rooms.filter(r => r.status === 'available');
  const occupiedCount = rooms.filter(r => r.status === 'occupied').length;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;

  return {
    rooms,
    availableRooms,
    bookings,
    myBooking,
    isBooking,
    bookRoom,
    stats: {
      total: rooms.length,
      available: availableRooms.length,
      occupied: occupiedCount,
      maintenance: maintenanceCount,
    },
  };
}
