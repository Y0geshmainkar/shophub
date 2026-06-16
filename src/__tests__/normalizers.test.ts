import { normalizeShopifyProduct, normalizeErpProduct, normalizeAuto, normalizeOrder } from '../data/normalizers';

const shopifyRaw = {
  product_id: 'SH-001',
  title: 'Photo Frame',
  variants: [{ price: '29.99', inventory_quantity: 10 }],
  status: 'active',
  product_type: 'Personalized',
  images: [{ src: 'https://example.com/img.jpg' }],
  body_html: '<p>A frame</p>',
  rating: 4.8,
  reviewCount: 50,
};

const erpRaw = {
  itemCode: 'ERP-001',
  itemName: 'Wine Glasses',
  unitPrice: 59.99,
  stockLevel: 5,
  available: true,
  category: 'Anniversary',
  imageUrls: ['https://example.com/img.jpg'],
  description: 'Crystal glasses',
  rating: 4.9,
  reviewCount: 100,
};

describe('normalizeShopifyProduct', () => {
  it('maps product_id to id', () => {
    expect(normalizeShopifyProduct(shopifyRaw).id).toBe('SH-001');
  });
  it('maps title to name', () => {
    expect(normalizeShopifyProduct(shopifyRaw).name).toBe('Photo Frame');
  });
  it('parses price from variants', () => {
    expect(normalizeShopifyProduct(shopifyRaw).price).toBe(29.99);
  });
  it('maps inventory_quantity to stock', () => {
    expect(normalizeShopifyProduct(shopifyRaw).stock).toBe(10);
  });
  it('sets available true when status=active and stock>0', () => {
    expect(normalizeShopifyProduct(shopifyRaw).available).toBe(true);
  });
  it('sets available false when status=draft', () => {
    const p = normalizeShopifyProduct({ ...shopifyRaw, status: 'draft' });
    expect(p.available).toBe(false);
  });
  it('strips HTML from body_html', () => {
    expect(normalizeShopifyProduct(shopifyRaw).description).toBe('A frame');
  });
  it('sets sourceSystem to Shopify', () => {
    expect(normalizeShopifyProduct(shopifyRaw).sourceSystem).toBe('Shopify');
  });
});

describe('normalizeErpProduct', () => {
  it('maps itemCode to id', () => {
    expect(normalizeErpProduct(erpRaw).id).toBe('ERP-001');
  });
  it('maps itemName to name', () => {
    expect(normalizeErpProduct(erpRaw).name).toBe('Wine Glasses');
  });
  it('maps unitPrice to price', () => {
    expect(normalizeErpProduct(erpRaw).price).toBe(59.99);
  });
  it('maps stockLevel to stock', () => {
    expect(normalizeErpProduct(erpRaw).stock).toBe(5);
  });
  it('sets available false when stockLevel=0', () => {
    const p = normalizeErpProduct({ ...erpRaw, stockLevel: 0 });
    expect(p.available).toBe(false);
  });
  it('sets sourceSystem to ERP', () => {
    expect(normalizeErpProduct(erpRaw).sourceSystem).toBe('ERP');
  });
});

describe('normalizeAuto', () => {
  it('detects Shopify by product_id', () => {
    expect(normalizeAuto(shopifyRaw as Record<string, unknown>).sourceSystem).toBe('Shopify');
  });
  it('detects ERP by itemCode', () => {
    expect(normalizeAuto(erpRaw as Record<string, unknown>).sourceSystem).toBe('ERP');
  });
});

describe('normalizeOrder', () => {
  const product = normalizeErpProduct(erpRaw);
  const raw = {
    id: 'ORD-001', status: 'delivered', placedAt: '2026-01-01T00:00:00Z',
    total: 59.99, sourceSystem: 'ERP',
    items: [{ product, quantity: 1 }],
  };
  it('maps id', () => { expect(normalizeOrder(raw as Record<string, unknown>).id).toBe('ORD-001'); });
  it('maps status', () => { expect(normalizeOrder(raw as Record<string, unknown>).status).toBe('delivered'); });
  it('maps total', () => { expect(normalizeOrder(raw as Record<string, unknown>).total).toBe(59.99); });
});
