export interface User {
  id: number;
  name: string;
  email: string;
  points: number;
}

export interface Pickup {
  id: number;
  user_id: number;
  name: string;
  address: string;
  email: string;
  items_description: string;
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled';
  requested_at: string;
}

export interface RoadmapItem {
  id: number;
  batch_id: number;
  item_type: string;
  quantity: number;
  condition: string;
}

export interface RoadmapHistory {
  id: number;
  batch_id: number;
  from_stage: string;
  to_stage: string;
  changed_by: string;
  changed_at: string;
  notes: string;
}

export interface RoadmapBatch {
  id: number;
  batch_id: string;
  user_id: number;
  source: string;
  item_count: number;
  total_weight: number;
  stage: 'incoming' | 'collected' | 'sorting' | 'dismantling' | 'recovery' | 'completed';
  assigned_date: string;
  notes: string;
  created_at: string;
  updated_at: string;
  items?: RoadmapItem[];
  history?: RoadmapHistory[];
}

export type RoadmapStage = 'incoming' | 'collected' | 'sorting' | 'dismantling' | 'recovery' | 'completed';
