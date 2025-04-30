import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CartItemModal } from './CartItemModal'
import { CustomerModal } from './CustomerModal'
import { SaleConfirmationModal } from './SaleConfirmationModal'
import { ShoppingCart, Users, CreditCard, Check, Trash } from 'lucide-react'
import { CartItem } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { saleApi } from '@/api/saleApi'

export function Cart() {
    const { items, removeItem, total, markAllAsDebt, customer } = useCart()
    const [editingItem, setEditingItem] = useState<CartItem | null>(null)
    const [isCartItemModalOpen, setIsCartItemModalOpen] = useState(false)
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleItemEdit = (item: CartItem) => {
        setEditingItem(item)
        setIsCartItemModalOpen(true)
    }

    const handleCustomerClick = () => {
        setIsCustomerModalOpen(true)
    }

    const handleDebtClick = () => {
        markAllAsDebt(true)
        if (!customer) {
            setIsCustomerModalOpen(true)
        }
    }

    // const handleSaleClick = () => {
    //     setIsConfirmModalOpen(true)
    // }

    const handleSaleClick = async () => {
      setIsLoading(true);
      try {
        // Формируем данные для запроса
        const saleData: CreateSaleData = items.map(item => ({
          item_barcode: item.productId,
          price: item.price,
          quantity: item.quantity,
          description: item.name, // Используем имя товара как описание
        }));
  
        console.log('Отправка данных продажи:', saleData); // Для отладки
  
        // Отправляем запрос
        const response = await saleApi.create(saleData);
        console.log('Ответ API:', response);
  
        // Очищаем корзину
        // clearCart();
  
        // Показываем уведомление об успехе
        toast({
          title: 'Продажа завершена',
          description: 'Продажа успешно зарегистрирована.',
        });
  
        // Закрываем модальное окно
        // onClose();
        setIsConfirmModalOpen(true)
      } catch (error) {
        console.error('Ошибка при завершении продажи:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось завершить продажу. Попробуйте снова.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
        <>
            <Card className='w-full'>
                <CardHeader>
                    <CardTitle className='flex items-center'>
                        <ShoppingCart className='mr-2 h-5 w-5' />
                        Текущая продажа
                    </CardTitle>
                    <CardDescription>
                        {items.length === 0
                            ? 'Сканируйте товары для добавления в корзину'
                            : `${items.length} товаров в корзине`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {items.length > 0 ? (
                        <div className='rounded-md border'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Товар</TableHead>
                                        <TableHead className='text-right'>Цена</TableHead>
                                        <TableHead className='text-right'>Кол-во</TableHead>
                                        <TableHead className='text-right'>Сумма</TableHead>
                                        <TableHead className='w-10'></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {items.map(item => (
                                        <TableRow
                                            key={item.id}
                                            className={`${
                                                item.isDebt ? 'bg-amber-50 dark:bg-amber-950/20' : ''
                                            } cursor-pointer hover:bg-muted`}
                                            onDoubleClick={() => handleItemEdit(item)}
                                        >
                                            <TableCell>{item.name}</TableCell>
                                            <TableCell className='text-right'>
                                                {formatCurrency(item.price)}
                                                {item.price !== item.originalPrice && (
                                                    <span className='ml-1 text-xs text-muted-foreground line-through'>
                                                        {formatCurrency(item.originalPrice)}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className='text-right'>{item.quantity}</TableCell>
                                            <TableCell className='text-right font-medium'>
                                                {formatCurrency(item.price * item.quantity)}
                                            </TableCell>
                                            <TableCell>
                                                <Button variant='outline' size='sm' onClick={() => removeItem(item.id)}>
                                                    <Trash className='h-4 w-4' />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className='flex h-40 items-center justify-center rounded-md border-2 border-dashed'>
                            <div className='text-center'>
                                <ShoppingCart className='mx-auto h-10 w-10 text-muted-foreground' />
                                <p className='mt-2 text-sm text-muted-foreground'>Корзина пуста</p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className='flex flex-col space-y-4'>
                    <div className='flex w-full justify-between'>
                        <span className='text-lg font-semibold'>Итого:</span>
                        <span className='text-lg font-bold'>{formatCurrency(total)}</span>
                    </div>

                    {items.length > 0 && (
                        <>
                            <div className='flex w-full space-x-2'>
                                <Button variant='outline' className='flex-1' onClick={handleCustomerClick}>
                                    <Users className='mr-2 h-4 w-4' />
                                    {customer ? 'Изменить клиента' : 'Добавить клиента'}
                                </Button>
                                <Button variant='outline' className='flex-1' onClick={handleDebtClick}>
                                    <CreditCard className='mr-2 h-4 w-4' />В долг
                                </Button>
                            </div>
                            <Button
                                className='w-full h-12 text-lg'
                                onClick={handleSaleClick}
                                disabled={items.length === 0}
                            >
                                <Check className='mr-2 h-5 w-5' />
                                Завершить продажу
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>

            <CartItemModal
                item={editingItem}
                isOpen={isCartItemModalOpen}
                onClose={() => setIsCartItemModalOpen(false)}
            />

            <CustomerModal isOpen={isCustomerModalOpen} onClose={() => setIsCustomerModalOpen(false)} />

            <SaleConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} />
        </>
    )
}
