import { useForm } from 'react-hook-form';
import { branchApi } from '@/api/branchApi';
import { Branch } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BranchFormProps {
    branch?: Branch;
    onSuccess: () => void;
    onCancel: () => void;
}

// Define form fields
interface BranchFormFields {
    name: string;
    address: string | null;
    contact: string | null;
}

export function BranchForm({ branch, onSuccess, onCancel }: BranchFormProps) {
    const { register, handleSubmit } = useForm<BranchFormFields>({
        defaultValues: branch
            ? {
                name: branch.name,
                address: branch.address || '',
                contact: branch.contact || '',
            }
            : {
                name: '',
                address: '',
                contact: '',
            },
    });

    const onSubmit = async (values: BranchFormFields) => {
        try {
            if (branch?.id) {
                await branchApi.update(branch.id, values);
            } else {
                await branchApi.create(values);
            }
            onSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register('name')} placeholder="Название филиала" />
            <Input {...register('address')} placeholder="Адрес" />
            <Input {...register('contact')} placeholder="Контакт" />
            <div className="flex gap-4">
                <Button type="submit">Сохранить</Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Отмена
                </Button>
            </div>
        </form>
    );
}
