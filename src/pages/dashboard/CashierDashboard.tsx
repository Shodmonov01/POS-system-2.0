import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { BarcodeInput } from '@/components/common/BarcodeInput';
import { Cart } from '@/components/sales/Cart';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag, RotateCcw, CreditCard } from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

// Mock products data - in a real app, this would come from an API
const MOCK_PRODUCTS: Record<string, Product> = {
  '123456789': {
    id: '1',
    name: 'Ноутбук',
    barcode: '123456789',
    price: 89999.99,
    stock: 10,
    description: 'Высокопроизводительный ноутбук',
    branchId: '1',
  },
  '987654321': {
    id: '2',
    name: 'Беспроводная мышь',
    barcode: '987654321',
    price: 2999.99,
    stock: 50,
    description: 'Эргономичная беспроводная мышь',
    branchId: '1',
  },
  '456789123': {
    id: '3',
    name: 'Механическая клавиатура',
    barcode: '456789123',
    price: 8999.99,
    stock: 25,
    description: 'Механическая игровая клавиатура',
    branchId: '1',
  },
  '789123456': {
    id: '4',
    name: 'Наушники',
    barcode: '789123456',
    price: 14999.99,
    stock: 15,
    description: 'Наушники с шумоподавлением',
    branchId: '1',
  },
};

export function CashierDashboard() {
  const { toast } = useToast();
  const { addItem } = useCart();
  const [recentScan, setRecentScan] = useState<Product | null>(null);
  
  const handleScan = (barcode: string) => {
    const product = MOCK_PRODUCTS[barcode];
    
    if (product) {
      // Add to cart
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.price,
        quantity: 1,
        isDebt: false,
      });
      
      setRecentScan(product);
    } else {
      toast({
        title: 'Товар не найден',
        description: `Товар со штрих-кодом ${barcode} не найден`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Касса</h2>
        <div className="flex space-x-2">
          <Button variant="outline" className="hidden sm:flex">
            <RotateCcw className="mr-2 h-4 w-4" />
            Возвраты
          </Button>
          <Button variant="outline" className="hidden sm:flex">
            <CreditCard className="mr-2 h-4 w-4" />
            Долги
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Сканирование товаров
              </CardTitle>
              <CardDescription>
                Отсканируйте штрих-код или найдите товар
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BarcodeInput
                onScan={handleScan}
                placeholder="Отсканируйте штрих-код или найдите товар..."
                className="text-lg"
              />
              
              {recentScan && (
                <div className="mt-4 rounded-md bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{recentScan.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {recentScan.barcode}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        {formatCurrency(recentScan.price)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        В наличии: {recentScan.stock}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {Object.values(MOCK_PRODUCTS).map((product) => (
                  <Button
                    key={product.id}
                    variant="outline"
                    className="h-20 flex flex-col justify-center"
                    onClick={() => handleScan(product.barcode)}
                  >
                    <span className="font-medium">{product.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatCurrency(product.price)}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Cart />
        </div>
      </div>
    </div>
  );
}