import { useForm } from 'react-hook-form';
import { cashierApi } from '@/api/cashierApi';
import { Cashier } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Branch} from "@/types";
import {useEffect, useState} from "react";
import {branchApi} from "@/api/branchApi.ts";

interface CashierFormProps {
    cashier?: Cashier;
    onSuccess: () => void;
    onCancel: () => void;
}

interface CashierFormFields {
    name: string;
    branch_id: number;
    password: string;
}

export function CashierForm({ cashier, onSuccess, onCancel }: CashierFormProps) {
    const [branches, setBranches] = useState<Branch[]>([]);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await branchApi.getAll();
                setBranches(response.data);
            } catch (error) {
                console.error('Failed to load branches:', error);
            }
        };

        fetchBranches();
    }, []);

    const { register, handleSubmit, reset } = useForm<CashierFormFields>({
        defaultValues: {
            name: cashier?.name || '',
            branch_id: cashier?.branchId ?? 0,
            password: '',
        }
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
            <Input {...register('name', { required: true })} placeholder="Имя" />
            <select
                {...register('branch_id', { required: true, valueAsNumber: true })}
                className="w-full border rounded px-3 py-2 bg-white text-black"
            >
                <option value="">Выберите филиал</option>
                {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                        {branch.name}
                    </option>
                ))}
            </select>
            <Input
                type="password"
                {...register('password', { required: true })}
                placeholder="Пароль"
            />


            <div className="flex gap-4">
                <Button type="submit">Сохранить</Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Отмена
                </Button>
            </div>
        </form>
    );
}
