import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Branch, Product } from '@/types/api.ts'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { productApi } from '@/api/productApi'

const formSchema = z.object({
    name: z.string().min(1, 'Обязательное поле'),
    barcode: z.string().min(1, 'Обязательное поле'),
    real_price: z
      .string()
      .transform(val => (val === '' ? 0 : Number(val))) // Transform empty string to 0, otherwise to number
      .refine(val => !isNaN(val), { message: 'Цена должна быть числом' })
      .refine(val => val >= 0, { message: 'Цена должна быть 0 или больше' }),
    price: z
        .string()
        .transform(val => (val === '' ? 0 : Number(val))) // Transform empty string to 0, otherwise to number
        .refine(val => !isNaN(val), { message: 'Цена должна быть числом' })
        .refine(val => val >= 0, { message: 'Цена должна быть 0 или больше' }),
    stock: z
        .string()
        .transform(val => (val === '' ? 0 : Number(val))) // Transform empty string to 0, otherwise to number
        .refine(val => !isNaN(val), { message: 'Количество должно быть числом' })
        .refine(val => val >= 0, { message: 'Количество должно быть 0 или больше' }),
    description: z.string().optional(),
    branch_id: z
        .string()
        .transform(val => Number(val))
        .refine(val => val >= 1, { message: 'Филиал должен быть выбран' })
})

type FormData = z.infer<typeof formSchema>

interface ProductFormProps {
    product?: Product
    branches: Branch[]
    onSuccess: () => void
    onCancel: () => void
}

export function ProductForm({ product, branches, onSuccess, onCancel }: ProductFormProps) {
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const queryClient = useQueryClient()

    // Mutation for creating a product
    const createMutation = useMutation({
        mutationFn: (data: Product) => productApi.create(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    // Mutation for updating a product
    const updateMutation = useMutation({
        mutationFn: (data: Partial<Product>) => productApi.update(product!.barcode, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['products'] })
        }
    })

    const defaultValues: FormData = {
        name: product?.name || '',
        barcode: product?.barcode || '',
        real_price: String(product?.real_price || 0),
        price: String(product?.price || 0),
        stock: String(product?.stock || 0),
        description: product?.description || '',
        branch_id: product?.branch_id || branches.length ? branches[0].id : 0,
    }

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues
    })

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true)

        // Prepare the payload by transforming the data to match the Product type
        const payload: Product = {
            name: data.name,
            barcode: data.barcode,
            price: Number(data.price), // Already transformed by Zod
            real_price: Number(data.real_price),
            stock: Number(data.stock), // Already transformed by Zod
            description: data.description,
            branch_id: Number(data.branch_id) // Already transformed by Zod
        }

        try {
            if (product) {
                // Update existing product
                const response = await updateMutation.mutateAsync(payload)
                if (response.data.statusCode > 201) {
                    throw new Error('Ошибка при обновлении товара')
                }
                toast({
                    title: 'Товар обновлен',
                    description: `${data.name} был успешно обновлен.`
                })
            } else {
                // Create new product
                const response = await createMutation.mutateAsync(payload)
                if (response.data.statusCode > 201) {
                    throw new Error('Ошибка при создании товара')
                }
                toast({
                    title: 'Товар создан',
                    description: `${data.name} был успешно создан.`
                })
            }
            onSuccess()
        } catch (error: any) {
            toast({
                title: 'Ошибка',
                description: error.message || 'Произошла ошибка при сохранении товара.',
                variant: 'destructive'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Название товара</FormLabel>
                            <FormControl>
                                <Input placeholder='Введите название товара' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='barcode'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Штрих-код</FormLabel>
                            <FormControl>
                                <Input placeholder='Введите штрих-код' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='branch_id'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Филиал</FormLabel>
                            <Select onValueChange={field.onChange} value={String(field.value)}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Выберите филиал' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {branches.map(branch => (
                                        <SelectItem key={String(branch.id)} value={String(branch.id)}>
                                            {branch.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='grid grid-cols-1 gap-6 sm:grid-cols-3'>
                    <FormField
                      control={form.control}
                      name='real_price'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Закупочная цена</FormLabel>
                          <FormControl>
                            <Input type='number' min={0} step={0.01} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                        control={form.control}
                        name='price'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Рыночная цена</FormLabel>
                                <FormControl>
                                    <Input type='number' min={0} step={0.01} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='stock'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Количество на складе</FormLabel>
                                <FormControl>
                                    <Input type='number' min={0} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                  control={form.control}
                  name='images'
                  render={() => (
                    <FormItem>
                      <FormLabel>TODO: Изображения (необязательно)</FormLabel>
                      <FormControl>
                        <Input type='file' />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Описание (необязательно)</FormLabel>
                            <FormControl>
                                <Textarea placeholder='Введите описание товара' className='resize-none' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className='flex justify-end space-x-2'>
                    <Button type='button' variant='outline' onClick={onCancel}>
                        Отмена
                    </Button>
                    <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Сохранение...' : product ? 'Обновить товар' : 'Создать товар'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
