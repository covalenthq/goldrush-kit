import { copyToClipboard, truncate } from "@/utils/functions";
import { IconWrapper } from "@/components/Shared";
import { type AddressProps } from "@/utils/types/atoms.types";
import { useToast } from "@/utils/hooks";
import { useState } from "react";

export const Address: React.FC<AddressProps> = ({
    address,
    label = null,
    show_copy_icon = true,
}) => {
    const [showCopy, setShowCopy] = useState(false);
    const { toast } = useToast();

    const handleCopyClick = () => {
        toast({
            description: "Address copied!",
        });
        setShowCopy(true);
        setTimeout(() => {
            setShowCopy(false);
        }, 3000);
    };

    return (
        <p className="flex items-center gap-x-2">
            {label?.trim() || truncate(address)}

            {show_copy_icon && (
                <button
                    className="cursor-pointer"
                    onClick={() => {
                        copyToClipboard(address);
                    }}
                >
                    {showCopy ? (
                        <IconWrapper
                            icon_class_name="done"
                            icon_size="text-sm"
                            class_name="text-foreground-light dark:text-foreground-dark opacity-75"
                        />
                    ) : (
                        <IconWrapper
                            icon_class_name="content_copy"
                            icon_size="text-sm"
                            class_name="text-foreground-light dark:text-foreground-dark opacity-75"
                            on_click={() => handleCopyClick()}
                        />
                    )}
                </button>
            )}
        </p>
    );
};
