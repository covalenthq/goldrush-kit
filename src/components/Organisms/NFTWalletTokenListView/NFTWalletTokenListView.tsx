import {
    GRK_SIZES,
    allowedCacheChains,
} from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import type { Chain, ChainItem } from "@covalenthq/client-sdk";
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
import { AccountCard } from "@/components/Molecules";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoldRush } from "@/utils/store";
import { type NFTWalletTokenListViewProps } from "@/utils/types/organisms.types";
import { TokenAvatar } from "@/components/Atoms";

export const NFTWalletTokenListView: React.FC<NFTWalletTokenListViewProps> = ({
    chain_names,
    address,
}) => {
    const [maybeResult, setMaybeResult] =
        useState<
            Option<(NftTokenContractBalanceItem & { chain_name: Chain })[]>
        >(None);
    const { covalentClient, chains } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            const promises = chain_names.map(async (chain_name) => {
                const cache = !allowedCacheChains.includes(chain_name);
                try {
                    const { data, ...error } =
                        await covalentClient.NftService.getNftsForAddress(
                            chain_name,
                            address.trim(),
                            {
                                withUncached: cache,
                            }
                        );
                    if (error.error) {
                        setErrorMessage(error.error_message);
                        throw error;
                    }
                    return data.items.map((o) => {
                        return { ...o, chain_name };
                    });
                } catch (exception) {
                    console.error(exception);
                    return [];
                }
            });

            const results = await Promise.all(promises);
            setMaybeResult(new Some(results.flat()));
        })();
    }, [chain_names, address]);

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap place-content-between gap-2">
                <AccountCard address={address} />

                <div className="w-full rounded border border-secondary-light p-2 dark:border-secondary-dark md:max-w-60">
                    <h2 className="text-base font-semibold text-secondary-light dark:text-secondary-dark">
                        Total Quote
                    </h2>
                    <div className="flex items-end gap-2">
                        <span className="text-xl">
                            {maybeResult.match({
                                None: () => (
                                    <Skeleton size={GRK_SIZES.MEDIUM} />
                                ),
                                Some: (result) => {
                                    let totalFloorPriceQuote: number = 0;
                                    result.forEach(
                                        ({ floor_price_quote }) =>
                                            (totalFloorPriceQuote +=
                                                floor_price_quote)
                                    );
                                    return (
                                        <span>
                                            {prettifyCurrency(
                                                totalFloorPriceQuote,
                                                2,
                                                "USD",
                                                true
                                            )}
                                        </span>
                                    );
                                },
                            })}
                        </span>
                        <div className="flex gap-1 text-sm text-secondary-light dark:text-secondary-dark">
                            <span className="flex">
                                {" "}
                                (
                                {maybeResult.match({
                                    None: () => (
                                        <Skeleton
                                            size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                        />
                                    ),
                                    Some: (result) => {
                                        return <span>{result.length}</span>;
                                    },
                                })}{" "}
                            </span>
                            NFTs)
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                {maybeResult.match({
                    None: () =>
                        [1, 2, 3, 4, 5, 6, 7, 8].map((o) => {
                            return (
                                <Skeleton
                                    key={o}
                                    isNFT
                                    size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                />
                            );
                        }),
                    Some: (result) =>
                        errorMessage ? (
                            <>{errorMessage}</>
                        ) : result.length === 0 ? (
                            <>No results</>
                        ) : (
                            result.flatMap((items) => {
                                const chain: ChainItem | null =
                                    chains?.find(
                                        (o) => o.name === items.chain_name
                                    ) ?? null;
                                const chainColor = chain?.color_theme.hex;
                                const isDarkMode =
                                    document.documentElement.classList.contains(
                                        "dark"
                                    );
                                return items.nft_data.map((nft, i) => (
                                    <Card
                                        key={i}
                                        className="w-[230px] rounded border"
                                    >
                                        <CardContent className="relative rounded bg-slate-100">
                                            <img
                                                className={`block h-[10rem] w-full rounded-t ${
                                                    nft.external_data?.image_512
                                                        ? "object-cover"
                                                        : "p-2"
                                                }`}
                                                src={
                                                    nft.external_data?.image_512
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
                                                    size={GRK_SIZES.EXTRA_SMALL}
                                                    chain_color={chainColor}
                                                    token_url={chain?.logo_url}
                                                />
                                            </div>
                                        </CardContent>
                                        <div className="p-4">
                                            <CardDescription>
                                                {" "}
                                                {items.contract_name}
                                            </CardDescription>
                                            <CardTitle className="truncate">
                                                #{nft.token_id?.toString()}
                                            </CardTitle>
                                            <div className="mt-2">
                                                <small className="text-secondary-light dark:text-secondary-dark">
                                                    Est. Value
                                                </small>
                                                <p>
                                                    {" "}
                                                    {items.pretty_floor_price_quote ? (
                                                        items.pretty_floor_price_quote
                                                    ) : (
                                                        <span>-</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                ));
                            })
                        ),
                })}
            </div>
        </div>
    );
};
