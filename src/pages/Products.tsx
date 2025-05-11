import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { Input } from '@/components/ui/input';
import {
  Edit,
  MoreHorizontal,
  Plus,
  Trash,
} from 'lucide-react';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/utils';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { productApi, ProductSearchParams } from '@/api/productApi';
import { branchApi } from '@/api/branchApi';

const fetchProducts = async (page: number = 1): Promise<Product[]> => {
  try {
    const response = await productApi.getAll(page);
    return response.data;
  } catch (error) {
    throw new Error('Не удалось загрузить продукты: ' + error.message);
  }
};

const fetchBranches = async () => {
  const response = await branchApi.getAll();
  return response.data;
};


const searchProducts = async (searchValue: string): Promise<Product[]> => {
  try {
    const params: ProductSearchParams = { q: searchValue };
    const response = await productApi.search(params);
    return response.data;
  } catch (error) {
    throw new Error('Не удалось выполнить поиск продуктов: ' + error.message);
  }
};

const deleteProduct = async (barcode: string) => {
  const response = await productApi.delete(barcode);
  return response.data;
};

export function ProductsPage() {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [searchValue, setSearchValue] = useState('');

  // Получение продуктов
  const { data: dataProducts, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetchProducts(1),
  });

  // Получение филиалов
  const { data: dataBranches } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });

  // Поиск продуктов
  const { data: searchResults } = useQuery({
    queryKey: ['products', searchValue],
    queryFn: () => searchProducts(searchValue),
    enabled: Boolean(searchValue),
  });

  const isAdmin = user?.role === 'admin';

  // Мутация для удаления продукта
  const mutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Продукт удален',
        description: 'Продукт успешно удален.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить продукт: ' + error.message,
        variant: 'destructive',
      });
    },
  });

  const handleDelete = (product: Product) => {
    mutation.mutate(product.barcode);
  };

  // Данные для отображения: результаты поиска или все продукты
  const displayData = searchValue && searchResults ? searchResults : dataProducts || [];

  // Обработка загрузки и ошибок
  if (isLoading) {
    return <div className="text-center">Загрузка продуктов...</div>;
  }

  if (error) {
    return <div className="text-center text-destructive">Ошибка загрузки продуктов: {error.message}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Продукты</h2>
        {isAdmin && (
          <Button
            onClick={() => {
              setEditingProduct(undefined);
              setIsFormOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить продукт
          </Button>
        )}
      </div>

      {/* Поле для поиска */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Поиск по названию..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Таблица продуктов */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Баркод</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Остаток</TableHead>
              <TableHead>Филиал</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Дата создания</TableHead>
              {isAdmin && <TableHead className="text-right">Действия</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isAdmin ? 8 : 7} className="text-center">
                  Нет продуктов
                </TableCell>
              </TableRow>
            ) : (
              displayData.map((product) => (
                <TableRow key={product.barcode}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.barcode}</TableCell>
                  <TableCell>{formatCurrency(parseFloat(product.price))}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    {dataBranches?.find((b) => b.id === product.branch_id)?.name || 'Неизвестный филиал'}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={product.description}>
                      {product.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(product.created_at).toLocaleDateString('ru-RU')}
                  </TableCell>
                  {isAdmin && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Открыть меню</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingProduct(product);
                              setIsFormOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Редактировать</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Удалить</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Диалог для формы продукта */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? 'Редактировать продукт' : 'Добавить продукт'}
            </DialogTitle>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            branches={dataBranches ?? []}
            onSuccess={() => {
              setIsFormOpen(false);
              queryClient.invalidateQueries({ queryKey: ['products'] });
            }}
            onCancel={() => setIsFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}