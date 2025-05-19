import apiClient from './api'
import {ApiResponse, Cashier} from '../types/api'
import {AxiosResponse} from 'axios'
import {CashierFormFields} from "@/types/forms.ts";


export const cashierApi = {
    getAll: (): Promise<AxiosResponse<ApiResponse<Cashier[]>>> =>
        apiClient.get<ApiResponse<Cashier[]>>('/cashier/list'),

    getById: (id: number): Promise<AxiosResponse<ApiResponse<Cashier>>> =>
        apiClient.get<ApiResponse<Cashier>>(`/cashier/${id}`),

    create: (
        data: CashierFormFields
    ): Promise<AxiosResponse<ApiResponse<Cashier>>> =>
        apiClient.post<ApiResponse<Cashier>>('/cashier/create', data),

    update: (
        id: number,
        data: Partial<CashierFormFields>
    ): Promise<AxiosResponse<ApiResponse<Cashier>>> =>
        apiClient.put<ApiResponse<Cashier>>(
            `/cashier/update/${id}`,
            data
        ),

    delete: (
        id: number
    ): Promise<AxiosResponse<ApiResponse<void>>> =>
        apiClient.delete<ApiResponse<void>>(
            `/cashier/delete/${id}`
        ),
}