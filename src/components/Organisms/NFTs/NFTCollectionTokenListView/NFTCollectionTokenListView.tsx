import {
    GRK_SIZES,
    allowedCacheChains,
} from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import type {
    MarketFloorPriceItem,
    MarketVolumeItem,
    NftTokenContract,
    Pagination,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoldRush } from "@/utils/store";
import { type NFTCollectionTokenListViewProps } from "@/utils/types/organisms.types";
import { CollectionCard } from "@/components/Molecules/CollectionCard/CollectionCard";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconWrapper } from "@/components/Shared";

export const NFTCollectionTokenListView: React.FC<
    NFTCollectionTokenListViewProps
> = ({ chain_name, collection_address, on_nft_click }) => {
    const [maybeResult, setResult] = useState<Option<NftTokenContract[]>>(None);
    const [maybeVolume, setVolume] = useState<Option<MarketVolumeItem[]>>(None);
    const [maybeFloor, setFloor] =
        useState<Option<MarketFloorPriceItem[]>>(None);
    const [maybePagination, setPagination] = useState<Option<Pagination>>(None);
    const [paginator, setPaginator] = useState({
        pageNumber: 0,
        pageSize: 20,
    });
    const { covalentClient, chains } = useGoldRush();
    const [error, setError] = useState({ error: false, error_message: "" });

    const handleNftsToken = async () => {
        setResult(None);
        let response;

        const cache = !allowedCacheChains.includes(chain_name);
        try {
            response =
                await covalentClient.NftService.getTokenIdsForContractWithMetadataByPage(
                    chain_name,
                    collection_address,
                    {
                        pageNumber: paginator.pageNumber,
                        pageSize: paginator.pageSize,
                        withUncached: cache,
                    }
                );
            setError({ error: false, error_message: "" });
            setResult(new Some(response.data.items));
            setPagination(new Some(response.data.pagination));
        } catch (error) {
            console.error(
                `Error fetching nfts for ${collection_address}:`,
                error
            );
            setError({
                error: response ? response.error : false,
                error_message: response ? response.error_message : "",
            });
            setResult(new Some([]));
        }
    };

    const handleVolume = async () => {
        setVolume(None);
        const response = await covalentClient.NftService.getNftMarketVolume(
            chain_name,
            collection_address
        );
        setVolume(new Some(response.data.items));
    };

    const handleFloor = async () => {
        setFloor(None);
        const response = await covalentClient.NftService.getNftMarketFloorPrice(
            chain_name,
            collection_address
        );
        setFloor(new Some(response.data.items));
    };

    useEffect(() => {
        handleNftsToken();
        handleVolume();
        handleFloor();
    }, [chain_name, collection_address]);

    useEffect(() => {
        handleNftsToken();
    }, [paginator]);

    return (
        <div className="space-y-4 ">
            <div className="flex flex-wrap place-content-between gap-2">
                <CollectionCard
                    collection_address={collection_address}
                    chain_name={chain_name}
                />
                <div className="flex w-full items-center justify-around gap-4 rounded border p-2 lg:max-w-[20rem]">
                    <div>
                        <h2 className="text-base font-semibold text-secondary-light">
                            Market volume
                        </h2>
                        <div className="flex items-end gap-2">
                            <span className="text-xl">
                                {maybeVolume.match({
                                    None: () => (
                                        <Skeleton size={GRK_SIZES.LARGE} />
                                    ),
                                    Some: (data) => {
                                        return (
                                            <>
                                                {
                                                    data[data.length - 1]
                                                        .pretty_volume_quote
                                                }
                                            </>
                                        );
                                    },
                                })}
                            </span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-secondary-light">
                            Floor price
                        </h2>
                        <div className="flex items-end gap-2">
                            <span className="text-xl">
                                {maybeFloor.match({
                                    None: () => (
                                        <Skeleton size={GRK_SIZES.LARGE} />
                                    ),
                                    Some: (data) => {
                                        return (
                                            <>
                                                {
                                                    data[data.length - 1]
                                                        .pretty_floor_price_quote
                                                }
                                            </>
                                        );
                                    },
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {chains &&
                    maybeResult.match({
                        None: () =>
                            [1, 2, 3, 4, 5, 6, 7, 8].map((o, i) => {
                                return (
                                    <Skeleton
                                        key={i}
                                        isNFT
                                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                    />
                                );
                            }),
                        Some: (result) => {
                            if (error.error) {
                                return <>{error.error_message}</>;
                            } else if (!error.error && result.length === 0) {
                                return <>No results</>;
                            } else if (result.length > 0) {
                                return result.map((it: NftTokenContract) => {
                                    const nft = it.nft_data;

                                    return (
                                        <Card
                                            key={it.nft_data.token_id}
                                            className="group w-[230px] cursor-pointer rounded border"
                                            onClick={() => {
                                                if (on_nft_click) {
                                                    on_nft_click(it);
                                                }
                                            }}
                                        >
                                            <CardContent className="relative rounded bg-slate-100 transition-all">
                                                <div className="absolute h-full w-full rounded-t bg-black  bg-opacity-0  transition-all  group-hover:bg-opacity-30">
                                                    <IconWrapper
                                                        icon_class_name="open_in_new"
                                                        icon_size="text-xl pt-1"
                                                        class_name="text-white dark:text-secondary-light opacity-0  group-hover:opacity-100 right-2 top-0 absolute"
                                                    />
                                                </div>
                                                <img
                                                    className={`block h-[13rem] w-full rounded-t ${
                                                        nft.external_data
                                                            ?.image_512
                                                            ? "object-cover"
                                                            : "p-2"
                                                    }`}
                                                    src={
                                                        nft.external_data
                                                            ?.image_512
                                                            ? nft.external_data
                                                                  .image_512
                                                            : "https://www.datocms-assets.com/86369/1685489960-nft.svg"
                                                    }
                                                    onError={(e) => {
                                                        e.currentTarget.classList.remove(
                                                            "object-cover"
                                                        );
                                                        e.currentTarget.classList.add(
                                                            "p-2"
                                                        );
                                                        e.currentTarget.src =
                                                            "https://www.datocms-assets.com/86369/1685489960-nft.svg";
                                                    }}
                                                />
                                            </CardContent>
                                            <div className="p-4">
                                                <CardDescription>
                                                    {" "}
                                                    {it.contract_name}
                                                </CardDescription>
                                                <CardTitle className="truncate">
                                                    #{nft.token_id?.toString()}
                                                </CardTitle>
                                            </div>
                                        </Card>
                                    );
                                });
                            }
                        },
                    })}
            </div>
            {maybePagination.match({
                None: () => <Skeleton size={GRK_SIZES.LARGE} />,
                Some: (data) => {
                    return (
                        <div className="flex items-center justify-between  gap-2">
                            <div className="flex items-center  gap-2">
                                <Button
                                    variant={"outline"}
                                    disabled={data.page_number === 0}
                                    onClick={() => {
                                        setPaginator((prev) => {
                                            return {
                                                ...prev,
                                                pageNumber: prev.pageNumber - 1,
                                            };
                                        });
                                    }}
                                >
                                    Previous
                                </Button>
                                Page {data.page_number + 1}
                                <Button
                                    variant={"outline"}
                                    disabled={!data.has_more}
                                    onClick={() => {
                                        setPaginator((prev) => {
                                            return {
                                                ...prev,
                                                pageNumber: prev.pageNumber + 1,
                                            };
                                        });
                                    }}
                                >
                                    Next
                                </Button>
                            </div>
                            <div className="flex  gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline">
                                            Rows per page: {data.page_size}
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>
                                            Choose rows per page
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        {[5, 10, 15, 20].map((pageSize) => (
                                            <DropdownMenuItem
                                                key={pageSize}
                                                onClick={() => {
                                                    setPaginator((prev) => {
                                                        return {
                                                            ...prev,
                                                            pageSize: pageSize,
                                                        };
                                                    });
                                                }}
                                            >
                                                <span>{pageSize}</span>
                                            </DropdownMenuItem>
                                        ))}
                                        <DropdownMenuSeparator />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    );
                },
            })}
        </div>
    );
};
