import { ColumnType, Generated } from 'kysely';

export interface UsersTable {
  id: Generated<number>;
  name: string;
  email: string;
  password_hash: string;
  points: ColumnType<number, number | undefined, number>;
}

export interface PickupTable {
  id: Generated<number>;
  user_id: number;
  name: string;
  address: string;
  email: string;
  items_description: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  requested_at: ColumnType<string, string | undefined, string>;
}

export interface DB {
  users: UsersTable;
  pickups: PickupTable;
}
