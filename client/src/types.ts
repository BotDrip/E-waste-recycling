export interface Pickup {
  id: number;
  name: string;
  address: string;
  email: string;
  phone?: string;
  items_description: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  requested_at: string;
}
