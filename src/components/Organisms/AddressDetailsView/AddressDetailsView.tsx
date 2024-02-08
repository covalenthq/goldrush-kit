import { type AddressDetailsViewProps } from "@/utils/types/organisms.types";
import { AddressInfo } from "@/components/Molecules/AddressInfo/AddressInfo";
import { AddressOverview } from "@/components/Molecules/AddressOverview/AddressOverview";
import { TransactionsList } from "@/components/Molecules/TransactionsList/TransactionsList";
import { AccountCard } from "@/components/Molecules/AccountCard/AccountCard";

export const AddressDetailsView: React.FC<AddressDetailsViewProps> = ({
    address,
    chain_name,
}) => {
    return (
        <section className="flex w-full flex-col gap-y-8">
            <AccountCard address={address} />

            <header className="flex gap-x-16">
                <AddressOverview address={address} chain_name={chain_name} />
                <AddressInfo address={address} chain_name={chain_name} />
            </header>

            <TransactionsList address={address} chain_name={chain_name} />
        </section>
    );
};
