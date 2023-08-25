'use client';

import * as z from 'zod';

import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { AlertModal } from '@/components/modals/alert-modal';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import ImageUpload from '@/components/ui/image-upload';

import { Category, Color, Image, Product, Size } from "@prisma/client";
import { Loader, Trash } from "lucide-react";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';


const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
});

type ProductFormValues = z.infer<typeof formSchema>;

interface ProductFormProps {
    initialData: Product & {
        images: Image[]
    } | null;

    categories: Category[];
    colors: Color[];
    sizes: Size[];
};

const ProductForm: React.FC<ProductFormProps> = ({ initialData, categories, colors, sizes }) => {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const router = useRouter();

    const { toast } = useToast();

    const title = initialData ? "Edit product" : "Create product";
    const description = initialData ? "Edit a product" : "Add a new product";
    const toastTitleMessage = initialData ? "Product updated" : "Product created";
    const toastDescriptionMessage = initialData ? "Product updated successfully." : "Product created successfully.";

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: false,
            isArchived: false,
        }
    });

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true);

            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data);
            } else {
                await axios.post(`/api/${params.storeId}/products`, data);
            };

            router.refresh();
            router.push(`/${params.storeId}/products`);

            toast({
                variant: 'default',
                title: toastTitleMessage,
                description: toastDescriptionMessage,
                className: 'bg-green-600 text-white'
            });

        } catch (error) {

            toast({
                variant: 'destructive',
                title: "Uh oh! Something went wrong.",
                description: "There was a problem with the process."
            });

        } finally {
            setLoading(false);
        }
    };

    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);

            router.refresh();
            router.push(`/${params.storeId}/products`);

            toast({
                variant: 'default',
                title: 'Product Deleted.',
                description: 'Your product has been deleted successfully.',
                className: 'bg-green-600 text-white'
            });

        } catch (error) {

            toast({
                variant: 'destructive',
                title: "Uh oh! Something went wrong.",
                description: 'Make sure you remove all categories using this product.'
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
                    title={title}
                    description={description}
                />

                {initialData && (
                    <Button
                        disabled={loading}
                        variant={'destructive'}
                        size={'icon'}
                        onClick={() => { setOpen(true) }}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <Separator />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8 w-full'
                >
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        value={field.value.map((image) => image.url)}
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                            placeholder='Product name...'
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>

                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='9.99'
                                            type='number'
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>

                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="Select a category"
                                                    defaultValue={field.value}
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {categories.map((category) => (
                                                <div key={category.id}>
                                                    <SelectItem
                                                        value={category.id}
                                                    >
                                                        {category.name}
                                                    </SelectItem>

                                                    <Separator />
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="sizeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Size</FormLabel>

                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="Select a size"
                                                    defaultValue={field.value}
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {sizes.map((size) => (
                                                <div key={size.id}>
                                                    <SelectItem
                                                        value={size.id}
                                                    >
                                                        {size.name}
                                                    </SelectItem>

                                                    <Separator />
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>

                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder="Select a color"
                                                    defaultValue={field.value}
                                                />
                                            </SelectTrigger>
                                        </FormControl>

                                        <SelectContent>
                                            {colors.map((color) => (
                                                <div key={color.id}>
                                                    <SelectItem
                                                        value={color.id}
                                                    >
                                                        {color.name}
                                                    </SelectItem>

                                                    <Separator />
                                                </div>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start border space-x-3 space-y-0 rounded-md p-4'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            //@ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>

                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Featured
                                        </FormLabel>

                                        <FormDescription>
                                            This product will appear on the home page.
                                        </FormDescription>
                                    </div>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => (
                                <FormItem className='flex flex-row items-start border space-x-3 space-y-0 rounded-md p-4'>
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            //@ts-ignore
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>

                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Archived
                                        </FormLabel>

                                        <FormDescription>
                                            This product will not apear anywhere in the store.
                                        </FormDescription>
                                    </div>

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
                        {loading && initialData ?
                            'Updating...' : loading && !initialData ?
                                'Creating...' : initialData ?
                                    'Save changes' : 'Create'
                        }
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default ProductForm;