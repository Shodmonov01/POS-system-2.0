import {ColumnDef} from '@tanstack/react-table';

import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';

import {Cashier} from '@/types/api';

export function getUserColumns(
    onEdit: (user: Cashier) => void,
    onDelete: (id: number) => void
): ColumnDef<Cashier>[] {
    return [
        {accessorKey: 'name', header: 'Имя'},
        {
            accessorKey: 'role',
            header: 'Роль',
            cell: ({row}) => (
                <Badge variant="outline">
                    {row.getValue('role') === 'admin' ? 'Администратор' : 'Кассир'}
                </Badge>
            ),
        },
        {
            id: 'actions',
            header: 'Действия',
            cell: ({row}) => {
                const usr = row.original
                return (
                    <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => onEdit(usr)}>
                            Изменить
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => onDelete(usr.id)}>
                            Удалить
                        </Button>
                    </div>
                )
            },
        },
    ]
}
