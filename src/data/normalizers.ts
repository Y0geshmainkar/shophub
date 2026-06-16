import type { Product, SourceSystem } from '../types/product';
import type { Order } from '../types/order';
import type { CartEntry } from '../types/cart';

interface ShopifyRaw {
  product_id: string;
  title: string;
  variants: { price: string; inventory_quantity: number }[];
  status: string;
  product_type: string;
  images: { src: string }[];
  body_html: string;
  rating?: number;
  reviewCount?: number;
  originalPrice?: number;
}

interface ErpRaw {
  itemCode: string;
  itemName: string;
  unitPrice: number;
  stockLevel: number;
  available: boolean;
  category: string;
  imageUrls: string[];
  description: string;
  rating?: number;
  reviewCount?: number;
  originalPrice?: number;
}

export function normalizeShopifyProduct(raw: ShopifyRaw): Product {
  const variant = raw.variants[0] ?? { price: '0', inventory_quantity: 0 };
  return {
    id: raw.product_id,
    name: raw.title,
    price: parseFloat(variant.price),
    originalPrice: raw.originalPrice,
    stock: variant.inventory_quantity,
    available: raw.status === 'active' && variant.inventory_quantity > 0,
    category: raw.product_type,
    images: raw.images.map(i => i.src),
    description: raw.body_html.replace(/<[^>]+>/g, ''),
    rating: raw.rating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
    sourceSystem: 'Shopify',
  };
}

export function normalizeErpProduct(raw: ErpRaw): Product {
  return {
    id: raw.itemCode,
    name: raw.itemName,
    price: raw.unitPrice,
    originalPrice: raw.originalPrice,
    stock: raw.stockLevel,
    available: raw.available && raw.stockLevel > 0,
    category: raw.category,
    images: raw.imageUrls,
    description: raw.description,
    rating: raw.rating ?? 0,
    reviewCount: raw.reviewCount ?? 0,
    sourceSystem: 'ERP',
  };
}

export function normalizeProduct(raw: ShopifyRaw | ErpRaw, sourceSystem: SourceSystem): Product {
  if (sourceSystem === 'Shopify') return normalizeShopifyProduct(raw as ShopifyRaw);
  return normalizeErpProduct(raw as ErpRaw);
}

export function normalizeAuto(raw: Record<string, unknown>): Product {
  if ('product_id' in raw) return normalizeShopifyProduct(raw as unknown as ShopifyRaw);
  return normalizeErpProduct(raw as unknown as ErpRaw);
}

export function normalizeOrder(raw: Record<string, unknown>): Order {
  return {
    id: String(raw.id),
    status: raw.status as Order['status'],
    items: raw.items as CartEntry[],
    total: Number(raw.total),
    placedAt: String(raw.placedAt),
    sourceSystem: raw.sourceSystem as Order['sourceSystem'],
  };
}
