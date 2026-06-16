import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

const CART_KEY = 'shophub_cart';

function loadCart() {
  try {
    const s = localStorage.getItem(CART_KEY);
    return s ? JSON.parse(s) : undefined;
  } catch { return undefined; }
}

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
  },
  preloadedState: {
    cart: loadCart(),
  },
});

store.subscribe(() => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(store.getState().cart));
  } catch { /* ignore */ }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
