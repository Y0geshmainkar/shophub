import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import cartReducer from '../store/cartSlice';
import productsReducer from '../store/productsSlice';
import authReducer from '../store/authSlice';

export function renderWithProviders(ui: React.ReactElement, route = '/') {
  const store = configureStore({
    reducer: { cart: cartReducer, products: productsReducer, auth: authReducer },
  });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return {
    ...render(
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
        </QueryClientProvider>
      </Provider>
    ),
    store,
  };
}

export function makeProduct(overrides = {}) {
  return {
    id: 'P1', name: 'Test Product', price: 29.99, stock: 10,
    available: true, category: 'Test', images: ['https://via.placeholder.com/400'],
    description: 'A test product', rating: 4.5, reviewCount: 100,
    sourceSystem: 'Shopify' as const,
    ...overrides,
  };
}
