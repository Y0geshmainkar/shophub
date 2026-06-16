import cartReducer, { addToCart, removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import type { Product } from '../types/product';

const product: Product = {
  id: 'P1', name: 'Test', price: 10, stock: 20, available: true,
  category: 'Test', images: [], description: '', rating: 5, reviewCount: 1,
  sourceSystem: 'Shopify',
};

const empty = { items: [] };

describe('cartSlice', () => {
  it('adds item to empty cart', () => {
    const state = cartReducer(empty, addToCart(product));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(1);
  });

  it('increments quantity when adding same item again', () => {
    const state1 = cartReducer(empty, addToCart(product));
    const state2 = cartReducer(state1, addToCart(product));
    expect(state2.items).toHaveLength(1);
    expect(state2.items[0].quantity).toBe(2);
  });

  it('removes item by id', () => {
    const state1 = cartReducer(empty, addToCart(product));
    const state2 = cartReducer(state1, removeFromCart('P1'));
    expect(state2.items).toHaveLength(0);
  });

  it('updates quantity', () => {
    const state1 = cartReducer(empty, addToCart(product));
    const state2 = cartReducer(state1, updateQuantity({ id: 'P1', quantity: 5 }));
    expect(state2.items[0].quantity).toBe(5);
  });

  it('clears cart', () => {
    const state1 = cartReducer(empty, addToCart(product));
    const state2 = cartReducer(state1, clearCart());
    expect(state2.items).toHaveLength(0);
  });

  it('does not update quantity for non-existent id', () => {
    const state1 = cartReducer(empty, addToCart(product));
    const state2 = cartReducer(state1, updateQuantity({ id: 'NONEXISTENT', quantity: 99 }));
    expect(state2.items[0].quantity).toBe(1);
  });
});
