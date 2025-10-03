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

export interface RoadmapBatchTable {
  id: Generated<number>;
  batch_id: string;
  user_id: number;
  source: string;
  item_count: number;
  total_weight: number;
  stage: 'incoming' | 'collected' | 'sorting' | 'dismantling' | 'recovery' | 'completed';
  assigned_date: ColumnType<string, string | undefined, string>;
  notes: string;
  created_at: ColumnType<string, string | undefined, string>;
  updated_at: ColumnType<string, string | undefined, string>;
}

export interface RoadmapItemTable {
  id: Generated<number>;
  batch_id: number;
  item_type: string;
  quantity: number;
  condition: string;
}

export interface RoadmapHistoryTable {
  id: Generated<number>;
  batch_id: number;
  from_stage: string;
  to_stage: string;
  changed_by: string;
  changed_at: ColumnType<string, string | undefined, string>;
  notes: string;
}

export interface DB {
  users: UsersTable;
  pickups: PickupTable;
  roadmap_batches: RoadmapBatchTable;
  roadmap_items: RoadmapItemTable;
  roadmap_history: RoadmapHistoryTable;
}
