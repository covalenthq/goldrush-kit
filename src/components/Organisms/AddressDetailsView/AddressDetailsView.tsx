import { type AddressDetailsViewProps } from "@/utils/types/organisms.types";
import { AddressInfo } from "@/components/Molecules/AddressInfo/AddressInfo";
import { AddressOverview } from "@/components/Molecules/AddressOverview/AddressOverview";
import { TransactionsList } from "@/components/Molecules/TransactionsList/TransactionsList";
import { AccountCard } from "@/components/Molecules/AccountCard/AccountCard";

export const AddressDetailsView: React.FC<AddressDetailsViewProps> = ({
    address,
    chain_names,
}) => {
    return (
        <section className="flex w-full flex-col gap-y-8">
            <AccountCard address={address} />

            <header className="flex gap-x-16">
                <AddressOverview address={address} chain_names={chain_names} />
                <AddressInfo address={address} chain_names={chain_names} />
            </header>

            <TransactionsList address={address} chain_name={chain_names} />
        </section>
    );
};
