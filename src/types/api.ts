export interface User<T = any> {
    username: string;
    data?: T;
}

export interface ApiResponse<T> {
    price: number;
    name: string;
    barcode: string;
    data: T;
    status: number;
    message?: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
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

export interface LoginRequest {
    login: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: string;
        branchId: string;
    };
}

export interface CreateSaleData {
    item_barcode: string;
    price: number;
    quantity: number;
    description: string;
}

export interface Sale {
    item_barcode: string;
    price: number;
    quantity: number;
    description: string;
}