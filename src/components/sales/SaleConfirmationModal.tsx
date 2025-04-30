// import { useCart } from '@/contexts/CartContext';
// import { useAuth } from '@/contexts/AuthContext';
// import { useToast } from '@/hooks/use-toast';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { formatCurrency } from '@/lib/utils';
// import { CreditCard, DollarSign } from 'lucide-react';

// interface SaleConfirmationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function SaleConfirmationModal({
//   isOpen,
//   onClose,
// }: SaleConfirmationModalProps) {
//   const { items, total, customer, clearCart } = useCart();
//   const { user } = useAuth();
//   const { toast } = useToast();

//   const anyDebtItems = items.some((item) => item.isDebt);

//   const handleConfirm = () => {
//     // In a real app, this would make an API call to create the sale

//     // Simulate a server delay
//     setTimeout(() => {
//       toast({
//         title: 'Sale completed',
//         description: `Total: ${formatCurrency(total)}`,
//       });

//       clearCart();
//       onClose();
//     }, 1000);
//   };

//   if (items.length === 0) return null;

//   return (
//     <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Confirm Sale</DialogTitle>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           {anyDebtItems && !customer && (
//             <div className="rounded-md bg-destructive/10 p-3 text-destructive">
//               <p className="text-sm font-medium">
//                 Customer information is required for debt items.
//               </p>
//             </div>
//           )}

//           {customer && (
//             <div className="space-y-1">
//               <p className="text-sm font-semibold">Customer Details:</p>
//               <p className="text-sm">
//                 {customer.name} | {customer.phone}
//               </p>
//               {customer.comment && (
//                 <p className="text-xs text-muted-foreground">
//                   Note: {customer.comment}
//                 </p>
//               )}
//             </div>
//           )}

//           <div className="rounded-md border">
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>Item</TableHead>
//                   <TableHead className="text-right">Price</TableHead>
//                   <TableHead className="text-right">Qty</TableHead>
//                   <TableHead className="text-right">Total</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {items.map((item) => (
//                   <TableRow
//                     key={item.id}
//                     className={item.isDebt ? 'bg-amber-50 dark:bg-amber-950/20' : ''}
//                   >
//                     <TableCell className="font-medium">
//                       {item.name}
//                       {item.isDebt && (
//                         <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded">
//                           Debt
//                         </span>
//                       )}
//                     </TableCell>
//                     <TableCell className="text-right">
//                       {formatCurrency(item.price)}
//                     </TableCell>
//                     <TableCell className="text-right">{item.quantity}</TableCell>
//                     <TableCell className="text-right">
//                       {formatCurrency(item.price * item.quantity)}
//                     </TableCell>
//                   </TableRow>
//                 ))}
//                 <TableRow>
//                   <TableCell colSpan={3} className="text-right font-bold">
//                     Total:
//                   </TableCell>
//                   <TableCell className="text-right font-bold">
//                     {formatCurrency(total)}
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//             </Table>
//           </div>

//           <div className="text-sm text-muted-foreground">
//             <p>Cashier: {user?.name}</p>
//           </div>
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>
//             Cancel
//           </Button>
//           <Button
//             onClick={handleConfirm}
//             disabled={anyDebtItems && !customer}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             {anyDebtItems ? (
//               <>
//                 <CreditCard className="mr-2 h-4 w-4" />
//                 Confirm Sale with Debt
//               </>
//             ) : (
//               <>
//                 <DollarSign className="mr-2 h-4 w-4" />
//                 Confirm Sale
//               </>
//             )}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useCart } from '@/contexts/CartContext'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils'
import { CreditCard, DollarSign } from 'lucide-react'

interface SaleConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SaleConfirmationModal({ isOpen, onClose }: SaleConfirmationModalProps) {
    const { items, total, customer, clearCart } = useCart()
    const { user } = useAuth()
    const { toast } = useToast()

    const anyDebtItems = items.some(item => item.isDebt)

    const handleConfirm = () => {
        // В реальном приложении здесь был бы API вызов для оформления продажи

        // Имитация задержки сервера
        setTimeout(() => {
            toast({
                title: 'Продажа оформлена',
                description: `Итого: ${formatCurrency(total)}`
            })

            clearCart()
            onClose()
        }, 1000)
    }

    if (items.length === 0) return null

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Подтверждение продажи</DialogTitle>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    {anyDebtItems && !customer && (
                        <div className='rounded-md bg-destructive/10 p-3 text-destructive'>
                            <p className='text-sm font-medium'>Для продажи в долг требуется информация о клиенте.</p>
                        </div>
                    )}

                    {customer && (
                        <div className='space-y-1'>
                            <p className='text-sm font-semibold'>Данные клиента:</p>
                            <p className='text-sm'>
                                {customer.name} | {customer.phone}
                            </p>
                            {customer.comment && (
                                <p className='text-xs text-muted-foreground'>Примечание: {customer.comment}</p>
                            )}
                        </div>
                    )}

                    <div className='rounded-md border'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Товар</TableHead>
                                    <TableHead className='text-right'>Цена</TableHead>
                                    <TableHead className='text-right'>Кол-во</TableHead>
                                    <TableHead className='text-right'>Сумма</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map(item => (
                                    <TableRow
                                        key={item.id}
                                        className={item.isDebt ? 'bg-amber-50 dark:bg-amber-950/20' : ''}
                                    >
                                        <TableCell className='font-medium'>
                                            {item.name}
                                            {item.isDebt && (
                                                <span className='ml-2 text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-1.5 py-0.5 rounded'>
                                                    Долг
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className='text-right'>{formatCurrency(item.price)}</TableCell>
                                        <TableCell className='text-right'>{item.quantity}</TableCell>
                                        <TableCell className='text-right'>
                                            {formatCurrency(item.price * item.quantity)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3} className='text-right font-bold'>
                                        Итого:
                                    </TableCell>
                                    <TableCell className='text-right font-bold'>{formatCurrency(total)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>

                    <div className='text-sm text-muted-foreground'>
                        <p>Кассир: {user?.name}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={anyDebtItems && !customer}
                        className='bg-green-600 hover:bg-green-700'
                    >
                        {anyDebtItems ? (
                            <>
                                <CreditCard className='mr-2 h-4 w-4' />
                                Подтвердить продажу в долг
                            </>
                        ) : (
                            <>
                                <DollarSign className='mr-2 h-4 w-4' />
                                Подтвердить продажу
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
