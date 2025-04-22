import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Customer } from '../types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  items: CartItem[];
  customer: Customer | null;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<Omit<CartItem, 'id'>>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setCustomer: (customer: Customer | null) => void;
  total: number;
  itemCount: number;
  markAllAsDebt: (isDebt: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (newItem: Omit<CartItem, 'id'>) => {
    const existingItemIndex = items.findIndex(
      (item) => item.productId === newItem.productId
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      setItems(updatedItems);
      toast({
        title: 'Quantity updated',
        description: `${newItem.name} quantity increased`,
      });
    } else {
      const id = Math.random().toString(36).substring(2, 9);
      setItems([...items, { ...newItem, id }]);
      toast({
        title: 'Item added',
        description: `${newItem.name} added to cart`,
      });
    }
  };

  const updateItem = (id: string, updates: Partial<Omit<CartItem, 'id'>>) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const removeItem = (id: string) => {
    const itemToRemove = items.find((item) => item.id === id);
    setItems(items.filter((item) => item.id !== id));
    
    if (itemToRemove) {
      toast({
        title: 'Item removed',
        description: `${itemToRemove.name} removed from cart`,
      });
    }
  };

  const clearCart = () => {
    setItems([]);
    setCustomer(null);
  };

  const markAllAsDebt = (isDebt: boolean) => {
    setItems(items.map((item) => ({ ...item, isDebt })));
    
    if (isDebt && !customer) {
      toast({
        title: 'Customer information needed',
        description: 'Please add customer details for debt',
        variant: 'destructive',
      });
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        customer,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        setCustomer,
        total,
        itemCount,
        markAllAsDebt,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
};