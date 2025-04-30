import { useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface CustomerModalProps {
    isOpen: boolean
    onClose: () => void
}

const formSchema = z.object({
    name: z.string().min(1, 'Обязательное поле'),
    phone: z.string().min(1, 'Обязательное поле'),
    comment: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

export function CustomerModal({ isOpen, onClose }: CustomerModalProps) {
    const { customer, setCustomer } = useCart()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            phone: '',
            comment: ''
        }
    })

    useEffect(() => {
        if (customer) {
            form.reset({
                name: customer.name,
                phone: customer.phone,
                comment: customer.comment || ''
            })
        }
    }, [customer, form])

    const onSubmit = (data: FormData) => {
        setCustomer({
            name: data.name,
            phone: data.phone,
            comment: data.comment
        })
        onClose()
    }

    const handleRemoveCustomer = () => {
        setCustomer(null)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>{customer ? 'Редактирование клиента' : 'Добавление клиента'}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 py-2'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Имя</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Имя клиента' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='phone'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Телефон</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Номер телефона' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='comment'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Комментарий (необязательно)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Дополнительная информация'
                                            className='resize-none'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className='pt-4'>
                            {customer && (
                                <Button type='button' variant='destructive' onClick={handleRemoveCustomer}>
                                    Удалить
                                </Button>
                            )}
                            <Button type='button' variant='outline' onClick={onClose}>
                                Отмена
                            </Button>
                            <Button type='submit'>Сохранить</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
