import { copyToClipboard, truncate } from "@/utils/functions";
import { IconWrapper } from "@/components/Shared";
import { type AddressProps } from "@/utils/types/atoms.types";

export const AddressView: React.FC<AddressProps> = ({ address }) => {
    return (
        <div className="flex items-center gap-x-2">
            <p>{truncate(address)}</p>
            <button
                className="cursor-pointer"
                onClick={() => copyToClipboard(address)}
            >
                <IconWrapper
                    icon_class_name="content_copy"
                    icon_size="text-sm"
                    class_name="text-secondary dark:text-secondary"
                />
            </button>
        </div>
    );
};
