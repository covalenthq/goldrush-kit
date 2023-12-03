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
import { flatMap, sum } from "lodash";
import { AccountCardView } from "@/components/Molecules/AccountCardView/AccountCardView";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoldrush } from "@/utils/store/Goldrush";
import { type NFTWalletTokenListViewProps } from "@/utils/types/organisms.types";

export const NFTWalletTokenListView: React.FC<NFTWalletTokenListViewProps> = ({
    chain_name,
    address,
}) => {
    const [maybeResult, setResult] =
        useState<Option<NftTokenContractBalanceItem[]>>(None);
    const { covalentClient } = useGoldrush();
    const [error, setError] = useState({ error: false, error_message: "" });

    useEffect(() => {
        (async () => {
            let response;
            try {
                response = await covalentClient.NftService.getNftsForAddress(
                    chain_name,
                    address.trim()
                );
                setError({ error: false, error_message: "" });
                setResult(new Some(response.data.items));
            } catch (exception) {
                setResult(new Some([]));
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
            }
        })();
    }, [chain_name, address]);

    return maybeResult.match({
        None: () => <>Loading</>,
        Some: (result) => {
            let body;
            if (error.error) {
                body = <>{error.error_message}</>;
            } else if (!error.error && result.length === 0) {
                body = <>No results</>;
            } else if (result.length > 0) {
                body = result.map((items) => {
                    return flatMap(items.nft_data, (it) => {
                        return (
                            <Card className="w-[230px] rounded border">
                                <CardContent>
                                    <img
                                        className={`block h-[10rem] w-full rounded-t ${
                                            it.external_data
                                                ? "object-cover"
                                                : "p-2"
                                        }`}
                                        src={
                                            it.external_data
                                                ? it.external_data.image_512
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
                                <div className="flex  gap-1  text-sm text-secondary">
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

                    <div className="flex flex-wrap gap-8">{body}</div>
                </div>
            );
        },
    });
};
