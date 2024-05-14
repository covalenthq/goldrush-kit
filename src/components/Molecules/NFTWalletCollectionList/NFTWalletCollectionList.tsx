import { type Option, Some, None } from "@/utils/option";
import { type NftTokenContractBalanceItem } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { CardDetail, Heading, SkeletonNFT } from "@/components/Shared";
import { Address, NFT } from "@/components/Atoms";
import { type NFTWalletCollectionListProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { CovalentAPIError } from "@/utils/types/shared.types";
import { defaultErrorMessage } from "@/utils/constants/shared.constants";

export const NFTWalletCollectionList: React.FC<
    NFTWalletCollectionListProps
> = ({
    chain_name,
    address,
    maybeResult: initialMaybeResult = null,
    errorMessage: initialErrorMessage = null,
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
                    setErrorMessage(
                        error?.error_message ?? defaultErrorMessage
                    );
                    setMaybeResult(new Some(null));
                    console.error(error);
                }
            }
        })();
    }, [chain_name, address, initialMaybeResult]);

    return (
        <div className="flex flex-col gap-8">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(4)
                            .fill(null)
                            .map(() => (
                                <SkeletonNFT />
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
                            }) => (
                                <div key={contract_address}>
                                    <div className="mb-2 flex items-center gap-4">
                                        <Heading size={4}>
                                            {contract_name}
                                        </Heading>
                                        <CardDetail
                                            content={`${nft_data.length} item${nft_data.length > 1 ? "s" : ""}`}
                                            subtext={
                                                <Address
                                                    address={contract_address}
                                                />
                                            }
                                        />
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        {nft_data.map(
                                            ({ token_id, external_data }) => (
                                                <NFT
                                                    key={token_id}
                                                    src={
                                                        external_data?.image_256 ||
                                                        external_data?.image_512 ||
                                                        external_data?.image_1024
                                                    }
                                                    token_id={token_id}
                                                    collection_name={
                                                        contract_name
                                                    }
                                                    chain_name={chain_name}
                                                >
                                                    <CardDetail
                                                        heading="EST VALUE"
                                                        content={
                                                            pretty_floor_price_quote
                                                        }
                                                        wrapperClassName="p-2"
                                                    />
                                                </NFT>
                                            )
                                        )}
                                    </div>
                                </div>
                            )
                        )
                    ) : (
                        <></>
                    ),
            })}
        </div>
    );
};
