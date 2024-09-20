import { AddressCard } from "@/components/Atoms";
import {
    NFTWalletCollectionDetails,
    NFTWalletCollectionList,
} from "@/components/Molecules";
import {
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type NFTWalletCollectionViewProps } from "@/utils/types/organisms.types";
import {
    type NftTokenContractBalanceItem,
    GoldRushResponse,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const NFTWalletCollectionView: React.FC<
    NFTWalletCollectionViewProps
> = ({ chain_name, address, actionable_address }) => {
    const { goldrushClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<NftTokenContractBalanceItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await goldrushClient.NftService.getNftsForAddress(
                        chain_name,
                        address,
                    );
                if (error.error) {
                    throw error;
                }
                if (!data?.items) {
                    throw FALLBACK_ERROR;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: GoldRushResponse<null> | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, address]);

    return (
        <div className="space-y-4">
            <AddressCard
                avatar={{}}
                address={address}
                actionable_address={actionable_address}
            />

            <NFTWalletCollectionDetails
                address={address}
                chain_name={chain_name}
                maybeResult={maybeResult}
                errorMessage={errorMessage}
            />

            <NFTWalletCollectionList
                address={address}
                chain_name={chain_name}
                maybeResult={maybeResult}
                errorMessage={errorMessage}
            />
        </div>
    );
};
