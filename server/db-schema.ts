import { Generated } from 'kysely';

export interface PickupTable {
  id: Generated<number>;
  name: string;
  address: string;
  email: string;
  phone: string | null;
  items_description: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  requested_at: string;
}

export interface DB {
  pickups: PickupTable;
}
