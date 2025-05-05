import {AxiosResponse} from 'axios'

import {ApiResponse, Branch} from '../types/api'
import apiClient from './api'


export const branchApi = {
    getAll: (): Promise<AxiosResponse<Branch[]>> => apiClient.get('/branch/all'),

    getById: (id: number): Promise<AxiosResponse<ApiResponse<Branch>>> => apiClient.get(`/branch/${id}`),

    create: (data: Omit<Branch, 'id'>): Promise<AxiosResponse<ApiResponse<Branch>>> =>
        apiClient.post('/branch/create', data),

    update: (id: number, data: Partial<Branch>): Promise<AxiosResponse<ApiResponse<Branch>>> =>
        apiClient.put(`/branch/update/${id}`, data),

    delete: (id: number): Promise<AxiosResponse<ApiResponse<void>>> => apiClient.delete(`/branch/delete/${id}`)
}
