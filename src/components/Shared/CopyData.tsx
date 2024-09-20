import { IconWrapper } from ".";
import { Toaster } from "../ui/toaster";
import { copyToClipboard } from "@/utils/functions";
import { useToast } from "@/utils/hooks";
import { type CopyDataProps } from "@/utils/types/shared.types";
import { useState } from "react";

export const CopyData: React.FC<CopyDataProps> = ({ children, data }) => {
    const [copied, showCopied] = useState<boolean>(false);

    const { toast } = useToast();

    const handleCopyClick = () => {
        toast({
            title: "Copied to clipboard!",
            description: data,
        });
        showCopied(true);
        setTimeout(() => {
            showCopied(false);
        }, 3000);
    };

    return (
        <>
            <Toaster />

            <button
                className="cursor-pointer flex items-center gap-x-2"
                onClick={() => {
                    handleCopyClick();
                }}
            >
                {children}

                {copied ? (
                    <IconWrapper
                        icon_class_name="done"
                        icon_size="text-sm text-secondary-light dark:text-secondary-dark"
                    />
                ) : (
                    <IconWrapper
                        icon_class_name="content_copy"
                        icon_size="text-sm text-slate-900 dark:text-slate-50"
                        class_name="cursor-pointer"
                        on_click={() => {
                            copyToClipboard(data);
                            showCopied(true);
                            setTimeout(() => {
                                showCopied(false);
                            }, 3000);
                        }}
                    />
                )}
            </button>
        </>
    );
};
