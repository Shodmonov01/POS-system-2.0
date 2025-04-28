import apiClient from './api'
import { Cashier, ApiResponse } from '../types/api'
import { AxiosResponse } from 'axios'

export const cashierApi = {
    getAll: (): Promise<AxiosResponse<ApiResponse<Cashier[]>>> => apiClient.get('/cashier/all'),

    getById: (id: number): Promise<AxiosResponse<ApiResponse<Cashier>>> => apiClient.get(`/cashier/${id}`),

    create: (data: Omit<Cashier, 'id'>): Promise<AxiosResponse<ApiResponse<Cashier>>> =>
        apiClient.post('/cashier/create', data),

    update: (id: number, data: Partial<Cashier>): Promise<AxiosResponse<ApiResponse<Cashier>>> =>
        apiClient.put(`/cashier/update/${id}`, data),

    delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> => apiClient.delete(`/cashier/delete/${id}`)
}
