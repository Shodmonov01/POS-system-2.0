import { useState } from 'react';
// import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable } from '@/components/common/DataTable';
import { ProductForm } from '@/components/products/ProductForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Edit, MoreHorizontal, Plus,
  // Trash,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

import {
  useQuery,
  // useMutation, useQueryClient,
} from '@tanstack/react-query';

// Mock products data - in a real app, this would come from an API
// const mockProducts: Product[] = [
//   {
//     id: '1',
//     name: 'Laptop',
//     barcode: '123456789',
//     price: 999.99,
//     stock: 10,
//     description: 'High-performance laptop',
//     branchId: '1',
//   },
//   {
//     id: '2',
//     name: 'Wireless Mouse',
//     barcode: '987654321',
//     price: 29.99,
//     stock: 50,
//     description: 'Ergonomic wireless mouse',
//     branchId: '1',
//   },
//   {
//     id: '3',
//     name: 'Mechanical Keyboard',
//     barcode: '456789123',
//     price: 89.99,
//     stock: 25,
//     description: 'Mechanical gaming keyboard',
//     branchId: '1',
//   },
//   {
//     id: '4',
//     name: 'Headphones',
//     barcode: '789123456',
//     price: 149.99,
//     stock: 15,
//     description: 'Noise-cancelling headphones',
//     branchId: '1',
//   },
//   {
//     id: '5',
//     name: 'USB-C Cable',
//     barcode: '321654987',
//     price: 12.99,
//     stock: 100,
//     description: 'Fast charging USB-C cable',
//     branchId: '1',
//   },
// ];

const fetchProducts = async () => {
  // TODO: http://213.139.210.248:3000 -> /api (proxy)
  return (await fetch('/api/product/all')).json();
  // return (await fetch('https://reqres.in/api/users?page=1&per_page=20')).json();
};

// const createProduct = async (payload: Product) => {
//   console.log('createProduct payload', payload);
//   const res = await fetch('https://reqres.in/api/users/2', {
//     method: 'POST',
//     body: JSON.stringify(payload),
//   });
//   return res.json();
// };

export function ProductsPage() {
  // const { toast } = useToast();
  const { user } = useAuth();
  // const [ products, setProducts ] = useState<Product[]>([]);
  const [ isFormOpen, setIsFormOpen ] = useState(false);
  const [ editingProduct, setEditingProduct ] = useState<Product | undefined>(
    undefined,
  );

  // const queryClient = useQueryClient();

  const { data: dataProducts } = useQuery({ queryKey: [ 'products' ], queryFn: fetchProducts });

  // const mutation = useMutation({
  //   mutationFn: createProduct,
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [ 'products' ] });
  //   },
  // });

  const isAdmin = user?.role === 'admin';

  // const handleDelete = (id: string) => {
  //   setProducts(products.filter((product) => product.id !== id));
  //   toast({
  //     title: 'Product deleted',
  //     description: 'The product has been deleted successfully.',
  //   });
  // };

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'barcode',
      header: 'Баркод',
    },
    {
      accessorKey: 'price',
      header: 'Цена',
      cell: ({ row }) => formatCurrency(row.getValue('price')),
    },
    {
      accessorKey: 'stock',
      header: 'Остаток',
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => {
                    setEditingProduct(product);
                    setIsFormOpen(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
              )}
              {/*{isAdmin && (*/}
              {/*  <DropdownMenuItem*/}
              {/*    onClick={() => handleDelete(product.id)}*/}
              {/*    className="text-destructive focus:text-destructive"*/}
              {/*  >*/}
              {/*    <Trash className="mr-2 h-4 w-4" />*/}
              {/*    <span>Delete</span>*/}
              {/*  </DropdownMenuItem>*/}
              {/*)}*/}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Продукты</h2>
        {isAdmin && (
          <Button onClick={() => {
            setEditingProduct(undefined);
            setIsFormOpen(true);
            // mutation.mutate({
            //   'barcode': '123',
            //   'name': 'pr1',
            //   'price': 10,
            //   'stock': 10,
            //   'description': 'pr1 description',
            // });
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {dataProducts && (
        <DataTable
          columns={columns}
          data={dataProducts}
          searchPlaceholder="Поиск по названию"
          searchKey="name"
        />
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Edit Product' : 'Add Product'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
