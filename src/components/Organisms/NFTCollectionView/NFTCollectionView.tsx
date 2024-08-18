import { AddressCard } from "@/components/Atoms";
import { NFTCollectionTokensList } from "@/components/Molecules";
import { type NFTCollectionViewProps } from "@/utils/types/organisms.types";

export const NFTCollectionView: React.FC<NFTCollectionViewProps> = ({
    chain_name,
    collection_address,
    page_size = 10,
    actionable_address,
}) => {
    return (
        <div className="space-y-4">
            <AddressCard
                avatar={{}}
                address={collection_address}
                actionable_address={actionable_address}
            />

            <NFTCollectionTokensList
                chain_name={chain_name}
                collection_address={collection_address}
                page_size={page_size}
            />
        </div>
    );
};
