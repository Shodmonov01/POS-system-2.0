import apiClient from './api'
import { Branch, ApiResponse } from '../types/api'
import { AxiosResponse } from 'axios'

export const branchApi = {
    //getAll: (): Promise<AxiosResponse<ApiResponse<Branch[]>>> => apiClient.get('/branch/all'),
    getAll: (): Promise<AxiosResponse<Branch[]>> => apiClient.get('/branch/all'),

    getById: (id: number): Promise<AxiosResponse<ApiResponse<Branch>>> => apiClient.get(`/branch/${id}`),

    create: (data: Omit<Branch, 'id'>): Promise<AxiosResponse<ApiResponse<Branch>>> =>
        apiClient.post('/branch/create', data),

    update: (id: number, data: Partial<Branch>): Promise<AxiosResponse<ApiResponse<Branch>>> =>
        apiClient.put(`/branch/update/${id}`, data),

    delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> => apiClient.delete(`/branch/delete/${id}`)
}
