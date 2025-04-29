import apiClient from './api'
import {  LoginResponse, LoginRequest } from '../types/api'

export const authApi = {
    login: (credentials: LoginRequest) => 
      apiClient.post<LoginResponse>('/auth/login', credentials),
  };