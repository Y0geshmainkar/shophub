import { apiClient } from '../api/apiClient';

export const orderService = {
  placeOrder: (payload: unknown) =>
    apiClient.post('localJson/Orders/PlaceOrder.json', payload),
  getOrderHistory: () =>
    apiClient.get('localJson/Orders/GetOrderHistory.json'),
};
