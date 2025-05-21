import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {ColumnDef} from '@tanstack/react-table';
import {LoaderPinwheel, Plus} from 'lucide-react';
import {useMemo, useState} from 'react';

import {cashierApi} from '@/api/cashierApi';
import {getUserColumns} from '@/components/cashiers/Columns';
import {CashierForm} from '@/components/cashiers/CashierForm';
import {DataTable} from '@/components/common/DataTable';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {useAuth} from '@/contexts/AuthContext';
import {useToast} from '@/hooks/use-toast';
import type {AxiosError} from 'axios';
import type {Cashier} from '@/types/api';


export function UsersPage() {
    const {toast} = useToast();
    const {user} = useAuth();
    const isAdmin = user?.role === 'admin';

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<Cashier | undefined>();

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchValue, setSearchValue] = useState('');

    const queryClient = useQueryClient();

    const {
        data: pagedUsers = [],
        isLoading: listLoading,
        error: listError,
    } = useQuery<Cashier[], AxiosError>({
        queryKey: ['users', 'list', page, pageSize],
        queryFn: () =>
            cashierApi.getAll(page, pageSize).then(res => res.data.data),
        keepPreviousData: true,
        enabled: searchValue.trim() === '',
        onError: err => {
            toast({
                variant: 'destructive',
                title: 'Ошибка загрузки пользователей',
                description: err.response?.data?.message || err.message,
            });
        },
    });

    const {
        data: searchResults = [],
        isLoading: searchLoading,
        error: searchError,
    } = useQuery<Cashier[], AxiosError>({
        queryKey: ['users', 'search', searchValue],
        queryFn: () =>
            cashierApi.search(searchValue).then(res => res.data ?? []),
        enabled: Boolean(searchValue.trim()),
        onError: err => {
            toast({
                variant: 'destructive',
                title: 'Ошибка поиска пользователей',
                description: err.response?.data?.message || err.message,
            });
        },
    });


    const users = searchValue.trim() ? searchResults : pagedUsers;
    const isLoading = searchValue.trim() ? searchLoading : listLoading;
    const error = searchValue.trim() ? searchError : listError;
    const isSearching = Boolean(searchValue.trim());


    const {mutate: deleteUser} = useMutation({
        mutationFn: (id: number) => cashierApi.delete(id),
        onSuccess: () => {
            toast({title: 'Кассир удалён'});
            queryClient.invalidateQueries({queryKey: ['users']});
        },
        onError: (err: AxiosError) =>
            toast({
                variant: 'destructive',
                title: 'Ошибка удаления',
                description: err.message,
            }),
    });

    const columns: ColumnDef<Cashier>[] = useMemo(
        () =>
            getUserColumns(
                (user) => {
                    setEditingUser(user);
                    setIsFormOpen(true);
                },
                (id) => deleteUser(id)
            ),
        [deleteUser]
    );


    if (isLoading) return (
        <div className="centered-spin-icon">
            <LoaderPinwheel className="spin-icon"/>
        </div>
    );
    if (error) return <p>Error loading users: {error?.message}</p>;

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
                isLoading={isLoading}
                searchPlaceholder="Поиск пользователей..."
                searchKey="name"
                onRowClick={(user) => {
                    setEditingUser(user);
                    setIsFormOpen(true);
                }}
                handleChangeSearch={setSearchValue}
                isSearching={isSearching}
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
                            toast({title: 'Сохранено'});
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