import {Cashier} from "@/types/api.ts";

export interface CashierFormProps {
    cashier?: Cashier;
    onSuccess: () => void;
    onCancel: () => void;
}

export interface CashierFormFields {
    name: string;
    branch_id: number;
    password: string;
}