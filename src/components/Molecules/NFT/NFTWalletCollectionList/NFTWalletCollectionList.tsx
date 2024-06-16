import { type Option, Some, None } from "@/utils/option";
import { type NftTokenContractBalanceItem } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { CardDetail, SkeletonNFT } from "@/components/Shared";
import { NFT } from "@/components/Atoms";
import { type NFTWalletCollectionListProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { DEFAULT_ERROR_MESSAGE } from "@/utils/constants/shared.constants";

export const NFTWalletCollectionList: React.FC<
    NFTWalletCollectionListProps
> = ({
    chain_name,
    address,
    maybeResult: initialMaybeResult = null,
    errorMessage: initialErrorMessage = null,
    actionable_contract,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<NftTokenContractBalanceItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        initialErrorMessage
    );

    useEffect(() => {
        if (initialErrorMessage) {
            setErrorMessage(initialErrorMessage);
        }
    }, [initialErrorMessage]);

    useEffect(() => {
        if (initialMaybeResult) {
            setMaybeResult(initialMaybeResult);
        }
    }, [initialMaybeResult]);

    useEffect(() => {
        (async () => {
            if (!initialMaybeResult) {
                try {
                    setMaybeResult(None);
                    setErrorMessage(null);
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
                    setErrorMessage(
                        error?.error_message ?? DEFAULT_ERROR_MESSAGE
                    );
                    setMaybeResult(new Some(null));
                    console.error(error);
                }
            }
        })();
    }, [chain_name, address, initialMaybeResult]);

    return (
        <div className="flex flex-wrap items-stretch gap-4">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(4)
                            .fill(null)
                            .map(() => (
                                <SkeletonNFT key={Math.random()} />
                            ))}
                    </>
                ),
                Some: (result) =>
                    errorMessage ? (
                        <p>{errorMessage}</p>
                    ) : result ? (
                        result.map(
                            ({
                                nft_data,
                                contract_address,
                                contract_name,
                                pretty_floor_price_quote,
                            }) =>
                                nft_data.map(({ token_id, external_data }) => (
                                    <NFT
                                        key={token_id}
                                        src={
                                            external_data?.image_256 ||
                                            external_data?.image_512 ||
                                            external_data?.image_1024
                                        }
                                        token_id={token_id}
                                        collection_name={contract_name}
                                        chain_name={chain_name}
                                        collection_address={contract_address}
                                        actionable_contract={
                                            actionable_contract
                                        }
                                    >
                                        <CardDetail
                                            heading="EST VALUE"
                                            content={pretty_floor_price_quote}
                                            wrapperClassName="p-2"
                                        />
                                    </NFT>
                                ))
                        )
                    ) : (
                        <></>
                    ),
            })}
        </div>
    );
};
