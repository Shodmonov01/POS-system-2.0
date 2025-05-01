import apiClient from './api'
import {LoginRequest, LoginResponse} from '../types/api'

export const authApi = {
    login: (credentials: LoginRequest) =>
        apiClient.post<LoginResponse>('/auth/login', credentials),
};