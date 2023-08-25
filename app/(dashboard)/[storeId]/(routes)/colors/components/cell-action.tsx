"use client";

import axios from "axios";

import { useState } from "react";

import { Copy, CopyCheck, Edit, MoreHorizontal, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertModal } from "@/components/modals/alert-modal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ColorColumn } from "./columns";
import { useParams, useRouter } from "next/navigation";


interface CellActionProps {
    data: ColorColumn;
};

export const CellAction: React.FC<CellActionProps> = ({ data }) => {

    const { toast } = useToast();

    const router = useRouter();
    const params = useParams();

    const [copied, setCopied] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const onCopy = (id: string) => {
        navigator.clipboard.writeText(id);

        setCopied(true);

        toast({
            variant: 'default',
            description: 'Color ID copied to the clipboard',
            className: 'bg-green-600 text-white'
        });

        setTimeout(() => {
            setCopied(false);
        }, 5000);

    };

    const onUpdate = (id: string) => {
        router.push(`/${params.storeId}/colors/${id}`)
    }

    const onDelete = async () => {
        try {
            setLoading(true);

            await axios.delete(`/api/${params.storeId}/colors/${data.id}`);

            router.refresh();

            toast({
                variant: 'default',
                title: 'Color Deleted.',
                description: 'Your color has been deleted successfully.',
                className: 'bg-green-600 text-white'
            });

        } catch (error) {

            toast({
                variant: 'destructive',
                title: "Uh oh! Something went wrong.",
                description: 'Make sure you remove all products using this size.'
            });

        } finally {
            setLoading(false);
            setOpen(false);
        };
    };

    return (
        <>
            <AlertModal 
                loading={loading}
                isOpen={open}
                onClose={() => setOpen(false)}
                onconfirm={onDelete}
            />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        onClick={() => onCopy(data.id)}
                    >
                        {copied ? <CopyCheck className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                        Copy ID
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => onUpdate(data.id)}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Update
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => setOpen(true)}
                    >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};