import apiClient from './api'
import { LoginCredentials, LoginResponse, ApiResponse } from '../types/api'
import { AxiosResponse } from 'axios'

export const authApi = {
    login: (credentials: LoginCredentials): Promise<AxiosResponse<ApiResponse<LoginResponse>>> =>
        apiClient.post('/auth/login', credentials)
}
