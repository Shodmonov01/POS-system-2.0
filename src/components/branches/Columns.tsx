import {ColumnDef} from '@tanstack/react-table';

import {Button} from '@/components/ui/button';
import {Branch} from '@/types';


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
                    <div className="flex space-x-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(branch)}
                        >
                            Изменить
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDelete(+branch.id)}
                        >
                            Удалить
                        </Button>
                    </div>
                )
            },
        },
    ]
}
