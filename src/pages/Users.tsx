import {useMemo, useState} from 'react';
import {useMutation, useQuery, useQueryClient, UseQueryResult} from '@tanstack/react-query';
import {ColumnDef} from "@tanstack/react-table";
import type {AxiosError} from 'axios';
import {LoaderPinwheel, Plus} from 'lucide-react';

import {cashierApi} from '@/api/cashierApi';
import {CashierForm} from '@/components/cashiers/CashierForm';
import {getUserColumns} from '@/components/cashiers/Columns';
import {DataTable} from '@/components/common/DataTable';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {useToast} from '@/hooks/use-toast';
import {useAuth} from '@/contexts/AuthContext';

import type {Cashier} from '@/types/api';

export function UsersPage() {
    const {toast} = useToast();
    const {user} = useAuth();
    const isAdmin = user?.role === 'admin';

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<Cashier | undefined>()

    const queryClient = useQueryClient();

    const {
        data: users = [],
        isLoading: isUsersLoading,
        isError: isUsersError,
        error: usersError,
    }: UseQueryResult<Cashier[], AxiosError> = useQuery({
        queryKey: ['users'],
        queryFn: () => cashierApi.getAll().then(res => res.data),
        staleTime: 5 * 60 * 1000,
    });

    const {mutate: deleteUser} = useMutation({
        mutationFn: (id: number) => cashierApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['users']});
        },
        onError: (err: AxiosError) => {
            console.error('Delete failed:', err.response?.status, err.response?.data);
            alert(`Could not delete user: ${err.message}`);
        },
    });

    const columns: ColumnDef<Cashier>[] = useMemo(
        () =>
            getUserColumns(
                user => {
                    setEditingUser(user);
                    setIsFormOpen(true);
                },
                id => deleteUser(id)
            ),
        [deleteUser]
    );


    if (isUsersLoading) return (
        <div className="centered-spin-icon">
            <LoaderPinwheel className="spin-icon"/>
        </div>
    );
    if (isUsersError) return <p>Error loading users: {usersError?.message}</p>;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Пользователи</h2>
                {isAdmin && (
                    <Button
                        onClick={() => {
                            setEditingUser(undefined);
                            setIsFormOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4"/>
                        Добавить пользователя
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
                        onSuccess={() => {
                            queryClient.invalidateQueries({queryKey: ['users']});
                            setIsFormOpen(false);
                        }}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}