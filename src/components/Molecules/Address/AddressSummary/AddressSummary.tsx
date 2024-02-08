import { type AddressSummaryProps } from "@/utils/types/molecules.types";
import { AddressInformation } from "../AddressInformation/AddressInformation";
import { AddressOverview } from "../AddressOverview/AddressOverview";

export const AddressSummary: React.FC<AddressSummaryProps> = ({
    address,
    chain_name,
}) => {
    return (
        <div className="flex gap-x-16">
            <AddressOverview address={address} chain_name={chain_name} />
            <AddressInformation address={address} chain_name={chain_name} />
        </div>
    );
};
