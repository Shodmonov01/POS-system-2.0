import {useEffect, useState} from 'react';
import {DataTable} from '@/components/common/DataTable';
import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';
import {ColumnDef} from '@tanstack/react-table';
import {Branch} from '@/types';
import {branchApi} from "@/api/branchApi.ts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {BranchForm} from "@/components/branches/BranchForm.tsx";
import {useAuth} from "@/contexts/AuthContext.tsx";


export function BranchesPage() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const {user} = useAuth();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | undefined>(undefined);

    const isAdmin = user?.role === 'admin';

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

    const fetchBranches = async () => {
        try {
            const response = await branchApi.getAll();
            setBranches(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Филиалы</h2>
                {isAdmin && (
                <Button onClick={() => {
                    setEditingBranch(undefined);
                    setIsFormOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Добавить филиал
                </Button>
                )}
            </div>

            <DataTable<Branch>
                columns={columns}
                data={branches}
                searchPlaceholder="Поиск филиалов..."
                searchKey="name"
            /> <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingBranch ? 'Редактировать филиал' : 'Добавить филиал'}</DialogTitle>
                </DialogHeader>
                <BranchForm
                    branch={editingBranch}
                    onSuccess={() => {
                        fetchBranches();
                        setIsFormOpen(false);
                    }}
                    onCancel={() => setIsFormOpen(false)}
                />
            </DialogContent>
        </Dialog>
        </div>
    );
}