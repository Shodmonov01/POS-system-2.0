import {useEffect, useState} from 'react';
import {DataTable} from '@/components/common/DataTable';
import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';
import {ColumnDef} from '@tanstack/react-table';
import {Badge} from '@/components/ui/badge';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {useToast} from "@/hooks/use-toast.ts";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {Cashier} from "@/types/api.ts";
import {CashierForm} from "@/components/cashiers/CashierForm.tsx";
import {cashierApi} from "@/api/cashierApi.ts";


export function UsersPage() {
    const {toast} = useToast();
    const {user} = useAuth();
    const [cashiers, setCashiers] = useState<Cashier[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCashier, setEditingCashier] = useState<Cashier | undefined>(
        undefined
    );
    const isAdmin = user?.role === 'admin';

    const columns: ColumnDef<Cashier>[] = [
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
            cell: ({row}) => (
                <Badge variant="outline">
                    {row.getValue('role') === 'admin' ? 'Администратор' : 'Кассир'}
                </Badge>
            ),
        },
    ];

    const fetchCashiers = async () => {
        try {
            const response = await cashierApi.getAll();
            setCashiers(response.data.data);
        } catch (error) {
            console.error(error);
            toast({title: "Ошибка загрузки кассиров", variant: "destructive"});
        }
    };

    useEffect(() => {
        fetchCashiers();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Пользователи</h2>
                {isAdmin && (
                    <Button onClick={() => {
                        setEditingCashier(undefined);
                        setIsFormOpen(true);
                    }}>
                        <Plus className="mr-2 h-4 w-4"/>
                        Добавить кассира
                    </Button>
                )}
            </div>

            <DataTable<Cashier>
                columns={columns}
                data={cashiers}
                searchPlaceholder="Поиск кассира..."
                searchKey="name"
            />

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCashier ? 'Edit Product' : 'Add Product'}
                        </DialogTitle>
                    </DialogHeader>
                    <CashierForm
                        cashier={editingCashier}
                        onSuccess={() => setIsFormOpen(false)}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}