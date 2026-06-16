import type { Product } from './product';

export interface CartEntry {
  product: Product;
  quantity: number;
}
