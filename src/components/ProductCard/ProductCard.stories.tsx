import type { Meta, StoryObj } from '@storybook/react';
import { ProductCard } from './ProductCard';

const base = {
  id: 'P1', name: 'Custom Engraved Photo Frame', price: 29.99, stock: 18,
  available: true, category: 'Personalized',
  images: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400'],
  description: 'Beautiful wooden frame with custom engraving.',
  rating: 4.8, reviewCount: 124, sourceSystem: 'Shopify' as const,
};

const meta: Meta<typeof ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
};
export default meta;

type Story = StoryObj<typeof ProductCard>;

export const Available: Story = { args: { product: base } };

export const OutOfStock: Story = {
  args: { product: { ...base, available: false, stock: 0 } },
};

export const OnSale: Story = {
  args: { product: { ...base, price: 19.99, originalPrice: 29.99 } },
};
