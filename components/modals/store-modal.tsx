"use client";

import * as z from 'zod';
import { useState } from 'react';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/use-store-modal";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
    name: z.string().min(1)
});

export const StoreModal = () => {

    const storeModal = useStoreModal();
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ''
        }
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsLoading(true);

            const response = await axios.post('/api/stores', values);

            window.location.assign(`/${response.data.id}`);

            toast({
                variant: 'default',
                title: 'Store Created.',
                description: 'Your store hasbeen created successfully.',
                className: 'bg-green-600 text-white'
            });

        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with your request."
            });

        } finally {
            setIsLoading(false);
        };
    };

    return (
        <Modal
            title="Create Store"
            description="Add a new store to manage products and categories"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className='space-y-4 py-2 pb-4'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder='E-Commerce'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='pt-6 space-x-2 flex items-center justify-end w-full'>
                                <Button
                                    variant={'outline'}
                                    disabled={isLoading}
                                    onClick={storeModal.onClose}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    disabled={isLoading}
                                    type='submit'
                                >
                                    {isLoading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}