import { useState, useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { CartItem } from '@/types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

interface CartItemModalProps {
    item: CartItem | null
    isOpen: boolean
    onClose: () => void
}

export function CartItemModal({ item, isOpen, onClose }: CartItemModalProps) {
    const { updateItem } = useCart()
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [isDebt, setIsDebt] = useState(false)

    useEffect(() => {
        if (item) {
            setPrice(item.price)
            setQuantity(item.quantity)
            setIsDebt(item.isDebt)
        }
    }, [item])

    const handleSave = () => {
        if (item) {
            updateItem(item.id, {
                price,
                quantity,
                isDebt
            })
            onClose()
        }
    }

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1)
        }
    }

    const increaseQuantity = () => {
        setQuantity(quantity + 1)
    }

    if (!item) return null

    const hasDiscount = price < item.originalPrice
    const discountPercentage = hasDiscount ? Math.round(((item.originalPrice - price) / item.originalPrice) * 100) : 0

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>Редактирование товара</DialogTitle>
                </DialogHeader>

                <div className='space-y-4 py-4'>
                    <div>
                        <h3 className='text-lg font-semibold'>{item.name}</h3>
                        <p className='text-sm text-muted-foreground'>
                            Оригинальная цена: {formatCurrency(item.originalPrice)}
                        </p>
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='price'>Цена</Label>
                        <Input
                            id='price'
                            type='number'
                            min='0'
                            step='0.01'
                            value={price}
                            onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                        />
                        {hasDiscount && (
                            <p className='text-sm text-green-600 dark:text-green-400'>Скидка {discountPercentage}%</p>
                        )}
                    </div>

                    <div className='space-y-2'>
                        <Label htmlFor='quantity'>Количество</Label>
                        <div className='flex items-center space-x-2'>
                            <Button type='button' variant='outline' size='icon' onClick={decreaseQuantity}>
                                <MinusCircle className='h-4 w-4' />
                            </Button>
                            <Input
                                id='quantity'
                                type='number'
                                min='1'
                                className='text-center'
                                value={quantity}
                                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                            />
                            <Button type='button' variant='outline' size='icon' onClick={increaseQuantity}>
                                <PlusCircle className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>

                    <div className='flex items-center space-x-2'>
                        <Checkbox id='debt' checked={isDebt} onCheckedChange={checked => setIsDebt(!!checked)} />
                        <Label htmlFor='debt' className='cursor-pointer'>
                            Продажа в долг
                        </Label>
                    </div>

                    <div className='pt-2'>
                        <p className='text-sm font-semibold'>Итого: {formatCurrency(price * quantity)}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant='outline' onClick={onClose}>
                        Отмена
                    </Button>
                    <Button onClick={handleSave}>Сохранить</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
