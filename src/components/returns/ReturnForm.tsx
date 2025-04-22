import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { BarcodeInput } from '@/components/common/BarcodeInput';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';
import { Product, ReturnReason } from '@/types';

const formSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  reasonId: z.string().min(1, 'Reason is required'),
});

type FormData = z.infer<typeof formSchema>;

const MOCK_REASONS: ReturnReason[] = [
  { id: '1', name: 'Defective product' },
  { id: '2', name: 'Wrong product' },
  { id: '3', name: 'Customer changed mind' },
  { id: '4', name: 'Other' },
];

// Demo purposes - would be fetched from API
const MOCK_PRODUCTS: Record<string, Product> = {
  '123456789': {
    id: '1',
    name: 'Product 1',
    barcode: '123456789',
    price: 9.99,
    stock: 10,
    description: 'Product 1 description',
    branchId: '1',
  },
  '987654321': {
    id: '2',
    name: 'Product 2',
    barcode: '987654321',
    price: 19.99,
    stock: 5,
    description: 'Product 2 description',
    branchId: '1',
  },
};

export function ReturnForm() {
  const { toast } = useToast();
  const [scannedProduct, setScannedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: '',
      quantity: 1,
      reasonId: '',
    },
  });
  
  const handleBarcodeScan = (barcode: string) => {
    // In a real app, this would make an API call to fetch the product
    const product = MOCK_PRODUCTS[barcode];
    
    if (product) {
      setScannedProduct(product);
      form.setValue('productId', product.id);
      toast({
        title: 'Product found',
        description: product.name,
      });
    } else {
      toast({
        title: 'Product not found',
        description: `No product found with barcode ${barcode}`,
        variant: 'destructive',
      });
    }
  };
  
  const onSubmit = (data: FormData) => {
    setIsSubmitting(true);
    
    // In a real app, this would make an API call to process the return
    setTimeout(() => {
      const reason = MOCK_REASONS.find((r) => r.id === data.reasonId);
      
      toast({
        title: 'Return processed',
        description: `${data.quantity} × ${scannedProduct?.name} returned (${reason?.name})`,
      });
      
      // Reset form
      form.reset({
        productId: '',
        quantity: 1,
        reasonId: '',
      });
      setScannedProduct(null);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <RotateCcw className="mr-2 h-5 w-5" />
          Process Return
        </CardTitle>
        <CardDescription>
          Scan the product barcode to process a return
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium">Scan Product</div>
            <BarcodeInput
              onScan={handleBarcodeScan}
              placeholder="Scan or enter product barcode..."
              disabled={isSubmitting}
            />
          </div>
          
          {scannedProduct && (
            <div className="rounded-md bg-muted p-4">
              <p className="font-medium">{scannedProduct.name}</p>
              <p className="text-sm text-muted-foreground">
                Barcode: {scannedProduct.barcode}
              </p>
              <p className="text-sm text-muted-foreground">
                Current stock: {scannedProduct.stock}
              </p>
            </div>
          )}
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        disabled={!scannedProduct || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="reasonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Reason</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={!scannedProduct || isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_REASONS.map((reason) => (
                          <SelectItem key={reason.id} value={reason.id}>
                            {reason.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={!scannedProduct || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Process Return'}
              </Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}