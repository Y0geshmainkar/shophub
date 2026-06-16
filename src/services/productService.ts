// Product service — fetches and returns raw product data
// Uses apiClient → TanStack Query calls this
import { apiClient } from '../api/apiClient';

export const productService = {
  getProducts: () => apiClient.get('localJson/Products/GetProducts.json'),
  getProductDetail: (id: string) => apiClient.get(`localJson/Products/GetProductDetail.json?id=${id}`),
  getCategories: () => apiClient.get('localJson/Products/GetCategories.json'),
};
