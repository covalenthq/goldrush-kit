import {
    GRK_SIZES,
    allowedCacheChains,
    defaultErrorMessage,
    defaultErrorNFT,
} from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import { NftTokenContract, type Pagination } from "@covalenthq/client-sdk";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoldRush } from "@/utils/store";
import { type NFTCollectionTokensListProps } from "@/utils/types/molecules.types";
import { CardDetail, IconWrapper, PaginationFooter } from "@/components/Shared";
import { type CovalentAPIError } from "@/utils/types/shared.types";

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
                                !allowedCacheChains.includes(chain_name),
                        }
                    );
                if (error.error) {
                    throw error;
                }
                setPagination(data.pagination);
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
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
                                <div className="flex flex-col gap-4">
                                    <Skeleton
                                        key={Math.random()}
                                        isNFT
                                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                    />

                                    <Skeleton size={GRK_SIZES.LARGE} />
                                </div>
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
                            <Card
                                key={nft_data.token_id}
                                className="group w-64 cursor-pointer rounded border"
                            >
                                <CardContent className="relative rounded bg-slate-100 transition-all">
                                    <div className="absolute h-full w-full rounded-t bg-black bg-opacity-0 transition-all group-hover:bg-opacity-30">
                                        <IconWrapper
                                            icon_class_name="open_in_new"
                                            icon_size="text-xl pt-1"
                                            class_name="text-white dark:text-secondary-light opacity-0  group-hover:opacity-100 right-2 top-0 absolute"
                                        />
                                    </div>
                                    <img
                                        className="block h-64 w-64 object-cover"
                                        src={
                                            nft_data.external_data?.image_256 ||
                                            nft_data.external_data?.image_512 ||
                                            nft_data.external_data
                                                ?.image_1024 ||
                                            defaultErrorNFT
                                        }
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                defaultErrorNFT;
                                        }}
                                    />
                                </CardContent>

                                <CardDetail
                                    heading={contract_name.toUpperCase()}
                                    content={`#${nft_data.token_id?.toString()}`}
                                    wrapperClassName="p-4"
                                />
                            </Card>
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
