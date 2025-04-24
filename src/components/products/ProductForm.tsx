import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Branch, Product } from '@/types';
import {
  useMutation, useQueryClient,
} from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';


const createProduct = async (payload: Product) => {
  const res = await fetch('/api/product/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(payload),
  });
  return res.json();
};


const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  barcode: z.string().min(1, 'Barcode is required'),
  price: z.number().min(0, 'Price must be 0 or greater'),
  stock: z.number().min(0, 'Stock must be 0 or greater'),
  description: z.string().optional(),
  branch_id: z.number().min(1, 'Филиал должен быть выбран'),
});

type FormData = z.infer<typeof formSchema>;

interface ProductFormProps {
  product?: Product;
  branches: Branch[];
  onSuccess: () => void;
  onCancel: () => void;
}

export function ProductForm({ product, branches, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const [ isSubmitting, setIsSubmitting ] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ 'products' ] });
    },
  });

  const defaultValues: FormData = {
    name: product?.name || '',
    barcode: product?.barcode || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    description: product?.description || '',
    branch_id: product?.branch_id || 0,
  };

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    const tmp = await mutation.mutateAsync(data);

    if (tmp.statusCode > 201) {
      setIsSubmitting(false);
      return;
    }

    onSuccess();

    toast({
      title: product ? 'Product updated' : 'Product created',
      description: `${data.name} has been ${product ? 'updated' : 'created'} successfully.`,
    });

    // In a real app, this would make an API call to save the product
    // setTimeout(() => {
    //   toast({
    //     title: product ? 'Product updated' : 'Product created',
    //     description: `${data.name} has been ${product ? 'updated' : 'created'} successfully.`,
    //   });
    //
    //   setIsSubmitting(false);
    //   onSuccess();
    // }, 1000);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="barcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barcode</FormLabel>
              <FormControl>
                <Input placeholder="Enter barcode" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="branch_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Филиал</FormLabel>
              <Select
                onValueChange={field.onChange}
                // value={branches[0].id}
                // disabled={!scannedProduct || isSubmitting}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите филиал" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? 'Saving...'
              : product
                ? 'Update Product'
                : 'Create Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
