// import { useState } from 'react'
// import { useForm } from 'react-hook-form'
// import { z } from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useToast } from '@/hooks/use-toast'
// import { Button } from '@/components/ui/button'
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { Branch, Product } from '@/types'
// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
// import { productApi } from '@/api/productApi'

// const formSchema = z.object({
//     name: z.string().min(1, 'Обязательное поле'),
//     barcode: z.string().min(1, 'Обязательное поле'),
//     price: z
//         .string() // Accept string input from the form
//         .transform(val => Number(val)) // Transform to number
//         .refine(val => !isNaN(val), { message: 'Цена должна быть числом' })
//         .refine(val => val >= 0, { message: 'Цена должна быть 0 или больше' }),
//     stock: z
//         .string() // Accept string input from the form
//         .transform(val => Number(val)) // Transform to number
//         .refine(val => !isNaN(val), { message: 'Количество должно быть числом' })
//         .refine(val => val >= 0, { message: 'Количество должно быть 0 или больше' }),
//     description: z.string().optional(),
//     branch_id: z
//         .string()
//         .transform(val => Number(val))
//         .refine(val => val >= 1, { message: 'Филиал должен быть выбран' })
// })

// type FormData = z.infer<typeof formSchema>

// interface ProductFormProps {
//     product?: Product
//     branches: Branch[]
//     onSuccess: () => void
//     onCancel: () => void
// }

// export function ProductForm({ product, branches, onSuccess, onCancel }: ProductFormProps) {
//     const { toast } = useToast()
//     const [isSubmitting, setIsSubmitting] = useState(false)
//     const queryClient = useQueryClient()

//     // Mutation for creating a product
//     const createMutation = useMutation({
//         mutationFn: (data: Product) => productApi.create(data),
//         onSuccess: async () => {
//             await queryClient.invalidateQueries({ queryKey: ['products'] })
//         }
//     })

//     // Mutation for updating a product
//     const updateMutation = useMutation({
//         mutationFn: (data: Partial<Product>) => productApi.update(product!.barcode, data),
//         onSuccess: async () => {
//             await queryClient.invalidateQueries({ queryKey: ['products'] })
//         }
//     })

//     const defaultValues: FormData = {
//         name: product?.name || '',
//         barcode: product?.barcode || '',
//         price: product?.price ? Number(product.price).toFixed(2) : '0.00', // Convert to string with 2 decimal places
//         stock: product?.stock ? String(product.stock) : '0', // Convert to string
//         description: product?.description || '',
//         branch_id: product?.branch_id ? String(product.branch_id) : '0' // Convert to string
//     }

//     const form = useForm<FormData>({
//         resolver: zodResolver(formSchema),
//         defaultValues
//     })

//     const onSubmit = async (data: FormData) => {
//         setIsSubmitting(true)

//         // Prepare the payload by transforming the data to match the Product type
//         const payload: Product = {
//             name: data.name,
//             barcode: data.barcode,
//             price: Number(data.price), // Already transformed by Zod
//             stock: Number(data.stock), // Already transformed by Zod
//             description: data.description,
//             branch_id: Number(data.branch_id) // Already transformed by Zod
//         }

//         try {
//             if (product) {
//                 // Update existing product
//                 const response = await updateMutation.mutateAsync(payload)
//                 if (response.data.statusCode > 201) {
//                     throw new Error('Ошибка при обновлении товара')
//                 }
//                 toast({
//                     title: 'Товар обновлен',
//                     description: `${data.name} был успешно обновлен.`
//                 })
//             } else {
//                 // Create new product
//                 const response = await createMutation.mutateAsync(payload)
//                 if (response.data.statusCode > 201) {
//                     throw new Error('Ошибка при создании товара')
//                 }
//                 toast({
//                     title: 'Товар создан',
//                     description: `${data.name} был успешно создан.`
//                 })
//             }
//             onSuccess()
//         } catch (error: any) {
//             toast({
//                 title: 'Ошибка',
//                 description: error.message || 'Произошла ошибка при сохранении товара.',
//                 variant: 'destructive'
//             })
//         } finally {
//             setIsSubmitting(false)
//         }
//     }

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
//                 <FormField
//                     control={form.control}
//                     name='name'
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Название товара</FormLabel>
//                             <FormControl>
//                                 <Input placeholder='Введите название товара' {...field} />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name='barcode'
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Штрих-код</FormLabel>
//                             <FormControl>
//                                 <Input
//                                     placeholder='Введите штрих-код'
//                                     {...field}
//                                 />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <FormField
//                     control={form.control}
//                     name='branch_id'
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Филиал</FormLabel>
//                             <Select onValueChange={field.onChange} value={field.value}>
//                                 <FormControl>
//                                     <SelectTrigger>
//                                         <SelectValue placeholder='Выберите филиал' />
//                                     </SelectTrigger>
//                                 </FormControl>
//                                 <SelectContent>
//                                     {branches.map(branch => (
//                                         <SelectItem key={String(branch.id)} value={String(branch.id)}>
//                                             {branch.name}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
//                     <FormField
//                         control={form.control}
//                         name='price'
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Цена</FormLabel>
//                                 <FormControl>
//                                     <Input type='number' min={0} step={0.01} placeholder='0.00' {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />

//                     <FormField
//                         control={form.control}
//                         name='stock'
//                         render={({ field }) => (
//                             <FormItem>
//                                 <FormLabel>Количество на складе</FormLabel>
//                                 <FormControl>
//                                     <Input type='number' min={0} placeholder='0' {...field} />
//                                 </FormControl>
//                                 <FormMessage />
//                             </FormItem>
//                         )}
//                     />
//                 </div>

//                 <FormField
//                     control={form.control}
//                     name='description'
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel>Описание (необязательно)</FormLabel>
//                             <FormControl>
//                                 <Textarea placeholder='Введите описание товара' className='resize-none' {...field} />
//                             </FormControl>
//                             <FormMessage />
//                         </FormItem>
//                     )}
//                 />

//                 <div className='flex justify-end space-x-2'>
//                     <Button type='button' variant='outline' onClick={onCancel}>
//                         Отмена
//                     </Button>
//                     <Button type='submit' disabled={isSubmitting}>
//                         {isSubmitting ? 'Сохранение...' : product ? 'Обновить товар' : 'Создать товар'}
//                     </Button>
//                 </div>
//             </form>
//         </Form>
//     )
// }

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Branch, Product } from '@/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { productApi } from '@/api/productApi'

const formSchema = z.object({
    name: z.string().min(1, 'Обязательное поле'),
    barcode: z.string().min(1, 'Обязательное поле'),
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
        price: product?.price ? Number(product.price).toFixed(2) : '', // Empty string for new product
        stock: product?.stock ? String(product.stock) : '', // Empty string for new product
        description: product?.description || '',
        branch_id: product?.branch_id ? String(product.branch_id) : '0' // Default to '0' for select
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
                            <Select onValueChange={field.onChange} value={field.value}>
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

                <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                    <FormField
                        control={form.control}
                        name='price'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Цена</FormLabel>
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
