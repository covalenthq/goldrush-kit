import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
    type DecodedTransactionMetadata,
    type DecodedEventType,
    type DecodedTransactionProps,
} from "@/utils/types/molecules.types";
import { type Option, None, Some } from "@/utils/option";
import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useCovalent } from "@/utils/store/Covalent";
import { calculatePrettyBalance, type ChainItem } from "@covalenthq/client-sdk";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Address } from "@/components/Atoms/Address/Address";

export const DecodedTransaction: React.FC<DecodedTransactionProps> = ({
    chain_name,
    tx_hash,
    setMetadata,
}) => {
    const { apikey, chains } = useCovalent();

    const [maybeResult, setResult] = useState<Option<DecodedEventType[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const CHAIN = useMemo<ChainItem | null>(() => {
        return chains?.find((o) => o.name === chain_name) ?? null;
    }, [chains, chain_name]);

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

    useEffect(() => {
        (async () => {
            try {
                setResult(None);
                if (setMetadata) {
                    setMetadata(None);
                }
                const response = await fetch(
                    "https://goldrush-decoder.vercel.app/api/v1/tx/decode",
                    {
                        body: JSON.stringify({
                            network: chain_name,
                            tx_hash: tx_hash,
                        }),
                        headers: {
                            "content-type": "application/json",
                            "x-covalent-api-key": apikey,
                        },
                        method: "POST",
                    }
                );
                const data = (await response.json()) as {
                    success: boolean;
                    message?: string;
                    events?: DecodedEventType[];
                    metadata: DecodedTransactionMetadata | null;
                };
                if (!data.success) {
                    setErrorMessage(data.message as string);
                    throw Error(data.message);
                }
                setResult(new Some(data.events!));
                if (setMetadata) {
                    setMetadata(new Some(data.metadata));
                }
            } catch (exception) {
                console.error(exception);
                setResult(new Some([]));
                if (setMetadata) {
                    setMetadata(new Some(null));
                }
            }
        })();
    }, [chain_name, tx_hash]);

    return (
        <>
            {maybeResult.match({
                None: () => (
                    <div className="border-y py-4">
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                ),
                Some: (events) => (
                    <div>
                        {errorMessage ? (
                            <p>{errorMessage}</p>
                        ) : !events.length ? (
                            <p>No decoded Events.</p>
                        ) : (
                            events.map(
                                ({ name, details, nfts, protocol, tokens }) => (
                                    <article
                                        key={name}
                                        className="flex w-full flex-col gap-y-4 border-t py-4 first:border-t-0 first:pt-0 last:pb-0"
                                    >
                                        <header className="flex w-full justify-between">
                                            <h3 className="font-medium">
                                                {name}
                                            </h3>

                                            <p className="text-sm font-semibold text-muted-foreground">
                                                {protocol?.name}
                                            </p>
                                        </header>

                                        {nfts?.length && (
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
                                                            className="flex gap-x-4"
                                                        >
                                                            <figure>
                                                                <Card className="w-32 overflow-hidden rounded border">
                                                                    <img
                                                                        className={`block h-32 w-32 rounded-t`}
                                                                        src={
                                                                            images[256] ||
                                                                            images[512] ||
                                                                            images[1024] ||
                                                                            images.default ||
                                                                            ""
                                                                        }
                                                                        onError={(
                                                                            e
                                                                        ) => {
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
                                                                </Card>
                                                            </figure>

                                                            <div className="flex flex-col gap-y-2 truncate text-ellipsis py-2 text-sm text-muted-foreground">
                                                                <div className="flex whitespace-break-spaces font-medium">
                                                                    {handleHashInString(
                                                                        heading
                                                                    )}
                                                                </div>

                                                                <div className="mt-auto flex flex-col gap-y-2">
                                                                    <p className="truncate text-ellipsis">
                                                                        Collection
                                                                        Name:{" "}
                                                                        <span className="text-black dark:text-text-color-50">
                                                                            {
                                                                                collection_name
                                                                            }
                                                                        </span>
                                                                    </p>
                                                                    <div className="flex gap-x-1 truncate text-ellipsis">
                                                                        Collection
                                                                        Address:
                                                                        <span className="text-black dark:text-text-color-50">
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
                                                                        <span className="text-black dark:text-text-color-50">
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
                                        )}

                                        {tokens?.length && (
                                            <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-2">
                                                {tokens.map(
                                                    ({
                                                        heading,
                                                        pretty_quote,
                                                        ticker_logo,
                                                        ticker_symbol,
                                                        decimals,
                                                        value,
                                                    }) => (
                                                        <div
                                                            key={
                                                                ticker_symbol +
                                                                heading
                                                            }
                                                        >
                                                            <div
                                                                className="text-sm text-muted-foreground"
                                                                title={heading}
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

                                                                <figure>
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
                                                                        is_chain_logo
                                                                    />
                                                                </figure>
                                                            </CardContent>

                                                            <p className="text-sm text-muted-foreground">
                                                                {pretty_quote}
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        {details?.length && (
                                            <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-2">
                                                {details.map(
                                                    ({
                                                        title,
                                                        type,
                                                        value,
                                                    }) => (
                                                        <div
                                                            key={
                                                                title +
                                                                Math.random()
                                                            }
                                                            className="truncate text-ellipsis"
                                                        >
                                                            <div
                                                                className="flex flex-col truncate text-ellipsis text-sm text-muted-foreground"
                                                                title={title}
                                                            >
                                                                <span className="font-medium">
                                                                    {title}
                                                                </span>
                                                                <div
                                                                    className="truncate text-ellipsis text-black dark:text-text-color-50"
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
                                                                    ) : (
                                                                        value
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </article>
                                )
                            )
                        )}
                    </div>
                ),
            })}
        </>
    );
};
