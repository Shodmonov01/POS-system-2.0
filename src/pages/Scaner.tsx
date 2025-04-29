import { useState, useEffect } from 'react'
import { BarcodeInput } from '@/components/common/BarcodeInput'
import { Cart } from '@/components/sales/Cart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingBag, RotateCcw, CreditCard } from 'lucide-react'
import { format } from 'date-fns'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/hooks/use-toast'
import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { productApi } from '@/api/productApi'

export function ScanerPage() {
    const { toast } = useToast()
    const { addItem } = useCart()
    const [recentScan, setRecentScan] = useState<Product | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const response = await productApi.getAll(page)
                console.log('Full API response:', response.data)

                const products = response.data
                console.log('Products:', products)

                setProducts(products)
                setTotalPages(1) // Замените на реальную логику для totalPages
            } catch (error) {
                console.error('API error:', error)
                toast({
                    title: 'Ошибка',
                    description: 'Не удалось загрузить товары',
                    variant: 'destructive'
                })
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [page, toast])

    const handleScan = async (barcode: string) => {
        try {
            const response = await productApi.getByBarcode(barcode)
            const product = response.data

            // const response = await productApi.getByBarcode(barcode);
            // const product = response.data.data;

            if (product) {
                addItem({
                    productId: product.barcode,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.price,
                    quantity: 1,
                    isDebt: false
                })

                setRecentScan(product)
            }
        } catch (error) {
            toast({
                title: 'Товар не найден',
                description: `Товар с баркодом ${barcode} не найден`,
                variant: 'destructive'
            })
        }
    }

    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1)
    }

    const handleNextPage = () => {
        if (page < totalPages) setPage(page + 1)
    }

    return (
        <div className='space-y-6'>
            <div className='flex items-center justify-between'>
                <h2 className='text-3xl font-bold tracking-tight'>Продажи</h2>
            
            </div>

            <div className='grid gap-6 md:grid-cols-2'>
                <div className='flex flex-col space-y-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center'>
                                <ShoppingBag className='mr-2 h-5 w-5' />
                                Сканировать товары
                            </CardTitle>
                            <CardDescription>Сканируйте штрих-код или ищите товары</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BarcodeInput
                                onScan={handleScan}
                                placeholder='Сканируйте штрих-код или ищите товары...'
                                className='text-lg'
                            />

                            {recentScan && (
                                <div className='mt-4 rounded-md bg-muted p-4'>
                                    <div className='flex items-center justify-between'>
                                        <div>
                                            <p className='font-medium'>{recentScan.name}</p>
                                            <p className='text-sm text-muted-foreground'>{recentScan.barcode}</p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-bold'>{formatCurrency(Number(recentScan.price))}</p>
                                            <p className='text-sm text-muted-foreground'>
                                                В наличии: {recentScan.stock}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {loading ? (
                                <p>Загрузка товаров...</p>
                            ) : products.length === 0 ? (
                                <p>Товары не найдены</p>
                            ) : (
                                <>
                                    <div className='mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3'>
                                        {products.map(product => (
                                            <Button
                                                key={product.id}
                                                variant='outline'
                                                className='h-20 flex flex-col justify-center'
                                                onClick={() => handleScan(product.barcode)}
                                            >
                                                <span className='font-medium'>{product.name}</span>
                                                <span className='text-xs text-muted-foreground'>
                                                    {formatCurrency(Number(product.price))}
                                                </span>
                                            </Button>
                                        ))}
                                    </div>

                                    <div className='mt-4 flex justify-between'>
                                        <Button variant='outline' disabled={page === 1} onClick={handlePreviousPage}>
                                            Назад
                                        </Button>
                                        <span className='self-center'>
                                            Страница {page} из {totalPages}
                                        </span>
                                        <Button
                                            variant='outline'
                                            disabled={page === totalPages}
                                            onClick={handleNextPage}
                                        >
                                            Вперед
                                        </Button>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Продажи за сегодня</CardTitle>
                            <CardDescription>{format(new Date(), 'EEEE, MMMM d, yyyy')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex justify-between'>
                                <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Общие продажи</p>
                                    <p className='text-2xl font-bold'>{formatCurrency(1254.99)}</p>
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Заказы</p>
                                    <p className='text-2xl font-bold'>15</p>
                                </div>
                                <div>
                                    <p className='text-sm font-medium text-muted-foreground'>Средний чек</p>
                                    <p className='text-2xl font-bold'>{formatCurrency(83.67)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Cart />
                </div>
            </div>
        </div>
    )
}
