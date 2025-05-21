import {ColumnDef} from '@tanstack/react-table';
import {Edit, MoreHorizontal, Trash} from "lucide-react";

import {Button} from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Cashier} from '@/types/api';

export function getUserColumns(
    onEdit: (user: Cashier) => void,
    onDelete: (id: number) => void
): ColumnDef<Cashier>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Имя',
            cell: ({row}) => <div className="font-medium">{row.getValue('name')}</div>,
        },
        {
            accessorKey: 'role',
            header: 'Роль',
            cell: ({row}) => (
                <div>
                    {row.getValue('role') === 'admin' ? 'Администратор' : 'Кассир'}
                </div>
            ),
        },
        {
            id: 'actions',
            header: () => <div className="text-right">Действия</div>,
            cell: ({row, table}) => {
                const user: Cashier = row.original;

                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-8 w-8 p-0"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span className="sr-only">Открыть меню</span>
                                    <MoreHorizontal className="h-4 w-4"/>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Действия</DropdownMenuLabel>
                                <DropdownMenuSeparator/>

                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(user);
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4"/>
                                    Редактировать
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(user.id);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash className="mr-2 h-4 w-4"/>
                                    Удалить
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];
}