import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
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
import { TypographyH3 } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { AccountCard } from "@/components/Molecules";
import { type NFTWalletCollectionViewProps } from "@/utils/types/organisms.types";
import { Skeleton } from "@/components/ui/skeleton";
import { sum } from "lodash";
import { useGoldRush } from "@/utils/store";

export const NFTWalletCollectionView: React.FC<
    NFTWalletCollectionViewProps
> = ({ chain_name, address }) => {
    const [maybeResult, setResult] =
        useState<Option<NftTokenContractBalanceItem[]>>(None);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        async function getData() {
            const response = await covalentClient.NftService.getNftsForAddress(
                chain_name,
                address
            );

            setResult(new Some(response.data.items));
        }
        getData();
    }, [chain_name, address]);

    return maybeResult.match({
        None: () => <>Loading</>,
        Some: (result) => {
            const body = result.map((items, i) => {
                return (
                    <div className="" key={i}>
                        <div className="mb-2">
                            <TypographyH3>
                                <div className="flex items-center gap-x-2">
                                    {items.contract_name}{" "}
                                    <Badge>
                                        {" "}
                                        {items.nft_data.length} items{" "}
                                    </Badge>{" "}
                                </div>
                            </TypographyH3>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            {items.nft_data.map((it, j) => {
                                return (
                                    <Card
                                        key={j}
                                        className="w-[230px] rounded border "
                                    >
                                        <CardContent>
                                            <img
                                                className={`block h-[10rem] w-full rounded-t ${
                                                    it.external_data
                                                        ? "object-cover"
                                                        : "p-2"
                                                }`}
                                                src={
                                                    it.external_data
                                                        ? it.external_data
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
                                                {items.contract_name}
                                            </CardDescription>
                                            <CardTitle className="truncate">
                                                #{it.token_id?.toString()}
                                            </CardTitle>
                                            <div className="mt-2">
                                                <small className="text-secondary-light dark:text-secondary-dark">
                                                    Est. Value
                                                </small>
                                                <p>
                                                    {" "}
                                                    {
                                                        items.pretty_floor_price_quote
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                );
            });

            return (
                <div className="space-y-4 ">
                    <div className="flex flex-wrap place-content-between gap-2">
                        <AccountCard address={address} />

                        <div className="w-full rounded border p-2 md:w-min lg:w-min">
                            <h2 className="text-base font-semibold  text-secondary-light ">
                                Total Quote
                            </h2>
                            <div className="flex items-end gap-2">
                                <span className="text-base">
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
                                                <span>
                                                    {prettifyCurrency(
                                                        s,
                                                        2,
                                                        "USD",
                                                        true
                                                    )}
                                                </span>
                                            );
                                        },
                                    })}
                                </span>
                                <div className="flex  gap-1  text-sm text-secondary-light">
                                    <span className="">
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
                    <div className="flex flex-col gap-8">{body}</div>
                </div>
            );
        },
    });
};
