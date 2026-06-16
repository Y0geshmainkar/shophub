import type { Product, SourceSystem } from '../types/product';

// ── Shopify raw shape ──────────────────────────────────────────────────────
interface ShopifyRaw {
  product_id: string;
  title: string;
  variants: { price: string; inventory_quantity: number }[];
  status: string;
  product_type: string;
  images: { src: string }[];
  body_html: string;
}

// ── ERP raw shape ──────────────────────────────────────────────────────────
interface ErpRaw {
  itemCode: string;
  itemName: string;
  unitPrice: number;
  stockLevel: number;
  available: boolean;
  category: string;
  imageUrls: string[];
  description: string;
}

export function normalizeShopifyProduct(raw: ShopifyRaw): Product {
  const variant = raw.variants[0] ?? { price: '0', inventory_quantity: 0 };
  return {
    id: raw.product_id,
    name: raw.title,
    price: parseFloat(variant.price),
    stock: variant.inventory_quantity,
    available: raw.status === 'active' && variant.inventory_quantity > 0,
    category: raw.product_type,
    images: raw.images.map(i => i.src),
    description: raw.body_html.replace(/<[^>]+>/g, ''),
    sourceSystem: 'Shopify',
  };
}

export function normalizeErpProduct(raw: ErpRaw): Product {
  return {
    id: raw.itemCode,
    name: raw.itemName,
    price: raw.unitPrice,
    stock: raw.stockLevel,
    available: raw.available && raw.stockLevel > 0,
    category: raw.category,
    images: raw.imageUrls,
    description: raw.description,
    sourceSystem: 'ERP',
  };
}

export function normalizeProduct(raw: ShopifyRaw | ErpRaw, sourceSystem: SourceSystem): Product {
  if (sourceSystem === 'Shopify') return normalizeShopifyProduct(raw as ShopifyRaw);
  return normalizeErpProduct(raw as ErpRaw);
}
