import { useState } from 'react';
import { DataTable } from '@/components/common/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/types';
import { Badge } from '@/components/ui/badge';

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Администратор',
    email: 'admin@example.com',
    role: 'admin',
    branchId: '1',
  },
  {
    id: '2',
    name: 'Кассир',
    email: 'cashier@example.com',
    role: 'cashier',
    branchId: '1',
  },
];

export function UsersPage() {
  const [users] = useState<User[]>(mockUsers);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: 'Имя',
    },
    {
      accessorKey: 'email',
      header: 'Email',
    },
    {
      accessorKey: 'role',
      header: 'Роль',
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.getValue('role') === 'admin' ? 'Администратор' : 'Кассир'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Пользователи</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Добавить пользователя
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={users}
        searchPlaceholder="Поиск пользователей..."
        searchKey="name"
      />
    </div>
  );
}