import { useState } from "react";
import { IconWrapper } from ".";
import { type CopyImageProps } from "@/utils/types/shared.types";
import { copyToClipboard } from "@/utils/functions";

export const CopyImage: React.FC<CopyImageProps> = ({ url }) => {
    const [copied, showCopied] = useState<boolean>(false);

    return copied ? (
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
                showCopied(true);
                setTimeout(() => {
                    showCopied(false);
                }, 3000);
                copyToClipboard(url);
            }}
        />
    );
};
