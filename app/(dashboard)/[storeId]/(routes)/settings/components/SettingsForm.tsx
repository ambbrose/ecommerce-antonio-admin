'use client';

import * as z from 'zod';

import { Store } from "@prisma/client";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

import { Loader, Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

interface SettingsFormProps {
    initialData?: Store;
};

const formSchema = z.object({
    name: z.string().min(2)
});

type SettingsFormValues = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
    const { toast } = useToast();

    const origin = useOrigin();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const router = useRouter();

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: ''
        }
    });

    const onSubmit = async (data: SettingsFormValues) => {
        try {
            setLoading(true);

            await axios.patch(`/api/stores/${params.storeId}`, data);

            router.refresh();

            toast({
                variant: 'default',
                title: 'Store Updated.',
                description: 'Your store has been updated successfully.',
                className: 'bg-green-600 text-white'
            });

        } catch (error) {
            console.log(error);
            toast({
                variant: 'destructive',
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with the update process."
            });

        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/stores/${params.storeId}`);

            router.refresh();
            router.push('/');

            toast({
                variant: 'default',
                title: 'Store Deleted.',
                description: 'Your store has been deleted successfully.',
                className: 'bg-green-600 text-white'
            });

        } catch (error) {
            
            toast({
                variant: 'destructive',
                title: "Uh oh! Something went wrong.",
                description: 'Make sure you remove all products and categories'
            });

        } finally {
            setLoading(false);
            setOpen(false);
        };
    };

    return (
        <>
            <AlertModal
                isOpen={open}
                onClose={() => setOpen(false)}
                onconfirm={onDelete}
                loading={loading}
            />

            <div className="flex justify-between items-center">
                <Heading
                    title="Settings"
                    description="Manage store preferences"
                />

                <Button
                    disabled={loading}
                    variant={'destructive'}
                    size={'icon'}
                    onClick={() => { setOpen(true) }}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>

            <Separator />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8 w-full'
                >
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>

                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='Store name...'
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button
                        disabled={loading}
                        className='ml-auto'
                        type='submit'
                    >
                        {loading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
                        {loading ? 'Updating...' : 'Save Changes'}
                    </Button>
                </form>
            </Form>

            <Separator />

            <ApiAlert 
                title='NEXT_PUBLIC_API_URL'
                description={`${origin}/api/${params.storeId}`}
                variant='public'
            />
        </>
    );
};

export default SettingsForm;