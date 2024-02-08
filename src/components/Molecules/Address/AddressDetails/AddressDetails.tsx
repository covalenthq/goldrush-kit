import { type AddressDetailsProps } from "@/utils/types/molecules.types";
import { AddressSummary } from "../AddressSummary/AddressSummary";
import { AccountCard } from "@/components/Molecules/AccountCard/AccountCard";

export const AddressDetails: React.FC<AddressDetailsProps> = ({
    address,
    chain_name,
}) => {
    return (
        <div className="flex w-full flex-col gap-y-8">
            <AccountCard address={address} />
            <AddressSummary address={address} chain_name={chain_name} />
        </div>
    );
};
