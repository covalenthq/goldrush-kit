import {
    ALLOWED_CACHE_CHAINS,
    DEFAULT_ERROR_MESSAGE,
} from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import { type NftTokenContract, type Pagination } from "@covalenthq/client-sdk";
import { useCallback, useEffect, useState } from "react";
import { useGoldRush } from "@/utils/store";
import { type NFTCollectionTokensListProps } from "@/utils/types/molecules.types";
import { PaginationFooter, SkeletonNFT } from "@/components/Shared";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { NFT } from "@/components/Atoms";

export const NFTCollectionTokensList: React.FC<
    NFTCollectionTokensListProps
> = ({ chain_name, collection_address, page_size = 10 }) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<NftTokenContract[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    useEffect(() => {
        updateResult(null);
    }, [collection_address, chain_name, page_size]);

    const updateResult = useCallback(
        async (_pagination: Pagination | null) => {
            try {
                setMaybeResult(None);
                setErrorMessage(null);
                const { data, ...error } =
                    await covalentClient.NftService.getTokenIdsForContractWithMetadataByPage(
                        chain_name,
                        collection_address,
                        {
                            pageNumber: _pagination?.page_number ?? 0,
                            pageSize: _pagination?.page_size ?? page_size,
                            withUncached:
                                !ALLOWED_CACHE_CHAINS.includes(chain_name),
                        }
                    );
                if (error.error) {
                    throw error;
                }
                setPagination(data.pagination);
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        },
        [chain_name, collection_address]
    );

    const handleOnChangePagination = (updatedPagination: Pagination) => {
        setPagination(updatedPagination);
        updateResult(updatedPagination);
    };

    return (
        <div className="flex flex-wrap gap-4">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(page_size)
                            .fill(null)
                            .map(() => (
                                <SkeletonNFT key={Math.random()} />
                            ))}
                    </>
                ),

                Some: (result) =>
                    errorMessage ? (
                        <p>{errorMessage}</p>
                    ) : !result?.length ? (
                        <p>{errorMessage}</p>
                    ) : (
                        result.map(({ contract_name, nft_data }) => (
                            <NFT
                                key={nft_data.token_id}
                                src={
                                    nft_data.external_data?.image_256 ||
                                    nft_data.external_data?.image_512 ||
                                    nft_data.external_data?.image_1024
                                }
                                collection_name={contract_name}
                                token_id={nft_data.token_id}
                            />
                        ))
                    ),
            })}

            <PaginationFooter
                pagination={pagination}
                onChangePaginationHandler={handleOnChangePagination}
            />
        </div>
    );
};
