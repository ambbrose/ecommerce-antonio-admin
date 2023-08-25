'use client';

import { Copy, CopyCheck, Server } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ApiAlertProps {
    title: string;
    description: string;
    variant: "public" | "admin";
};

const textMap: Record<ApiAlertProps['variant'], string> = {
    public: 'Public',
    admin: 'Admin'
};
const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
    public: 'secondary',
    admin: 'destructive'
};

export const ApiAlert: React.FC<ApiAlertProps> = ({
    title, description, variant = "public"
}) => {

    const { toast } = useToast();

    const [copied, setCopied] = useState<boolean>(false);

    const onCopy = () => {
        navigator.clipboard.writeText(description);
        setCopied(true)

        toast({
            variant: 'default',
            description: 'API Route copied to the clipboard',
            className: 'bg-green-600 text-white'
        });

        setTimeout(() => {
            setCopied(false);
        }, 5000);

    };

    return (
        <Alert>
            <Server className="h-4 w-4" />

            <AlertTitle className="flex items-center gap-x-2">
                {title}

                <Badge variant={variantMap[variant]}>
                    {textMap[variant]}
                </Badge>
            </AlertTitle>

            <AlertDescription className="mt-4 flex items-center justify-between">
                <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold"
                >
                    {description}
                </code>

                <Button variant={'outline'} size={'icon'} onClick={onCopy}>
                    {copied ? <CopyCheck /> : <Copy />}
                </Button>
            </AlertDescription>
        </Alert>
    );
};

