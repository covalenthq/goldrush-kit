import { type AddressSummaryProps } from "@/utils/types/molecules.types";
import { AddressInformation } from "../../Molecules/Address/AddressInformation/AddressInformation";
import { AddressOverview } from "../../Molecules/Address/AddressOverview/AddressOverview";

export const AddressDetailView: React.FC<AddressSummaryProps> = ({
    address,
    chain_name,
}) => {
    return (
        <div className="flex gap-4">
            <AddressOverview address={address} chain_name={chain_name} />
            <AddressInformation address={address} chain_name={chain_name} />
        </div>
    );
};
