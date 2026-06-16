import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/product';

interface CartItem { product: Product; quantity: number; }
interface CartState { items: CartItem[]; }

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [] } as CartState,
  reducers: {
    addToCart(state, action: PayloadAction<Product>) {
      const existing = state.items.find(i => i.product.id === action.payload.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ product: action.payload, quantity: 1 });
    },
    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.product.id !== action.payload);
    },
    updateQuantity(state, action: PayloadAction<{ id: string; quantity: number }>) {
      const item = state.items.find(i => i.product.id === action.payload.id);
      if (item) item.quantity = action.payload.quantity;
    },
    clearCart(state) { state.items = []; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
