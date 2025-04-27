import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

const formSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof formSchema>;

export function LoginPage() {
    const { login } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);

        try {
            await login(data.username, data.password);
            window.location.href = '/dashboard';
            //navigate('/dashboard');
        } catch (error) {
            toast({
                title: 'Login failed',
                description: 'Invalid username or password',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
            <Card className=" max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center space-x-2 text-primary">
                            <ShoppingCart className="h-8 w-8" />
                            <span className="text-2xl font-bold">ShopFlow</span>
                        </div>
                    </div>
                    <CardTitle className="text-xl text-center">Sign in to your account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your credentials to access the system
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="username"
                                                {...field}
                                                autoComplete="username"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="Enter your password"
                                                {...field}
                                                autoComplete="current-password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-col">
                    <div className="text-xs text-muted-foreground text-center mt-4">
                        <p>Demo Credentials:</p>
                        <p className="mt-1">Admin: admin@example.com / password</p>
                        <p>Cashier: cashier@example.com / password</p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}