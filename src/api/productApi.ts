// src/api/productApi.ts
import apiClient from './api';
import { Product, ApiResponse } from '../types/api';
import { AxiosResponse } from 'axios';

export interface ProductSearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const productApi = {
  getAll: (page: number = 1, pageSize: number = 10): Promise<AxiosResponse<ApiResponse<Product[]>>> =>
    apiClient.get('/product/list', { params: { page, pageSize } }),

  getByBarcode: (barcode: string): Promise<AxiosResponse<ApiResponse<Product>>> =>
    apiClient.get(`/product/${barcode}`),

  search: (params: ProductSearchParams): Promise<AxiosResponse<ApiResponse<Product[]>>> =>
    apiClient.get('/product/search', { params }),

  create: (data: Product): Promise<AxiosResponse<ApiResponse<Product>>> =>
    apiClient.post('/product/create', data),

  update: (barcode: string, data: Partial<Product>): Promise<AxiosResponse<ApiResponse<Product>>> =>
    apiClient.put(`/product/update/${barcode}`, data),

  delete: (barcode: string): Promise<AxiosResponse<ApiResponse<void>>> =>
    apiClient.delete(`/product/delete/${barcode}`),
};
