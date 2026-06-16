import React from 'react';
import type { Preview } from '@storybook/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/store/cartSlice';
import productsReducer from '../src/store/productsSlice';
import authReducer from '../src/store/authSlice';
import '../src/styles/global.scss';

const store = configureStore({ reducer: { cart: cartReducer, products: productsReducer, auth: authReducer } });
const queryClient = new QueryClient();

const preview: Preview = {
  decorators: [
    Story => (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Story />
          </MemoryRouter>
        </QueryClientProvider>
      </Provider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default preview;
