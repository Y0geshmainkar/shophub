import type { CartEntry } from './cart';
import type { SourceSystem } from './product';

export interface Order {
  id: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  items: CartEntry[];
  total: number;
  placedAt: string;
  sourceSystem: SourceSystem;
}
