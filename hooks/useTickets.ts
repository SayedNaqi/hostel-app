// Powered by OnSpace.AI
import { useState, useCallback } from 'react';
import { Ticket, MOCK_TICKETS } from '@/services/mockData';
import { useAuth } from './useAuth';

export function useTickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [isLoading, setIsLoading] = useState(false);

  const myTickets = user?.role === 'admin'
    ? tickets
    : tickets.filter(t => t.user_id === user?.id);

  const createTicket = useCallback(async (data: {
    title: string;
    description: string;
    category: Ticket['category'];
    priority: Ticket['priority'];
  }) => {
    if (!user) return;
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const newTicket: Ticket = {
      id: `tkt_${Date.now()}`,
      user_id: user.id,
      user_name: user.full_name,
      ...data,
      status: 'open',
      room_number: user.room_number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      assigned_to: null,
    };
    setTickets(prev => [newTicket, ...prev]);
    setIsLoading(false);
    return newTicket;
  }, [user]);

  const updateStatus = useCallback(async (id: string, status: Ticket['status']) => {
    setTickets(prev => prev.map(t =>
      t.id === id ? { ...t, status, updated_at: new Date().toISOString() } : t
    ));
  }, []);

  return { tickets: myTickets, allTickets: tickets, isLoading, createTicket, updateStatus };
}
