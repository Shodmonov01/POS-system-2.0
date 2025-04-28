import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { Eye, EyeOff, ShoppingCart } from 'lucide-react'

const formSchema = z.object({
    login: z.string().min(1, 'Логин обязателен'),
    password: z.string().min(1, 'Пароль обязателен')
})

type FormData = z.infer<typeof formSchema>

export function LoginPage() {
    const { login } = useAuth()
    const { toast } = useToast()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: '',
            password: ''
        }
    })

    const onSubmit = async (data: FormData) => {
        setIsLoading(true)

        try {
            await login(data.login, data.password)
            navigate('/dashboard')
        } catch (error) {
            toast({
                title: 'Ошибка входа',
                description: 'Неверный логин или пароль',
                variant: 'destructive'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className='flex min-h-screen items-center justify-center bg-secondary/30 p-4'>
            <Card className=' max-w-md shadow-lg'>
                <CardHeader className='space-y-1'>
                    <div className='flex justify-center mb-6'>
                        <div className='flex items-center space-x-2 text-primary'>
                            <ShoppingCart className='h-8 w-8' />
                            <span className='text-2xl font-bold'>ShopFlow</span>
                        </div>
                    </div>
                    <CardTitle className='text-xl text-center'>Вход в аккаунт</CardTitle>
                    <CardDescription className='text-center'>
                        Введите свои учетные данные для доступа к системе
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                            <FormField
                                control={form.control}
                                name='login'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Логин</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='text'
                                                placeholder='Введите ваш логин'
                                                {...field}
                                                autoComplete='username'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='password'
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormLabel>Пароль</FormLabel>
                                            <FormControl>
                                                <div className='relative'>
                                                    <Input
                                                        type={showPassword ? 'text' : 'password'}
                                                        placeholder='Введите ваш пароль'
                                                        {...field}
                                                        autoComplete='current-password'
                                                    />
                                                    <button
                                                        type='button'
                                                        className='absolute right-2 top-1 text-muted-foreground hover:text-primary'
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className='h-2 w-2' />
                                                        ) : (
                                                            <Eye className='h-2 w-2' />
                                                        )}
                                                    </button>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )
                                }}
                            />
                            <Button type='submit' className='w-full' disabled={isLoading}>
                                {isLoading ? 'Вход...' : 'Войти'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
