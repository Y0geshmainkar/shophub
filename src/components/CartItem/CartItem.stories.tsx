import type { Meta, StoryObj } from '@storybook/react';
import { CartItem } from './CartItem';

const product = {
  id: 'P1', name: 'Velvet-Lined Jewelry Organizer', price: 89.99, stock: 11,
  available: true, category: 'Jewelry',
  images: ['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400'],
  description: 'Elegant velvet-lined jewelry organizer.',
  rating: 4.9, reviewCount: 87, sourceSystem: 'Shopify' as const,
};

const meta: Meta<typeof CartItem> = {
  title: 'Components/CartItem',
  component: CartItem,
  decorators: [Story => <table><tbody><Story /></tbody></table>],
};
export default meta;

type Story = StoryObj<typeof CartItem>;

export const SingleItem: Story   = { args: { entry: { product, quantity: 1 } } };
export const MultipleQty: Story  = { args: { entry: { product, quantity: 3 } } };
