import { apiClient } from '../api/apiClient';

export const cartService = {
  validateCart: (items: unknown) =>
    apiClient.post('localJson/Cart/ValidateCart.json', items),
};
