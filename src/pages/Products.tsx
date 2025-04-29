import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
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
  Trash,
} from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Branch, Product } from '@/types';
import { formatCurrency } from '@/lib/utils';

import axios from 'axios';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';


const fetchProducts = async () => {
  // TODO: http://213.139.210.248:3000 -> /api (proxy)
  return (await fetch('/api/product/all')).json();
};


export function ProductsPage() {
  const { toast } = useToast();
  const { user } = useAuth();

  const [ isFormOpen, setIsFormOpen ] = useState(false);
  const [ editingProduct, setEditingProduct ] = useState<Product | undefined>(
    undefined,
  );

  const { data: dataProducts } = useQuery({ queryKey: [ 'products' ], queryFn: fetchProducts });

  const { data: dataBranches } = useQuery({
    queryKey: [ 'branches' ],
    queryFn: async (): Promise<Branch[]> => {
      return (await axios.get(`/api/branch/all`)).data;
    },
  });


  const isAdmin = user?.role === 'admin';

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (product: Product) => {
      return await axios.delete(`/api/product/delete/${product.barcode}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [ 'products' ] });
    },
  });

  const handleDelete = (product: Product) => {
    mutation.mutate(product);
    // setProducts(products.filter((product) => product.id !== id));
    toast({
      title: 'Product deleted ' + product.barcode,
      description: 'The product has been deleted successfully.',
    });
  };

  const [ searchValue, setSearchValue ] = useState('');

  const querySearchProducts = useQuery({
    queryKey: [ searchValue ],
    queryFn: async (): Promise<Product[]> => {
      return (await axios.get(`/api/product/search`, { params: { q: `${searchValue}` } })).data;
    },
    enabled: Boolean(searchValue),
  });

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
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => handleDelete(product)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
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
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        )}
      </div>

      {dataProducts && (
        <DataTable
          columns={columns}
          data={(searchValue && querySearchProducts.data) || dataProducts}
          searchPlaceholder="Поиск по названию"
          searchKey="name"
          handleChangeSearch={setSearchValue}
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
            branches={dataBranches ?? []}
            onSuccess={() => setIsFormOpen(false)}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}