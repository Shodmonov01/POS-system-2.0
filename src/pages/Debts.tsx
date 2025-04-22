import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { Debt, Customer } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

// Mock data for debts
const mockDebts: Debt[] = [
  {
    id: '1',
    sale: {
      id: '101',
      items: [],
      total: 150.99,
      date: '2023-07-15T14:30:00Z',
      cashierId: '1',
      branchId: '1',
      isDebt: true,
    },
    customer: {
      name: 'John Doe',
      phone: '555-1234',
      comment: 'Regular customer',
    },
    amount: 150.99,
    date: '2023-07-15T14:30:00Z',
    isPaid: false,
  },
  {
    id: '2',
    sale: {
      id: '102',
      items: [],
      total: 89.5,
      date: '2023-07-10T10:15:00Z',
      cashierId: '2',
      branchId: '1',
      isDebt: true,
    },
    customer: {
      name: 'Jane Smith',
      phone: '555-5678',
      comment: 'Employee at XYZ Corp',
    },
    amount: 89.5,
    date: '2023-07-10T10:15:00Z',
    isPaid: true,
    paymentDate: '2023-07-20T09:45:00Z',
  },
  {
    id: '3',
    sale: {
      id: '103',
      items: [],
      total: 299.99,
      date: '2023-07-05T16:45:00Z',
      cashierId: '1',
      branchId: '1',
      isDebt: true,
    },
    customer: {
      name: 'Robert Johnson',
      phone: '555-9101',
    },
    amount: 299.99,
    date: '2023-07-05T16:45:00Z',
    isPaid: false,
  },
];

export function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>(mockDebts);
  
  const handleMarkAsPaid = (id: string) => {
    setDebts(
      debts.map((debt) =>
        debt.id === id
          ? {
              ...debt,
              isPaid: true,
              paymentDate: new Date().toISOString(),
            }
          : debt
      )
    );
  };
  
  const columns: ColumnDef<Debt>[] = [
    {
      accessorKey: 'customer.name',
      header: 'Customer',
      cell: ({ row }) => {
        const customer: Customer = row.original.customer;
        return (
          <div>
            <div className="font-medium">{customer.name}</div>
            <div className="text-sm text-muted-foreground">{customer.phone}</div>
          </div>
        );
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.amount),
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      accessorKey: 'isPaid',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={row.original.isPaid ? 'outline' : 'default'}>
          {row.original.isPaid ? 'Paid' : 'Pending'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const debt = row.original;
        
        return (
          <div className="flex justify-end">
            {!debt.isPaid && (
              <Button
                size="sm"
                onClick={() => handleMarkAsPaid(debt.id)}
                className="h-8 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Paid
              </Button>
            )}
            {debt.isPaid && (
              <Button size="sm" variant="outline" disabled className="h-8">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Paid
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  const pendingDebts = debts.filter((debt) => !debt.isPaid);
  const totalPending = pendingDebts.reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Debts</h2>
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Pending Debts
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {pendingDebts.length} customers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Oldest Pending Debt
            </CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingDebts.length > 0
                ? formatDate(
                    pendingDebts.reduce((oldest, debt) =>
                      debt.date < oldest.date ? debt : oldest
                    ).date
                  )
                : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {pendingDebts.length > 0
                ? `${
                    pendingDebts.reduce((oldest, debt) =>
                      debt.date < oldest.date ? debt : oldest
                    ).customer.name
                  }`
                : 'No pending debts'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Payments
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                debts
                  .filter((debt) => debt.isPaid)
                  .reduce((sum, debt) => sum + debt.amount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {debts.filter((debt) => debt.isPaid).length} payments received
            </p>
          </CardContent>
        </Card>
      </div>
      
      <DataTable
        columns={columns}
        data={debts}
        searchPlaceholder="Search debts..."
        searchKey="customer.name"
      />
    </div>
  );
}