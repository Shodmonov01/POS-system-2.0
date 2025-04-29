export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cashier';
  branchId: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface Product {
  id: Key | null | undefined;
  // id?: number;
  name: string;
  barcode: string;
  price: number;
  stock: number;
  description?: string;
  branch_id?: number;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  isDebt: boolean;
}

export interface Customer {
  name: string;
  phone: string;
  comment?: string;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  cashierId: string;
  branchId: string;
  isDebt: boolean;
  customer?: Customer;
}

export interface Debt {
  id: string;
  sale: Sale;
  customer: Customer;
  amount: number;
  date: string;
  isPaid: boolean;
  paymentDate?: string;
  partialPayments?: PartialPayment[];
}

export interface PartialPayment {
  id: string;
  debtId: string;
  amount: number;
  date: string;
}

export interface StockEntry {
  id: string;
  productId: string;
  quantity: number;
  date: string;
  price: number;
  branchId: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  contact: string;
}

export interface ReturnReason {
  id: string;
  name: string;
}

export interface Return {
  id: string;
  productId: string;
  quantity: number;
  reason: ReturnReason;
  date: string;
  cashierId: string;
  branchId: string;
}
