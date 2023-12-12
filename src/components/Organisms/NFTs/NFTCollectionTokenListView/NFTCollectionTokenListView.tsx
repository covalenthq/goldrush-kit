import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import type { ChainItem, NftTokenContract } from "@covalenthq/client-sdk";
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
import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";
import { CollectionCardView } from "@/components/Molecules/CollectionCardView/CollectionCardView";

export const NFTCollectionTokenListView: React.FC<
    NFTCollectionTokenListViewProps
> = ({ chain_name, collection_address, on_nft_click }) => {
    const [maybeResult, setResult] = useState<Option<NftTokenContract[]>>(None);
    const { covalentClient, chains } = useCovalent();
    const [error, setError] = useState({ error: false, error_message: "" });

    const handleNftsToken = async () => {
        setResult(None);
        let response;
        try {
            response =
                await covalentClient.NftService.getTokenIdsForContractWithMetadataByPage(
                    chain_name,
                    collection_address
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

    useEffect(() => {
        handleNftsToken();
    }, [chain_name, collection_address]);

    return (
        <div className="space-y-4 ">
            <div className="flex flex-wrap place-content-between gap-2">
                <CollectionCardView
                    collection_address={collection_address}
                    chain_name={chain_name}
                />
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
                                    const chain: ChainItem | null =
                                        chains?.find(
                                            (o) => o.name === chain_name
                                        ) ?? null;
                                    const chainColor = chain?.color_theme.hex;
                                    const isDarkMode =
                                        document.documentElement.classList.contains(
                                            "dark"
                                        );
                                    return (
                                        <Card
                                            key={it.nft_data.token_id}
                                            className="w-[230px] rounded border"
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
                                                <div
                                                    className={`absolute -bottom-4 right-2 flex h-9 w-9 items-center justify-center rounded-[100%] p-1 ${
                                                        !isDarkMode
                                                            ? "bg-white"
                                                            : "bg-black"
                                                    } tokenAvatar`}
                                                    style={{
                                                        border: `2px solid `,
                                                        borderColor: `${chainColor}`,
                                                    }}
                                                >
                                                    <TokenAvatar
                                                        is_chain_logo
                                                        size={
                                                            GRK_SIZES.EXTRA_SMALL
                                                        }
                                                        chain_color={chainColor}
                                                        token_url={
                                                            chain?.logo_url
                                                        }
                                                    />
                                                </div>
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
