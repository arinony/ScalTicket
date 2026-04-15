import { create } from 'zustand';
import api from '../api/axiosConfig';

// --- TYPES ---

interface Event {
  id: string;
  title: string;
  artist: string;
  price: number;
  available: number;
  totalSlots: number;
  location: string;
  date: string;
  image: string;
  category?: string;
}

interface Order {
  id: string;
  status: string;
  // Ajout de l'ID ici pour satisfaire le filtrage TypeScript
  user?: { id: string; name: string; email: string }; 
  event?: { title: string; price?: number };
  eventId: string;
}

interface TicketState {
  events: Event[];
  orders: Order[];
  isInQueue: boolean;      
  queuePosition: number;
  myTicketsCount: number; 
  isLoading: boolean;
  
  fetchEvents: () => Promise<void>;
  addEvent: (eventData: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  uploadEventImage: (file: File) => Promise<string>;

  fetchAllOrders: () => Promise<void>;
  fetchMyTicketsCount: () => Promise<void>; 
  cancelOrder: (orderId: string) => Promise<void>;
  buyTicket: (eventId: string) => Promise<void>;
}

// --- STORE ---

export const useTicketStore = create<TicketState>((set) => ({
  events: [],
  orders: [],
  myTicketsCount: 0,
  isLoading: false,
  isInQueue: false,       
  queuePosition: 0,

  fetchEvents: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/events');
      set({ events: response.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  /**
   * RÉSOLUTION ERREUR 404 :
   * On utilise la route intelligente /all. 
   * Le backend renverra uniquement les billets du client si celui-ci n'est pas admin.
   */
  fetchMyTicketsCount: async () => {
    try {
      const response = await api.get('/orders/all'); 
      set({ myTicketsCount: response.data.length });
    } catch (error) {
      console.error("Erreur lors de la récupération du compte panier:", error);
    }
  },

  buyTicket: async (eventId: string) => {
    try {
      await api.post('/orders/buy', { eventId });
      
      // Mise à jour du compteur
      set((state) => ({ myTicketsCount: state.myTicketsCount + 1 }));

      // Rafraîchir les stocks
      const response = await api.get('/events');
      set({ events: response.data });
    } catch (error) {
      console.error("Erreur achat ticket:", error);
      throw error;
    }
  },

  addEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      set((state) => ({ events: [...state.events, response.data] }));
    } catch (error) {
      throw error;
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      set((state) => ({
        events: state.events.map((ev) => (ev.id === id ? response.data : ev)),
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteEvent: async (id) => {
    try {
      await api.delete(`/events/${id}`);
      set((state) => ({
        events: state.events.filter((ev) => ev.id !== id),
      }));
    } catch (error) {
      throw error;
    }
  },

  /**
   * RÉSOLUTION ERREUR 403 :
   * Maintenant que 'adminOnly' est retiré du backend pour cette route,
   * cette fonction marchera pour TOUT LE MONDE.
   */
  fetchAllOrders: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/orders/all'); 
      set({ orders: response.data, isLoading: false });
    } catch (error: any) {
      console.error("Erreur chargement commandes", error);
      set({ isLoading: false });
    }
  },

  cancelOrder: async (orderId: string) => {
    try {
      // Correspondance exacte avec router.patch('/:id/cancel')
      await api.patch(`/orders/${orderId}/cancel`);
      
      set((state) => ({
        myTicketsCount: Math.max(0, state.myTicketsCount - 1),
        orders: state.orders.map((order) => 
          order.id === orderId ? { ...order, status: 'CANCELLED' } : order
        )
      }));
    } catch (error) {
      console.error("Erreur store annulation:", error);
      throw error;
    }
  },

  uploadEventImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await api.post('/events/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.image;
    } catch (error) {
      throw new Error("Échec de l'upload.");
    }
  },
}));