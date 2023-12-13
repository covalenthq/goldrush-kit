import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import type { ChainItem, MarketFloorPriceItem, MarketVolumeItem, NftTokenContract } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCovalent } from "@/utils/store/Covalent";
import { type NFTCollectionTokenListViewProps } from "@/utils/types/organisms.types";
import { CollectionCardView } from "@/components/Molecules/CollectionCardView/CollectionCardView";

export const NFTCollectionTokenListView: React.FC<
    NFTCollectionTokenListViewProps
> = ({ chain_name, collection_address, on_nft_click }) => {
    const [maybeResult, setResult] = useState<Option<NftTokenContract[]>>(None);
    const [maybeVolume, setVolume] = useState<Option<MarketVolumeItem[]>>(None);
    const [maybeFloor, setFloor] = useState<Option<MarketFloorPriceItem[]>>(None);

    const { covalentClient, chains } = useCovalent();
    const [error, setError] = useState({ error: false, error_message: "" });

    const handleNftsToken = async () => {
        setResult(None);
        let response;
        try {
            response =
                await covalentClient.NftService.getTokenIdsForContractWithMetadataByPage(
                    chain_name,
                    collection_address,
                    {
                        pageNumber: 0
                    }
                );

            setError({ error: false, error_message: "" });
            setResult(new Some(response.data.items));
        } catch (error) {
            console.error(
                `Error fetching nfts for ${collection_address}:`,
                error
            );
            setError({
                error: response ? response.error : false,
                error_message: response ? response.error_message : "",
            });
            return [];
        }
    };

    const handleVolume = async() => {
        setVolume(None);
        const response = await covalentClient.NftService.getNftMarketVolume(
            chain_name,
            collection_address
        );
        console.log(response)

        setVolume(new Some(response.data.items));
        // setNativeCurrency(
        //     new Some(response.data.items[0].native_ticker_symbol)
        // );
    }

    const handleFloor = async() => {
        setFloor(None);
        const response =
        await covalentClient.NftService.getNftMarketFloorPrice(
            chain_name,
            collection_address
        );

        setFloor(new Some(response.data.items));
    }

    useEffect(() => {
        handleNftsToken();
        handleVolume();
        handleFloor();
    }, [chain_name, collection_address]);

    return (
        <div className="space-y-4 ">
            <div className="flex flex-wrap place-content-between gap-2">
                <CollectionCardView
                    collection_address={collection_address}
                    chain_name={chain_name}
                />
                <div className="flex flex-col gap-4  w-full rounded border p-2 md:max-w-[15rem] lg:max-w-[15rem]">
                    <div>
                        <h2 className="text-base font-semibold  text-secondary ">
                            Market volume
                        </h2>
                        <div className="flex items-end gap-2">
                            <span className="text-xl">
                            {maybeVolume.match({
                                    None:() =>  <Skeleton size={GRK_SIZES.LARGE} />,
                                    Some: (data: any) => {
                                        return <>{data[data.length - 1].pretty_volume_quote}</>
                                    }
                            })}
                            </span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-base font-semibold  text-secondary ">
                            Floor price
                        </h2>
                        <div className="flex items-end gap-2">
                            <span className="text-xl">
                            {maybeFloor.match({
                                    None:() =>  <Skeleton size={GRK_SIZES.LARGE} />,
                                    Some: (data: any) => {
                                        return <>{data[data.length - 1].pretty_floor_price_quote}</>
                                    }
                            })}
                            </span>
                        </div>
                    </div>

                </div>
            </div>

            <div className="flex flex-wrap gap-8">
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
                        Some: (result: any) => {
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
                                            className="w-[230px] rounded border cursor-pointer"
                                            onClick={() => {
                                                if (on_nft_click) {
                                                    on_nft_click(it);
                                                }
                                            }}
                                        >
                                            <CardContent className="relative rounded bg-slate-100">
                                                <img
                                                    className={`block h-[10rem] w-full rounded-t ${
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
        </div>
    );
};
