import apiClient from './api';
import { Sale, ApiResponse, CreateSaleData } from '../types/api';
import { AxiosResponse } from 'axios';



export const saleApi = {
  getDaily: (): Promise<AxiosResponse<ApiResponse<Sale[]>>> =>
    apiClient.get('/sale/daily'),
    
  create: (data: CreateSaleData): Promise<AxiosResponse<ApiResponse<Sale>>> =>
    apiClient.post('/sale/create', data),
};