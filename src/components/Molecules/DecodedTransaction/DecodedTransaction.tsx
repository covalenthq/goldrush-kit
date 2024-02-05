import { useEffect, useMemo, useState } from "react";
import {
    type DecodedTransactionMetadata,
    type DecodedEventType,
    type DecodedTransactionProps,
} from "@/utils/types/molecules.types";
import { type Option, None, Some } from "@/utils/option";
import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { TypographyH4 } from "@/components/ui/typography";
import { useCovalent } from "@/utils/store/Covalent";
import { calculatePrettyBalance, type ChainItem } from "@covalenthq/client-sdk";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const DecodedTransaction: React.FC<DecodedTransactionProps> = ({
    chain_name,
    tx_hash,
    setMetadata,
}) => {
    const { chains } = useCovalent();

    const [maybeResult, setResult] = useState<Option<DecodedEventType[]>>(None);

    const CHAIN = useMemo<ChainItem | null>(() => {
        return chains?.find((o) => o.name === chain_name) ?? null;
    }, [chains, chain_name]);

    useEffect(() => {
        setResult(None);
    }, [chain_name, tx_hash]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.STORYBOOK_GOLDRUSH_DECODER_BASE_URL}/tx/decode`,
                    {
                        body: JSON.stringify({
                            network: chain_name,
                            tx_hash: tx_hash,
                        }),
                        headers: {
                            "content-type": "application/json",
                            "x-covalent-api-key": import.meta.env
                                .STORYBOOK_COVALENT_API_KEY as string,
                        },
                        method: "POST",
                    }
                );
                const data = (await response.json()) as {
                    success: boolean;
                    message?: string;
                    events?: DecodedEventType[];
                    metadata: DecodedTransactionMetadata;
                };
                if (!data.success) {
                    throw Error(data.message);
                }
                setResult(new Some(data.events!));
                if (setMetadata) {
                    setMetadata(new Some(data.metadata));
                }
            } catch (exception) {
                console.error(exception);
                setResult(new Some([]));
            }
        })();
    }, [chain_name, tx_hash]);

    return (
        <>
            {maybeResult.match({
                None: () => <Skeleton size={GRK_SIZES.LARGE} />,
                Some: (events) => (
                    <div>
                        {!events.length ? (
                            <TypographyH4>No decoded Events.</TypographyH4>
                        ) : (
                            events.map(
                                ({
                                    action,
                                    category,
                                    name,
                                    details,
                                    nfts,
                                    protocol,
                                    tokens,
                                }) => (
                                    <article
                                        key={name}
                                        className="flex w-full flex-col gap-y-4"
                                    >
                                        <header className="flex w-full gap-x-8">
                                            <CardDescription className="flex flex-col">
                                                Protocol
                                                <span className="text-black">
                                                    {protocol?.name}
                                                </span>
                                            </CardDescription>

                                            <CardDescription className="flex flex-col">
                                                Category
                                                <span className="text-black">
                                                    {category}
                                                </span>
                                            </CardDescription>

                                            <CardDescription className="flex flex-col">
                                                Action
                                                <span className="text-black">
                                                    {action}
                                                </span>
                                            </CardDescription>
                                        </header>

                                        {tokens?.length && (
                                            <div>
                                                <CardTitle>Tokens</CardTitle>

                                                <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-2">
                                                    {tokens.map(
                                                        ({
                                                            heading,
                                                            pretty,
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
                                                                <CardDescription
                                                                    className="truncate text-ellipsis"
                                                                    title={
                                                                        heading
                                                                    }
                                                                >
                                                                    {heading ||
                                                                        "Token Amount"}
                                                                </CardDescription>
                                                                <CardContent className="flex items-center gap-x-2 truncate">
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
                                                                                ticker_logo
                                                                            }
                                                                        />
                                                                    </figure>
                                                                    {pretty ||
                                                                        calculatePrettyBalance(
                                                                            BigInt(
                                                                                value
                                                                            ),
                                                                            decimals
                                                                        )}{" "}
                                                                    {
                                                                        ticker_symbol
                                                                    }
                                                                </CardContent>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {details?.length && (
                                            <div>
                                                <CardTitle>Details</CardTitle>

                                                <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-2">
                                                    {details.map(
                                                        (
                                                            { title, value },
                                                            i
                                                        ) => (
                                                            <div
                                                                key={title + i}
                                                                className="truncate text-ellipsis"
                                                            >
                                                                <CardDescription
                                                                    className="flex flex-col truncate text-ellipsis"
                                                                    title={
                                                                        title
                                                                    }
                                                                >
                                                                    {title}
                                                                    <span
                                                                        className=" truncate text-ellipsis text-black"
                                                                        title={
                                                                            value
                                                                        }
                                                                    >
                                                                        {value}
                                                                    </span>
                                                                </CardDescription>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {nfts?.length && (
                                            <div>
                                                <CardTitle>NFTs</CardTitle>

                                                <div className="mt-2 grid grid-cols-3 gap-x-4 gap-y-2">
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
                                                                className="w-40 rounded border"
                                                            >
                                                                <img
                                                                    className={`block h-40 w-40 rounded-t`}
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

                                                                <div className="truncate text-ellipsis p-2">
                                                                    <CardDescription
                                                                        title={
                                                                            heading
                                                                        }
                                                                        className="truncate text-ellipsis"
                                                                    >
                                                                        <span className="text-black">
                                                                            {
                                                                                heading
                                                                            }
                                                                        </span>
                                                                    </CardDescription>

                                                                    <CardDescription
                                                                        title={
                                                                            collection_name ||
                                                                            "<NO COLLECTION NAME>"
                                                                        }
                                                                        className="text-wrap"
                                                                    >
                                                                        {collection_name ||
                                                                            "<NO COLLECTION NAME>"}
                                                                    </CardDescription>

                                                                    <CardDescription>
                                                                        <span className="font-medium">
                                                                            #
                                                                            {
                                                                                token_identifier
                                                                            }
                                                                        </span>
                                                                    </CardDescription>
                                                                </div>
                                                            </Card>
                                                        )
                                                    )}
                                                </div>
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
