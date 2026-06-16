import { apiClient } from '../api/apiClient';

export const productService = {
  getProducts:     () => apiClient.get('localJson/Products/GetProducts.json'),
  getProductDetail: (_id: string) => apiClient.get('localJson/Products/GetProductDetail.json'),
  getCategories:   () => apiClient.get('localJson/Products/GetCategories.json'),
};
