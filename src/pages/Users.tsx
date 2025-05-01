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
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getUserColumns} from "@/components/cashiers/Columns.tsx";
import {AxiosError} from "axios";


export function UsersPage() {
    const {toast} = useToast();
    const {user} = useAuth();
    const isAdmin = user?.role === 'admin';

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<Cashier | undefined>()

    const queryClient = useQueryClient()

    const { data: users = [], isLoading, error } = useQuery<Cashier[], AxiosError>({
        queryKey: ['users'],
        queryFn: async () => (await cashierApi.getAll()).data,
        staleTime: 5 * 60 * 1000,
        onError: () => toast({ title: 'Ошибка загрузки пользователей', variant: 'destructive' }),
    })

    const deleteMutation = useMutation({
        mutationFn: (id: number) => cashierApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    })

    if (isLoading) return <p>Loading users…</p>
    if (error) return <p>Error loading users: {error.message}</p>

    const columns = getUserColumns(
        usr => { setEditingUser(usr); setIsFormOpen(true) },
        id => deleteMutation.mutate(id)
    )

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Пользователи</h2>
                {isAdmin && (
                    <Button onClick={() => { setEditingUser(undefined); setIsFormOpen(true) }}>
                        <Plus className="mr-2 h-4 w-4" /> Добавить пользователя
                    </Button>
                )}
            </div>

            <DataTable<Cashier>
                columns={columns}
                data={users}
                searchPlaceholder="Поиск пользователей..."
                searchKey="name"
            />

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
                        </DialogTitle>
                    </DialogHeader>
                    <CashierForm
                        cashier={editingUser}
                        onSuccess={() => { queryClient.invalidateQueries({ queryKey: ['users'] }); setIsFormOpen(false) }}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}