import {useMemo, useState} from 'react';
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ColumnDef} from "@tanstack/react-table";
import {Plus} from 'lucide-react';

import {DataTable} from '@/components/common/DataTable';
import {Button} from '@/components/ui/button';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {BranchForm} from "@/components/branches/BranchForm.tsx";
import {getBranchColumns} from "@/components/branches/Columns.tsx";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {branchApi} from "@/api/branchApi.ts";

import {Branch} from '@/types';
import {AxiosError} from "axios";
import {UseQueryResult} from "@tanstack/react-query/build/modern";


export function BranchesPage() {
    const {user} = useAuth();
    const isAdmin = user?.role === 'admin';

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | undefined>(undefined);

    const queryClient = useQueryClient();

    const {
        data: branches = [],
        isLoading: isBranchesLoading,
        isError: isBranchesError,
        error: branchesError,
    }: UseQueryResult<Branch[], AxiosError> = useQuery({
        queryKey: ['branches'],
        queryFn: () => branchApi.getAll().then(res => res.data),
        staleTime: 5 * 60 * 1000,
    });

    const {
        mutate: deleteBranch,
        isLoading: isDeleting,
        isError: isDeleteError,
        error: deleteError,
    } = useMutation({
        mutationFn: (id: number) => branchApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['branches']});
        },
        onError: (err: AxiosError) => {
            console.error('Delete failed:', err.response?.status, err.response?.data);
            alert(`Could not delete branch: ${err.message}`);
        },
    });

    const columns: ColumnDef<Branch>[] = useMemo(
        () =>
            getBranchColumns(
                branch => {
                    setEditingBranch(branch);
                    setIsFormOpen(true);
                },
                id => deleteBranch(id)
            ),
        [deleteBranch]
    );

    if (isBranchesLoading) {
        return <p>Loading branches…</p>;
    }
    if (isBranchesError) {
        return <p>Error loading branches: {branchesError?.message}</p>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Филиалы</h2>
                {isAdmin && (
                    <Button
                        onClick={() => {
                            setEditingBranch(undefined);
                            setIsFormOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4"/>
                        Добавить филиал
                    </Button>
                )}
            </div>

            <DataTable<Branch>
                columns={columns}
                data={branches ?? []}
                searchPlaceholder="Поиск филиалов..."
                searchKey="name"
            />

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingBranch ? 'Редактировать филиал' : 'Добавить филиал'}
                        </DialogTitle>
                    </DialogHeader>
                    <BranchForm
                        branch={editingBranch}
                        onSuccess={() => {
                            queryClient.invalidateQueries({queryKey: ['branches']});
                            setIsFormOpen(false);
                        }}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
