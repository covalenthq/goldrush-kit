import { Fragment, useCallback, useEffect, useState } from "react";
import {
    type DecodedTransactionMetadata,
    type DecodedEventType,
    type DecodedTransactionProps,
} from "@/utils/types/molecules.types";
import { type Option, None, Some } from "@/utils/option";
import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { calculatePrettyBalance } from "@covalenthq/client-sdk";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Address } from "@/components/Atoms/Address/Address";
import { Badge } from "@/components/ui/badge";

export const DecodedTransaction: React.FC<DecodedTransactionProps> = ({
    chain_name,
    tx_hash,
    setTxMetadata,
}) => {
    const { apikey } = useGoldRush();

    const [maybeResult, setResult] = useState<Option<DecodedEventType[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleHashInString = useCallback(
        (text: string) =>
            text
                .split(" ")
                .map((t) => (
                    <Fragment key={t + Math.random()}>
                        {t.match(/(0x[a-fA-F0-9]{40})|(0x[a-fA-F0-9]{64})/g) ? (
                            <Address address={t} />
                        ) : (
                            t + " "
                        )}
                    </Fragment>
                )),
        []
    );

    const includeAddress = useCallback(
        (text: string) =>
            text
                .split(" ")
                .some((t) =>
                    t.match(/(0x[a-fA-F0-9]{40})|(0x[a-fA-F0-9]{64})/g)
                ),
        []
    );

    useEffect(() => {
        (async () => {
            try {
                setResult(None);
                setErrorMessage(null);
                if (setTxMetadata) {
                    setTxMetadata(None);
                }
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
                const data = (await response.json()) as {
                    success: boolean;
                    message?: string;
                    events?: DecodedEventType[];
                    tx_metadata: DecodedTransactionMetadata | null;
                };
                if (!data.success) {
                    setErrorMessage(data.message as string);
                    throw Error(data.message);
                }
                setResult(new Some(data.events!));
                console.log(new Some(data.events)!);
                if (setTxMetadata) {
                    setTxMetadata(new Some(data.tx_metadata));
                }
            } catch (exception) {
                console.error(exception);
                setResult(new Some([]));
                if (setTxMetadata) {
                    setTxMetadata(new Some(null));
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
                                        className="my-4 flex w-full flex-col rounded-lg border first:my-0"
                                    >
                                        <header className="flex w-full gap-2 border-b p-4">
                                            <Badge variant="default">
                                                {name}
                                            </Badge>

                                            <Badge variant="secondary">
                                                {protocol?.name}
                                            </Badge>
                                        </header>

                                        {nfts?.length && (
                                            <div className="grid grid-cols-1 gap-x-4 gap-y-2 border-b p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                                {nfts.map(
                                                    ({
                                                        collection_address,
                                                        collection_name,
                                                        heading,
                                                        images,
                                                        token_identifier,
                                                    }) => (
                                                        <Card
                                                            key={
                                                                collection_address +
                                                                token_identifier
                                                            }
                                                            className="flex max-h-36 gap-x-4"
                                                        >
                                                            <figure>
                                                                <img
                                                                    className={`block h-full w-32 rounded-l`}
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
                                                            </figure>

                                                            <div className="flex flex-col gap-y-2 truncate text-ellipsis py-2 text-sm text-muted-foreground">
                                                                <div className="flex flex-col whitespace-break-spaces font-medium">
                                                                    {handleHashInString(
                                                                        heading
                                                                    )}
                                                                </div>

                                                                <div className="mt-auto flex flex-col gap-y-2">
                                                                    <p className="truncate text-ellipsis">
                                                                        <span className="font-semibold text-black dark:text-text-color-50">
                                                                            {
                                                                                collection_name
                                                                            }
                                                                        </span>
                                                                    </p>
                                                                    <div className="flex gap-x-1 truncate text-ellipsis">
                                                                        <span className="text-black dark:text-text-color-50">
                                                                            <Address
                                                                                address={
                                                                                    collection_address
                                                                                }
                                                                            />
                                                                        </span>
                                                                    </div>
                                                                    <Badge
                                                                        variant="default"
                                                                        className="w-fit px-1"
                                                                    >
                                                                        {"#" +
                                                                            token_identifier}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        {tokens?.length && (
                                            <div className="grid grid-cols-1 gap-x-4 gap-y-2 border-b p-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                                                {tokens.map(
                                                    ({
                                                        heading,
                                                        pretty_quote,
                                                        ticker_logo,
                                                        ticker_symbol,
                                                        decimals,
                                                        value,
                                                    }) => (
                                                        <Card
                                                            className="p-4"
                                                            key={
                                                                ticker_symbol +
                                                                heading
                                                            }
                                                        >
                                                            <CardTitle
                                                                className="flex items-center justify-between pb-1 text-sm font-medium"
                                                                title={heading}
                                                            >
                                                                <div className="flex w-full items-center justify-between whitespace-break-spaces font-medium">
                                                                    {handleHashInString(
                                                                        heading ||
                                                                            "Token Amount"
                                                                    )}
                                                                </div>
                                                                {!includeAddress(
                                                                    heading
                                                                ) && (
                                                                    <figure>
                                                                        <TokenAvatar
                                                                            size={
                                                                                GRK_SIZES.EXTRA_EXTRA_SMALL
                                                                            }
                                                                            token_url={
                                                                                ticker_logo
                                                                            }
                                                                        />
                                                                    </figure>
                                                                )}
                                                            </CardTitle>

                                                            <CardContent className="flex items-center truncate text-sm">
                                                                <span className="text-xl font-bold">
                                                                    {calculatePrettyBalance(
                                                                        BigInt(
                                                                            value
                                                                        ),
                                                                        decimals
                                                                    )}{" "}
                                                                    <span className="text-sm">
                                                                        {
                                                                            ticker_symbol
                                                                        }
                                                                    </span>
                                                                </span>
                                                            </CardContent>

                                                            <p className="text-sm text-muted-foreground">
                                                                {pretty_quote}
                                                            </p>
                                                        </Card>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        {details?.length && (
                                            <div className="grid grid-cols-1 gap-x-4 gap-y-2 border-b p-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
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
                                                                className="flex flex-col truncate text-ellipsis text-sm text-muted-foreground"
                                                                title={heading}
                                                            >
                                                                <span className="font-medium">
                                                                    {heading}
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

