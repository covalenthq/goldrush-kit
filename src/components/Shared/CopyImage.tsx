import { useState } from "react";
import { IconWrapper } from ".";
import { type CopyImageProps } from "@/utils/types/shared.types";
import { copyToClipboard } from "@/utils/functions";

const CopyImage: React.FC<CopyImageProps> = ({ url }) => {
    const [copied, showCopied] = useState<boolean>(false);

    return copied ? (
        <IconWrapper
            icon_class_name="done"
            icon_size="text-sm text-secondary dark:text-secondary"
        />
    ) : (
        <IconWrapper
            icon_class_name="content_copy"
            icon_size="text-sm text-text-color-900 dark:text-text-color-50"
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

export default CopyImage;
