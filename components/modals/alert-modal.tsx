"use client";

import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onconfirm?: () => void;
    loading: boolean;
};

export const AlertModal: React.FC<AlertModalProps> = ({
    isOpen, onClose, onconfirm, loading
}) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    };


    return (
        <Modal
            title="Are you sure?"
            description="This delete action cannot be undone."
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                    disabled={loading}
                    variant={'outline'}
                    onClick={onClose}
                >
                    Cancel
                </Button>

                <Button
                    disabled={loading}
                    variant={'destructive'}
                    onClick={onconfirm}
                >
                    {loading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
                    {loading ? 'Deleting' : 'Delete'}
                </Button>
            </div>
        </Modal>
    );
};