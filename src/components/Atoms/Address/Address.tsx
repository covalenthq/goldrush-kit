import { AddressAvatar } from "../AddressAvatar/AddressAvatar";
import { CopyData } from "@/components/Shared";
import { actionableWrapper, truncate } from "@/utils/functions";
import { type AddressProps } from "@/utils/types/atoms.types";

export const Address: React.FC<AddressProps> = ({
    address,
    label = null,
    avatar = null,
    actionable_address = () => null,
}) => {
    if (!address) {
        return <></>;
    }

    return (
        <span className="flex items-center gap-x-1">
            {avatar && <AddressAvatar {...avatar} address={address} />}

            {actionableWrapper(
                actionable_address(address),
                label?.trim() || truncate(address),
            )}

            <CopyData data={address} />
        </span>
    );
};
