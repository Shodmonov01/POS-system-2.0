import {useEffect} from 'react';
import {useForm} from 'react-hook-form';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import type {AxiosError, AxiosResponse} from 'axios';

import {branchApi} from '@/api/branchApi';
import {cashierApi} from '@/api/cashierApi';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import type {Branch} from '@/types';
import type {ApiResponse, Cashier} from '@/types/api';
import type {CashierFormFields, CashierFormProps} from '@/types/forms';

export function CashierForm({cashier, onSuccess, onCancel}: CashierFormProps) {
    const queryClient = useQueryClient();

    const {data: branches = [], isLoading: isBranchesLoading, error: branchesError} = useQuery<
        Branch[],
        AxiosError
    >({
        queryKey: ['branches', 1, 1000],
        // 🔧 unwrap .data.data (API wraps branches in .data)
        queryFn: () => branchApi.getAll(1, 1000).then(res => res.data.data),
        staleTime: 5 * 60 * 1000,
    });

    const {register, handleSubmit, reset, formState: {errors}} = useForm<CashierFormFields>();

    // 🔧 reset defaults once branches & cashier are loaded
    useEffect(() => {
        if (!isBranchesLoading) {
            reset({
                name: cashier?.name ?? '',
                branch_id: cashier?.branch_id ?? branches[0]?.id ?? undefined,
                password: '',
            });
        }
    }, [branches, cashier, isBranchesLoading, reset]);

    // 🔧 combined create/update mutation
    const {mutate, isLoading, isError, error: mutError} = useMutation<
        AxiosResponse<ApiResponse<Cashier>>,
        AxiosError,
        CashierFormFields
    >({
        mutationFn: values => {
            const payload: CashierFormFields = {
                name: values.name,
                branch_id: values.branch_id,
                password: values.password,
            };
            return cashier?.id
                ? cashierApi.update(cashier.id, payload)
                : cashierApi.create(payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['users']});
            onSuccess();
            if (!cashier) reset();
        },
    });

    const onSubmit = (values: CashierFormFields) => mutate(values);

    if (isBranchesLoading) return <div>Loading branches…</div>;
    if (branchesError) return <div>Error loading branches: {branchesError.message}</div>;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <label>
                Имя
                <Input {...register('name', {required: true})} placeholder="Имя"/>
                {errors.name && <p className="text-red-500">Name is required</p>}
            </label>

            <label>
                Филиал
                <select
                    {...register('branch_id', {required: true, valueAsNumber: true})}
                    className="w-full border rounded px-3 py-2 bg-white text-black"
                >
                    {/* 🔧 explicit placeholder */}
                    <option disabled value="">
                        — Выберите филиал —
                    </option>
                    {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>
                            {branch.name}
                        </option>
                    ))}
                </select>
                {errors.branch_id && <p className="text-red-500">Branch is required</p>}
            </label>

            <label>
                Пароль
                <Input
                    type="password"
                    {...register('password', {required: true})}
                    placeholder="Пароль"
                />
                {errors.password && <p className="text-red-500">Password is required</p>}
            </label>

            {isError && <div className="text-red-500">Submission error: {mutError?.message}</div>}

            <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Сохраняем…' : 'Сохранить'}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Отмена
                </Button>
            </div>
        </form>
    );
}