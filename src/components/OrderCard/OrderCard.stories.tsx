import type { Meta, StoryObj } from '@storybook/react';
import { OrderCard } from './OrderCard';

const product = {
  id: 'ERP-001', name: 'Anniversary Wine Glasses', price: 59.99, stock: 9,
  available: true, category: 'Anniversary',
  images: ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400'],
  description: 'Engraved crystal wine glasses for couples.',
  rating: 4.9, reviewCount: 156, sourceSystem: 'ERP' as const,
};

const base = {
  id: 'ORD-2026-00142', total: 59.99, placedAt: '2026-06-10T10:30:00Z',
  sourceSystem: 'ERP' as const, items: [{ product, quantity: 1 }],
};

const meta: Meta<typeof OrderCard> = {
  title: 'Components/OrderCard',
  component: OrderCard,
};
export default meta;

type Story = StoryObj<typeof OrderCard>;

export const Pending:   Story = { args: { order: { ...base, status: 'pending' } } };
export const Confirmed: Story = { args: { order: { ...base, status: 'confirmed' } } };
export const Shipped:   Story = { args: { order: { ...base, status: 'shipped' } } };
export const Delivered: Story = { args: { order: { ...base, status: 'delivered' } } };
