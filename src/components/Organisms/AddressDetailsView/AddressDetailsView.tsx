import { type AddressDetailsViewProps } from "@/utils/types/organisms.types";
import { TransactionsList } from "@/components/Molecules/TransactionsList/TransactionsList";
import { AddressDetails } from "@/components/Molecules/Address/AddressDetails/AddressDetails";

export const AddressDetailsView: React.FC<AddressDetailsViewProps> = ({
    address,
    chain_name,
}) => {
    return (
        <section className="flex w-full flex-col gap-y-8">
            <AddressDetails address={address} chain_name={chain_name} />
            <TransactionsList address={address} chain_name={chain_name} />
        </section>
    );
};
