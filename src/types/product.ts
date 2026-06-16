export type SourceSystem = 'Shopify' | 'ERP';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  stock: number;
  available: boolean;
  category: string;
  images: string[];
  description: string;
  sourceSystem: SourceSystem;
}
