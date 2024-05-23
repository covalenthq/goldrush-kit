import { type NFTCollectionViewProps } from "@/utils/types/organisms.types";
import { AddressCard } from "@/components/Atoms";
import {
    NFTCollectionDetails,
    NFTCollectionTokensList,
} from "@/components/Molecules";

export const NFTCollectionView: React.FC<NFTCollectionViewProps> = ({
    chain_name,
    collection_address,
    page_size = 10,
    actionable_address,
}) => {
    return (
        <div className="space-y-4">
            <AddressCard
                address={collection_address}
                actionable_address={actionable_address}
            />

            <NFTCollectionDetails
                chain_name={chain_name}
                collection_address={collection_address}
            />

            <NFTCollectionTokensList
                chain_name={chain_name}
                collection_address={collection_address}
                page_size={page_size}
            />
        </div>
    );
};
