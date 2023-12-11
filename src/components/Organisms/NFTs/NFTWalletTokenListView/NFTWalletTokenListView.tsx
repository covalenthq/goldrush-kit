import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import type { ChainItem } from "@covalenthq/client-sdk";
import {
    prettifyCurrency,
    type NftTokenContractBalanceItem,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import flatMap from "lodash/flatMap";
import sum from "lodash/sum";
import { AccountCardView } from "@/components/Molecules/AccountCardView/AccountCardView";
import { Skeleton } from "@/components/ui/skeleton";
import { useCovalent } from "@/utils/store/Covalent";
import { type NFTWalletTokenListViewProps } from "@/utils/types/organisms.types";
import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";

export const NFTWalletTokenListView: React.FC<NFTWalletTokenListViewProps> = ({
    chain_names,
    address,
}) => {
    const [maybeResult, setResult] =
        useState<Option<NftTokenContractBalanceItem[]>>(None);
    const { covalentClient } = useCovalent();
    const [error, setError] = useState({ error: false, error_message: "" });
    const [allChains, setAllChains] = useState<Option<ChainItem[]>>(None);

    const handleAllChains = async () => {
        const allChainsResp = await covalentClient.BaseService.getAllChains();
        setAllChains(new Some(allChainsResp.data.items));
    };

    const handleNftsToken = async () => {
        const promises = chain_names.map(async (chain) => {
            const allowedCacheChains = [
                "bsc-mainnet",
                "eth-mainnet",
                "bsc-testnet",
                "eth-sepolia",
                "gnosis-mainnet",
                "gnosis-testnet",
                "matic-mainnet",
                "matic-mumbai",
            ];
            const cache = !allowedCacheChains.includes(chain);
            let response;
            try {
                response = await covalentClient.NftService.getNftsForAddress(
                    chain,
                    address.trim(),
                    {
                        withUncached: cache,
                    }
                );

                setError({ error: false, error_message: "" });
                return response.data.items.map((o) => {
                    return { ...o, chain };
                });
            } catch (error) {
                console.error(`Error fetching balances for ${chain}:`, error);
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
                return [];
            }
        });

        const results = await Promise.all(promises);
        setResult(new Some(results.flat()));
    };

    useEffect(() => {
        handleAllChains();
        handleNftsToken();
    }, [chain_names, address]);

    return (
        <div className="space-y-4 ">
            <div className="flex flex-wrap place-content-between gap-2">
                <AccountCardView address={address} />

                <div className="w-full rounded border p-2 md:w-min lg:w-min">
                    <h2 className="text-base font-semibold  text-secondary ">
                        Total Quote
                    </h2>
                    <div className="flex items-end gap-2">
                        <span className="text-xl">
                            {maybeResult.match({
                                None: () => (
                                    <Skeleton size={GRK_SIZES.MEDIUM} />
                                ),
                                Some: (result) => {
                                    const s = sum(
                                        result.map(
                                            (x) => x.floor_price_quote
                                        )
                                    );
                                    return (
                                        <span>{prettifyCurrency(s, 2, "USD", true)}</span>
                                    );
                                },
                            })}
                        </span>
                        <div className="flex  gap-1  text-sm text-secondary">
                            <span className="flex">
                                {" "}
                                (
                                {maybeResult.match({
                                    None: () => (
                                        <Skeleton
                                            size={
                                                GRK_SIZES.EXTRA_EXTRA_SMALL
                                            }
                                        />
                                    ),
                                    Some: (result) => {
                                        return (
                                            <span>{result.length}</span>
                                        );
                                    },
                                })}{" "}
                            </span>
                            NFTs)
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-8">
                {maybeResult.match({
                    None: () => [1,2,3,4,5,6,7,8].map((o,i) => {
                        return <Skeleton key={i} isNFT size={GRK_SIZES.EXTRA_EXTRA_SMALL} />;
                    }),
                    Some: (result: any) => {
                        if (error.error) {
                            return <>{error.error_message}</>;
                        } else if (!error.error && result.length === 0) {
                            return <>No results</>;
                        } else if (result.length > 0) {
                            return result.map((items: any) => {
                                return flatMap(items.nft_data, (it) => {
                                    return (
                                        <Card className="w-[230px] rounded border">
                                            <CardContent>
                                                <img
                                                    className={`block h-[10rem] w-full rounded-t ${it.external_data ? "object-cover" : "p-2"}`}
                                                    src={it.external_data ? it.external_data.image_512 : "https://www.datocms-assets.com/86369/1685489960-nft.svg"}
                                                    onError={(e) => {
                                                        e.currentTarget.classList.remove("object-cover");
                                                        e.currentTarget.classList.add("p-2");
                                                        e.currentTarget.src =
                                                            "https://www.datocms-assets.com/86369/1685489960-nft.svg";
                                                    }}
                                                />
                                            </CardContent>
                                            <div className="p-4">
                                                <CardDescription>
                                                    {" "}
                                                    {items.contract_name}
                                                </CardDescription>
                                                <CardTitle className="truncate">
                                                    #{it.token_id?.toString()}
                                                </CardTitle>
                                                <div className="mt-2">
                                                    <small className="text-muted-foreground">
                                                        Est. Value
                                                    </small>
                                                    <p> {items.pretty_floor_price_quote ? items.pretty_floor_price_quote : <span>-</span>}</p>
                                                </div>
                                            </div>
                                        </Card>
                                    );
                                });
                            });
                        }
                    }
                })}
                
            </div>
        </div>
    );
};
