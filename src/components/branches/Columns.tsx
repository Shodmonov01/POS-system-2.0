import {ColumnDef} from '@tanstack/react-table';

import {Button} from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Branch} from '@/types';
import {Edit, MoreHorizontal, Trash} from "lucide-react";


export function getBranchColumns(
    onEdit: (branch: Branch) => void,
    onDelete: (id: number) => void
): ColumnDef<Branch>[] {
    return [
        {
            accessorKey: 'name',
            header: 'Название',
        },
        {
            accessorKey: 'address',
            header: 'Адрес',
        },
        {
            id: 'actions',
            header: 'Действия',
            cell: ({row}) => {
                const branch = row.original
                return (
                    <div className="flex justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="outline"
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
                                        onEdit(branch);
                                    }}
                                >
                                    <Edit className="mr-2 h-4 w-4"/>
                                    Редактировать
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(branch.id);
                                    }}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <Trash className="mr-2 h-4 w-4"/>
                                    Удалить
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
        },
    ]
}
