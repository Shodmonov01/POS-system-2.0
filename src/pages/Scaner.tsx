import { useState, useEffect } from 'react'
import { BarcodeInput } from '@/components/common/BarcodeInput'
import { Cart } from '@/components/sales/Cart'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShoppingBag } from 'lucide-react'
import { format } from 'date-fns'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/hooks/use-toast'
import { Product } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { productApi } from '@/api/productApi'
import { ru } from 'date-fns/locale' // Добавляем локализацию для русского языка

export function ScanerPage() {
    const { toast } = useToast()
    const { addItem } = useCart()
    const [recentScan, setRecentScan] = useState<Product | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const itemsPerPage = 10 // Количество товаров на странице

    // Загрузка товаров при изменении страницы
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // setLoading(true);
                // // Предполагаем, что API возвращает данные с пагинацией
                // const response = await productApi.getAll({ page });
                // console.log('Ответ API:', response);
                setLoading(true)
                const response = await productApi.getAll(page)
                console.log('Full API response:', response.data)

                const fetchedProducts = response.data.products || response.data // Адаптируем под структуру ответа
                const totalItems = response.data.total || 0 // Общее количество товаров

                setProducts(fetchedProducts)
                setTotalPages(Math.ceil(totalItems / itemsPerPage))
            } catch (error) {
                console.error('Ошибка API:', error)
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

    // Обработка сканирования или ручного ввода штрих-кода
    const handleScan = async (barcode: string) => {
        try {
            const response = await productApi.search({ q: barcode })
            const products = response.data

            if (products && products.length > 0) {
                const product = products[0] // Берем первый найденный товар

                addItem({
                    productId: product.barcode,
                    name: product.name,
                    price: product.price,
                    originalPrice: product.price,
                    quantity: 1,
                    isDebt: false
                })

                setRecentScan(product)
            } else {
                throw new Error('Товар не найден')
            }
        } catch (error) {
            toast({
                title: 'Товар не найден',
                description: `Товар с баркодом ${barcode} не найден`,
                variant: 'destructive'
            })
        }
    }

    // Переход на предыдущую страницу
    const handlePreviousPage = () => {
        if (page > 1) setPage(page - 1)
    }

    // Переход на следующую страницу
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

                            {/* {loading ? (
                <p>Загрузка товаров...</p>
              ) : products.length === 0 ? (
                <p>Товары не найдены</p>
              ) : (
                <>
                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {products.map((product) => (
                      <Button
                        key={product.id}
                        variant="outline"
                        className="h-20 flex flex-col justify-center"
                        onClick={() => handleScan(product.barcode)}
                      >
                        <span className="font-medium">{product.name}</span>
                        <span className="font-medium">{product.barcode}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatCurrency(Number(product.price))}
                        </span>
                      </Button>
                    ))}
                  </div>

                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" disabled={page === 1} onClick={handlePreviousPage}>
                      Назад
                    </Button>
                    <span className="self-center">
                      Страница {page} из {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={page === totalPages}
                      onClick={handleNextPage}
                    >
                      Вперед
                    </Button>
                  </div>
                </>
              )} */}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Продажи за сегодня</CardTitle>
                            <CardDescription>
                                {format(new Date(), 'EEEE, MMMM d, yyyy', { locale: ru })}
                            </CardDescription>
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
