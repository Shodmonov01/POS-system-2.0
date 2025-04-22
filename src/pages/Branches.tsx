import { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Branch } from '@/types';

const mockBranches: Branch[] = [
  {
    id: '1',
    name: 'Главный магазин',
    address: 'ул. Ленина, 1',
    contact: '+7 (999) 123-45-67',
  },
  {
    id: '2',
    name: 'Филиал №1',
    address: 'ул. Пушкина, 10',
    contact: '+7 (999) 765-43-21',
  },
];

export function BranchesPage() {
  const [branches] = useState<Branch[]>(mockBranches);

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: 'name',
      header: 'Название',
    },
    {
      accessorKey: 'address',
      header: 'Адрес',
    },
    {
      accessorKey: 'contact',
      header: 'Контакты',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Филиалы</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Добавить филиал
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={branches}
        searchPlaceholder="Поиск филиалов..."
        searchKey="name"
      />
    </div>
  );
}