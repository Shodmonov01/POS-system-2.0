import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
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
import { Edit, MoreHorizontal, Plus, Trash } from 'lucide-react';
import { Product } from '@/types/api.ts';
import { formatCurrency } from '@/lib/utils';
import {
  useQuery, useMutation, useQueryClient, keepPreviousData,
} from '@tanstack/react-query';
import { productApi, ProductSearchParams } from '@/api/productApi';
import { branchApi } from '@/api/branchApi';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/common/DataTable';
import { ProductForm } from '@/components/products/ProductForm';

// Определение колонок для DataTable
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
    cell: ({ row }) => formatCurrency(parseFloat(row.getValue('price'))),
  },
  {
    accessorKey: 'stock',
    header: 'Остаток',
  },
  {
    accessorKey: 'branch_id',
    header: 'Филиал',
    cell: ({ row, table }) => {
      let branches = table.options.meta?.branches || [];
      if (branches.data) {
        branches = branches.data;
      }
      const branch = branches.find((b: any) => b.id === row.getValue('branch_id'));
      return branch?.name || 'Неизвестный филиал';
    },
  },
  {
    accessorKey: 'description',
    header: 'Описание',
    cell: ({ row }) => (
      <div className="max-w-xs truncate" title={row.getValue('description')}>
        {row.getValue('description')}
      </div>
    ),
  },
  {
    accessorKey: 'created_at',
    header: 'Дата создания',
    cell: ({ row }) =>
      new Date(row.getValue('created_at')).toLocaleDateString('ru-RU'),
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Действия</div>,
    cell: ({ row, table }) => {
      const product = row.original;
      const meta = table?.options?.meta as any;

      // Проверяем, что meta существует и содержит нужные свойства
      if (!meta || !meta.setEditingProduct || !meta.setIsFormOpen || !meta.handleDelete) {
        return null; // Не рендерим действия, если meta недоступно
      }

      const { setEditingProduct, setIsFormOpen, handleDelete } = meta;

      return (
        <div className={'flex justify-end'}>
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
        </div>
      );
    },
    enableSorting: false,
  },
];

// Функции для получения данных
const fetchProducts = async (page: number = 1, pageSize: number = 10): Promise<Product[]> => {
  try {
    const response = await productApi.getAll(page, pageSize);
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

  const [ pagePagination, setPagePagination ] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Получение продуктов
  const { data: dataProducts, isLoading, error } = useQuery({
    queryKey: [ 'products', pagePagination.pageIndex + 1 ],
    queryFn: () => fetchProducts(
      pagePagination.pageIndex + 1, // TODO: +1 потому что на беке страницы с 1 формируются, возможно править бек
      pagePagination.pageSize,
    ),
    placeholderData: keepPreviousData,
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
  const displayData = searchValue && searchResults ? searchResults : dataProducts?.data || [];

  // Обработка ошибок
  if (error) {
    return <div className="text-center text-destructive">Ошибка загрузки продуктов: {error.message}</div>;
  }

  // Скрытие колонки действий для не-админов
  const filteredColumns = isAdmin ? columns : columns.filter((col) => col.id !== 'actions');

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

      {/* Таблица с использованием DataTable */}
      <DataTable
        columns={filteredColumns}
        data={displayData}
        rowCount={!searchValue && dataProducts?.pagination.total_records}
        searchPlaceholder="Поиск по названию..."
        searchKey="name"
        isLoading={isLoading}
        handleChangeSearch={setSearchValue}
        pageSize={pagePagination.pageSize}
        handleChangePagination={setPagePagination}
        meta={{
          branches: dataBranches || [],
          setEditingProduct,
          setIsFormOpen,
          handleDelete,
        }}
      />

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
            branches={dataBranches?.data ?? []}
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
