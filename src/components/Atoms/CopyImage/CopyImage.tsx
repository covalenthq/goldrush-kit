import { useState } from "react";
import { IconWrapper } from "../IconWrapper/IconWrapper";
import { type CopyImageProps } from "@/utils/types/atoms.types";
import { copyToClipboard } from "@/utils/functions";

export const CopyImage: React.FC<CopyImageProps> = ({ url }) => {
    const [copied, showCopied] = useState<boolean>(false);

    return copied ? (
        <IconWrapper
            iconClassName="done"
            iconSize="text-sm text-secondary dark:text-secondary"
        />
    ) : (
        <IconWrapper
            iconClassName="content_copy"
            iconSize="text-sm text-text-color-900 dark:text-text-color-50"
            className="cursor-pointer"
            onClick={() => {
                showCopied(true);
                setTimeout(() => {
                    showCopied(false);
                }, 3000);
                copyToClipboard(url);
            }}
        />
    );
};
