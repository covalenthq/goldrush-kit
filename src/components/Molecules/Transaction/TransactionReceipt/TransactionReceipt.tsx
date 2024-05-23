import { type TransactionReceiptProps } from "@/utils/types/molecules.types";
import { Heading } from "@/components/Shared";
import { Address, NFT, TokenAvatar } from "@/components/Atoms";
import { AddressCard } from "@/components/Atoms";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { type Option, None, Some } from "@/utils/option";
import { type DecodedTransactionType } from "@/utils/types/molecules.types";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { calculatePrettyBalance, type ChainItem } from "@covalenthq/client-sdk";
import { useGoldRush } from "@/utils/store";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    defaultErrorMessage,
} from "@/utils/constants/shared.constants";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { Timestamp } from "@/components/Atoms";

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
    chain_name,
    tx_hash,
    actionable_transaction,
    actionable_from,
    actionable_to,
}) => {
    const { apikey, chains } = useGoldRush();

    const [maybeResult, setMaybeResult] =
        useState<Option<DecodedTransactionType | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const CHAIN = useMemo<ChainItem | null>(() => {
        return chains?.find((o) => o.name === chain_name) ?? null;
    }, [chains, chain_name]);

    useEffect(() => {
        (async () => {
            try {
                setMaybeResult(None);
                setErrorMessage(null);
                const response = await fetch(
                    "https://goldrush-decoder.vercel.app/api/v1/tx/decode",
                    {
                        body: JSON.stringify({
                            chain_name: chain_name,
                            tx_hash: tx_hash,
                        }),
                        headers: {
                            "content-type": "application/json",
                            "x-covalent-api-key": apikey,
                        },
                        method: "POST",
                    }
                );
                const data = (await response.json()) as DecodedTransactionType;
                if (!data.success) {
                    throw { error_message: data.message };
                }
                setMaybeResult(new Some(data));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, tx_hash]);

    const handleHashInString = useCallback(
        (text: string) =>
            text
                .split(" ")
                .map((t) => (
                    <Fragment key={t + Math.random()}>
                        {t.match(/(0x[a-fA-F0-9]{40})|(0x[a-fA-F0-9]{64})/g) ? (
                            <Address address={t} />
                        ) : (
                            <span>{t} </span>
                        )}
                    </Fragment>
                )),
        []
    );

    return (
        <Card className="overflow-hidden rounded border border-secondary-light dark:border-secondary-dark">
            <figure className="h-10 w-full bg-primary-light dark:bg-primary-dark" />
            <main className="flex h-full w-full flex-col gap-y-4 p-4">
                <header className="flex flex-col gap-y-1">
                    <Heading size={4}>Transaction Receipt</Heading>
                    <div className="text-sm text-secondary-light dark:text-secondary-dark">
                        <Address
                            address={tx_hash}
                            actionable_address={actionable_transaction}
                        />
                    </div>
                </header>

                {maybeResult.match({
                    None: () => (
                        <>
                            <div className="flex flex-col gap-y-4">
                                <div className="flex flex-col gap-y-2">
                                    {Array(2)
                                        .fill(null)
                                        .map(() => (
                                            <Skeleton
                                                key={Math.random()}
                                                size={GRK_SIZES.LARGE}
                                            />
                                        ))}
                                </div>

                                <div className="flex gap-6 pb-2">
                                    {Array(2)
                                        .fill(null)
                                        .map(() => (
                                            <Skeleton
                                                key={Math.random()}
                                                size={GRK_SIZES.LARGE}
                                            />
                                        ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-y-2 border-y border-secondary-light py-4 dark:border-secondary-dark">
                                {Array(2)
                                    .fill(null)
                                    .map(() => (
                                        <Skeleton
                                            key={Math.random()}
                                            size={GRK_SIZES.LARGE}
                                        />
                                    ))}
                            </div>

                            <div className="flex flex-col gap-y-2">
                                {Array(2)
                                    .fill(null)
                                    .map(() => (
                                        <Skeleton
                                            key={Math.random()}
                                            size={GRK_SIZES.LARGE}
                                        />
                                    ))}
                            </div>
                        </>
                    ),
                    Some: (result) =>
                        errorMessage ? (
                            <p>{errorMessage}</p>
                        ) : result?.tx_metadata && result?.events ? (
                            <>
                                <div className="flex flex-col gap-y-1">
                                    <CardDescription>
                                        Chain:{" "}
                                        <span className="text-black dark:text-slate-50">
                                            {CHAIN?.label}
                                        </span>
                                    </CardDescription>

                                    <CardDescription>
                                        Transaction Time:{" "}
                                        <Timestamp
                                            timestamp={
                                                result.tx_metadata
                                                    .block_signed_at
                                            }
                                        />
                                    </CardDescription>
                                </div>

                                <div className="flex flex-col gap-x-8 gap-y-2 md:flex-row">
                                    <div className="flex flex-col">
                                        <CardDescription>
                                            Address
                                        </CardDescription>
                                        <AddressCard
                                            address={
                                                result.tx_metadata.from_address
                                            }
                                            label={
                                                result.tx_metadata
                                                    .from_address_label
                                            }
                                            actionable_address={actionable_from}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <CardDescription>
                                            Interacted with
                                        </CardDescription>
                                        <AddressCard
                                            address={
                                                result.tx_metadata.to_address
                                            }
                                            label={
                                                result.tx_metadata
                                                    .to_address_label
                                            }
                                            actionable_address={actionable_to}
                                        />
                                    </div>
                                </div>

                                {result?.events.map(
                                    (
                                        {
                                            name,
                                            details,
                                            nfts,
                                            protocol,
                                            tokens,
                                        },
                                        i
                                    ) => (
                                        <article
                                            key={name + i}
                                            className="group flex w-full flex-col border-t border-secondary-light py-4 dark:border-secondary-dark md:gap-y-4"
                                        >
                                            <header className="flex w-full justify-between">
                                                <h3 className="font-medium">
                                                    {name}
                                                </h3>

                                                <p className="text-sm font-semibold text-primary-light dark:text-primary-dark">
                                                    {protocol?.name}
                                                </p>
                                            </header>

                                            {nfts?.length ? (
                                                <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2">
                                                    {nfts.map(
                                                        ({
                                                            collection_address,
                                                            collection_name,
                                                            heading,
                                                            images,
                                                            token_identifier,
                                                        }) => (
                                                            <div
                                                                key={
                                                                    collection_address +
                                                                    token_identifier
                                                                }
                                                                className="flex flex-col gap-x-4 sm:flex-row"
                                                            >
                                                                <figure>
                                                                    <NFT
                                                                        src={
                                                                            images[256] ||
                                                                            images[512] ||
                                                                            images[1024]
                                                                        }
                                                                    />
                                                                </figure>

                                                                <div className="flex flex-col gap-y-2 truncate text-ellipsis py-2 text-sm text-secondary-light dark:text-secondary-dark">
                                                                    <div className="flex whitespace-break-spaces font-medium">
                                                                        {handleHashInString(
                                                                            heading
                                                                        )}
                                                                    </div>

                                                                    <div className="mt-auto flex flex-col gap-y-2">
                                                                        <p className="truncate text-ellipsis">
                                                                            Collection
                                                                            Name:{" "}
                                                                            <span className="text-black dark:text-slate-50">
                                                                                {
                                                                                    collection_name
                                                                                }
                                                                            </span>
                                                                        </p>
                                                                        <div className="flex gap-x-1 truncate text-ellipsis">
                                                                            Collection
                                                                            Address:
                                                                            <span className="text-black dark:text-slate-50">
                                                                                <Address
                                                                                    address={
                                                                                        collection_address
                                                                                    }
                                                                                />
                                                                            </span>
                                                                        </div>
                                                                        <p className="truncate text-ellipsis">
                                                                            Token
                                                                            ID:{" "}
                                                                            <span className="text-black dark:text-slate-50">
                                                                                {
                                                                                    token_identifier
                                                                                }
                                                                            </span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <></>
                                            )}

                                            {tokens?.length ? (
                                                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    {tokens.map(
                                                        ({
                                                            heading,
                                                            pretty_quote,
                                                            ticker_logo,
                                                            ticker_symbol,
                                                            decimals,
                                                            value,
                                                        }) => {
                                                            const extension =
                                                                ticker_logo
                                                                    ? ticker_logo
                                                                          ?.split(
                                                                              "."
                                                                          )
                                                                          ?.pop()
                                                                          ?.toLowerCase()
                                                                    : "";
                                                            return (
                                                                <div
                                                                    key={
                                                                        ticker_symbol +
                                                                        heading
                                                                    }
                                                                    className="text-sm"
                                                                    title={
                                                                        heading
                                                                    }
                                                                >
                                                                    <div
                                                                        className="text-sm text-secondary-light dark:text-secondary-dark"
                                                                        title={
                                                                            heading
                                                                        }
                                                                    >
                                                                        <div className="flex whitespace-break-spaces font-medium">
                                                                            {handleHashInString(
                                                                                heading ||
                                                                                    "Token Amount"
                                                                            )}
                                                                        </div>
                                                                    </div>

                                                                    <CardContent className="flex items-center truncate text-sm">
                                                                        <span className="text-base">
                                                                            {calculatePrettyBalance(
                                                                                BigInt(
                                                                                    value
                                                                                ),
                                                                                decimals
                                                                            )}{" "}
                                                                            {
                                                                                ticker_symbol
                                                                            }
                                                                        </span>

                                                                        <figure className="ml-2">
                                                                            <TokenAvatar
                                                                                size={
                                                                                    GRK_SIZES.EXTRA_EXTRA_SMALL
                                                                                }
                                                                                chain_color={
                                                                                    CHAIN
                                                                                        ?.color_theme
                                                                                        .hex
                                                                                }
                                                                                token_url={
                                                                                    ticker_logo ||
                                                                                    CHAIN?.logo_url
                                                                                }
                                                                                is_chain_logo={
                                                                                    extension ===
                                                                                    "svg"
                                                                                        ? true
                                                                                        : false
                                                                                }
                                                                            />
                                                                        </figure>
                                                                    </CardContent>

                                                                    <p className="text-sm text-secondary-light dark:text-secondary-dark">
                                                                        {
                                                                            pretty_quote
                                                                        }
                                                                    </p>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            ) : (
                                                <></>
                                            )}

                                            {details?.length ? (
                                                <div className="mt-2 grid grid-cols-1 gap-4 md:grid-cols-3">
                                                    {details.map(
                                                        ({
                                                            heading,
                                                            type,
                                                            value,
                                                        }) => (
                                                            <div
                                                                key={
                                                                    heading +
                                                                    Math.random()
                                                                }
                                                                className="truncate text-ellipsis"
                                                            >
                                                                <div
                                                                    className="flex flex-col truncate text-ellipsis text-sm text-secondary-light dark:text-secondary-dark"
                                                                    title={
                                                                        heading
                                                                    }
                                                                >
                                                                    <span className="font-medium">
                                                                        {
                                                                            heading
                                                                        }
                                                                    </span>
                                                                    <div
                                                                        className="truncate text-ellipsis text-black dark:text-slate-50"
                                                                        title={
                                                                            value
                                                                        }
                                                                    >
                                                                        {type ===
                                                                        "address" ? (
                                                                            <Address
                                                                                address={
                                                                                    value
                                                                                }
                                                                            />
                                                                        ) : type ===
                                                                          "timestamp" ? (
                                                                            <Timestamp
                                                                                timestamp={
                                                                                    value
                                                                                }
                                                                            />
                                                                        ) : (
                                                                            value
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                        </article>
                                    )
                                )}

                                <div className="flex flex-col gap-y-2 border-t pt-4">
                                    <div>
                                        <CardDescription>
                                            Transaction Fee
                                        </CardDescription>
                                        <CardDescription>
                                            <span
                                                className="text-black dark:text-slate-50"
                                                title={calculatePrettyBalance(
                                                    BigInt(
                                                        result.tx_metadata
                                                            .fees_paid || 0
                                                    )!,
                                                    result.tx_metadata
                                                        .gas_metadata
                                                        .contract_decimals
                                                )}
                                            >
                                                {calculatePrettyBalance(
                                                    BigInt(
                                                        result.tx_metadata
                                                            .fees_paid || 0
                                                    )!,
                                                    result.tx_metadata
                                                        .gas_metadata
                                                        .contract_decimals,
                                                    true,
                                                    4
                                                )}{" "}
                                                {
                                                    result.tx_metadata
                                                        .gas_metadata
                                                        .contract_ticker_symbol
                                                }{" "}
                                            </span>
                                            {
                                                result.tx_metadata
                                                    .pretty_gas_quote
                                            }
                                        </CardDescription>
                                    </div>

                                    <div>
                                        <CardDescription>
                                            Exchange Rate
                                        </CardDescription>
                                        <CardDescription>
                                            <span className="text-black dark:text-slate-50">
                                                1 USD ={" "}
                                                {1 /
                                                    (result.tx_metadata
                                                        .gas_quote_rate ??
                                                        1)}{" "}
                                                {
                                                    result.tx_metadata
                                                        .gas_metadata
                                                        .contract_ticker_symbol
                                                }
                                            </span>
                                        </CardDescription>
                                    </div>

                                    <div>
                                        <CardDescription>
                                            Gas Price
                                        </CardDescription>
                                        <CardDescription>
                                            <span className="text-black dark:text-slate-50">
                                                {calculatePrettyBalance(
                                                    BigInt(
                                                        result.tx_metadata
                                                            .gas_price
                                                    ),
                                                    result.tx_metadata
                                                        .gas_metadata
                                                        .contract_decimals,
                                                    true,
                                                    10
                                                )}{" "}
                                                {
                                                    result.tx_metadata
                                                        .gas_metadata
                                                        .contract_ticker_symbol
                                                }
                                            </span>
                                        </CardDescription>
                                    </div>
                                </div>

                                <a
                                    href={result.tx_metadata.explorers[0].url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm font-semibold hover:underline"
                                >
                                    View on{" "}
                                    {result.tx_metadata.explorers[0].label ??
                                        "Explorer"}
                                </a>
                            </>
                        ) : (
                            <></>
                        ),
                })}
            </main>
        </Card>
    );
};
