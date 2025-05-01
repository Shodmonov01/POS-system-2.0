import {useState} from 'react';
import {DataTable} from '@/components/common/DataTable';
import {Button} from '@/components/ui/button';
import {Plus} from 'lucide-react';
import {Branch} from '@/types';
import {branchApi} from "@/api/branchApi.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {BranchForm} from "@/components/branches/BranchForm.tsx";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {AxiosError} from "axios";
import {getBranchColumns} from "@/components/branches/Columns.tsx";


export function BranchesPage() {
    const {user} = useAuth();
    const isAdmin = user?.role === 'admin';

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | undefined>(undefined);

    const queryClient = useQueryClient();

    const {data: branches = [], isLoading, error} = useQuery<Branch[], AxiosError>({
        queryKey: ['branches'],
        queryFn: async () => (await branchApi.getAll()).data,
        staleTime: 5 * 60 * 1000,
    })

    // Delete branch mutation
    const deleteMutation = useMutation({
        mutationFn: (id: number) => branchApi.delete(id),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['branches']}),
    })

    if (isLoading) return <p>Loading branches…</p>
    if (error) return <p>Error loading branches: {error.message}</p>

    const columns = getBranchColumns(
        branch => {
            setEditingBranch(branch)
            setIsFormOpen(true)
        },
        id => deleteMutation.mutate(id)
    )


    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Филиалы</h2>
                {isAdmin && (
                    <Button onClick={() => {
                        setEditingBranch(undefined);
                        setIsFormOpen(true)
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
                            queryClient.invalidateQueries(['branches'])
                            setIsFormOpen(false)
                        }}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
