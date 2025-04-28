
export interface User<T = any> {  
  username: string;
  data?: T;  
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;  
}

export interface Cashier {
  id: number;
  name: string;
  email: string;
}

export interface Branch {
  id: number;
  name: string;
  address: string;

}

export interface Product {
  barcode: string;
  name: string;
  price: number;
  category?: string;
}