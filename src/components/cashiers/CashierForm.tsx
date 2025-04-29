import { useForm } from 'react-hook-form';
import { cashierApi } from '@/api/cashierApi';
import { Cashier } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CashierFormProps {
    cashier?: Cashier;
    onSuccess: () => void;
    onCancel: () => void;
}

interface CashierFormFields {
    name: string;
    email: string;
    branchId: string;
    role: string;
}

export function CashierForm({ cashier, onSuccess, onCancel }: CashierFormProps) {
    const { register, handleSubmit, reset } = useForm({
        defaultValues: cashier
            ? {
                name: cashier.name,
                email: cashier.email,
                branchId: cashier.branchId,
                role: cashier.role,
            }
            : {
                name: '',
                email: '',
                branchId: '',
                role: 'cashier',
            },
    });

    const onSubmit = async (values: CashierFormFields) => {
        try {
            if (cashier?.id) {
                await cashierApi.update(cashier.id, values);
            } else {
                await cashierApi.create(values);
            }
            onSuccess();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register('name')} placeholder="Имя" />
            <Input {...register('email')} placeholder="Email" />
            <Input {...register('branchId')} placeholder="ID Филиала" />
            {/* Hidden input for role, because it should always be 'cashier' */}
            <input type="hidden" {...register('role')} value="cashier" />

            <div className="flex gap-4">
                <Button type="submit">Сохранить</Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Отмена
                </Button>
            </div>
        </form>
    );
}
