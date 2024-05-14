import { defaultErrorMessage } from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import { type NftTokenContractBalanceItem } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { AddressCard } from "@/components/Atoms";
import { type NFTWalletCollectionViewProps } from "@/utils/types/organisms.types";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import {
    NFTWalletCollectionDetails,
    NFTWalletCollectionList,
} from "@/components/Molecules";

export const NFTWalletCollectionView: React.FC<
    NFTWalletCollectionViewProps
> = ({ chain_name, address }) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<NftTokenContractBalanceItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.NftService.getNftsForAddress(
                        chain_name,
                        address
                    );
                if (error.error) {
                    throw error;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, address]);

    return (
        <div className="space-y-4">
            <AddressCard address={address} />

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
