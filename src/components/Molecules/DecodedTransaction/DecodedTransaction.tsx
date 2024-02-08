import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import Blockies from "react-blockies";
import Image from "next/image";
import copyIcon from "../../../static/copy-icon.svg";
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
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Address } from "@/components/Atoms/Address/Address";

export const DecodedTransaction: React.FC<DecodedTransactionProps> = ({
    chain_name,
    tx_hash,
    setMetadata,
}) => {
    const { apikey, chains } = useCovalent();

    const [maybeResult, setResult] = useState<Option<DecodedEventType[]>>(None);
    const [meta, setMeta] = useState<any>(null);

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
                    metadata: DecodedTransactionMetadata;
                };
                if (!data.success) {
                    throw Error(data.message);
                }
                setResult(new Some(data.events!));
                if (setMetadata) {
                    setMetadata(new Some(data.metadata));
                }
                setMeta(data.metadata);
            } catch (exception) {
                console.error(exception);
                setResult(new Some([]));
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
                        {!events.length ? (
                            <p>No decoded Events.</p>
                        ) : (
                            events.map(
                                ({
                                    name,
                                    details,
                                    nfts,
                                    protocol,
                                    tokens,
                                    action,
                                }) => (
                                    <div className="flex w-full flex-col gap-y-[29px] p-4">
                                        <div>
                                            <h2 className="mb-4 text-3xl font-bold text-[#121212]">
                                                Transcation Details:
                                            </h2>
                                            <div className="flex w-full items-center gap-x-[29px] rounded-lg border-[1px] border-[#f9f9f9] bg-[#121212] px-10 py-6 text-white shadow-lg">
                                                <div className="flex w-fit flex-col">
                                                    {nfts?.map((nft, i) => (
                                                        <div>
                                                            <div
                                                                key={i}
                                                                className="h-fit w-fit rounded-md bg-[#f9f9f9]  p-[2px]"
                                                            >
                                                                <img
                                                                    className="h-[230px] w-[230px]"
                                                                    src={
                                                                        nft
                                                                            .images[256] ||
                                                                        nft
                                                                            .images[512] ||
                                                                        nft
                                                                            .images[1024] ||
                                                                        nft
                                                                            .images
                                                                            .default ||
                                                                        ""
                                                                    }
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <h2 className="mt-4 text-base font-semibold leading-6 text-[#65758B]">
                                                                Transaction
                                                                status:{" "}
                                                                {maybeResult.match(
                                                                    {
                                                                        None: () =>
                                                                            false,
                                                                        Some: (
                                                                            success
                                                                        ) =>
                                                                            true,
                                                                    }
                                                                ) ? (
                                                                    <span className="font-bold text-[#4BD37B]">
                                                                        Success
                                                                    </span>
                                                                ) : (
                                                                    <span className="font-bold text-[#f44949]">
                                                                        Failed
                                                                    </span>
                                                                )}
                                                            </h2>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="w-full">
                                                    <div className="grid grid-cols-[1fr_1fr] gap-x-8 gap-y-4">
                                                        {nfts?.map((nft, i) => (
                                                            <>
                                                                <div>
                                                                    <h4 className="text-xs font-semibold leading-6 text-[#65758B]">
                                                                        Collection
                                                                        Name:
                                                                    </h4>
                                                                    <h3>
                                                                        {
                                                                            nft.collection_name
                                                                        }
                                                                    </h3>
                                                                </div>

                                                                <div>
                                                                    <h4 className="text-xs font-semibold leading-6 text-[#65758B]">
                                                                        Collection
                                                                        Address:
                                                                    </h4>
                                                                    <h3 className="flex items-center gap-x-2">
                                                                        {nft.collection_address
                                                                            .slice(
                                                                                0,
                                                                                18
                                                                            )
                                                                            .concat(
                                                                                "..."
                                                                            )}
                                                                        <button
                                                                            className="rounded-lg  text-xs"
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(
                                                                                    nft.collection_address
                                                                                );
                                                                            }}
                                                                        >
                                                                            <img
                                                                                className="h-4 w-4"
                                                                                src={
                                                                                    copyIcon
                                                                                }
                                                                                alt=""
                                                                            />
                                                                        </button>
                                                                    </h3>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xs font-semibold leading-6 text-[#65758B]">
                                                                        Token
                                                                        ID:
                                                                    </h4>
                                                                    <h3>
                                                                        {
                                                                            nft.token_identifier
                                                                        }
                                                                    </h3>
                                                                </div>
                                                            </>
                                                        ))}
                                                        {nfts?.map((nft, i) => (
                                                            <>
                                                                <div>
                                                                    <h4 className="text-xs font-semibold leading-6 text-[#65758B]">
                                                                        Action:
                                                                    </h4>
                                                                    <h3>
                                                                        {action}
                                                                    </h3>
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-xs font-semibold leading-6 text-[#65758B]">
                                                                        Event
                                                                        name:
                                                                    </h4>
                                                                    <h3>
                                                                        {name}
                                                                    </h3>
                                                                </div>

                                                                <div>
                                                                    <h4 className="text-xs font-semibold leading-6 text-[#65758B]">
                                                                        Protocol:
                                                                    </h4>
                                                                    <h3>
                                                                        {
                                                                            protocol?.name
                                                                        }
                                                                    </h3>
                                                                </div>

                                                                {details?.map(
                                                                    (
                                                                        detail
                                                                    ) => (
                                                                        <div>
                                                                            <h4 className="text-xs font-semibold leading-6 text-[#65758B]">
                                                                                {
                                                                                    detail.title
                                                                                }

                                                                                :
                                                                            </h4>
                                                                            <h3 className="flex items-center gap-x-2">
                                                                                {detail.title !==
                                                                                    "Order Hash" && (
                                                                                    <Blockies
                                                                                        seed={
                                                                                            detail.value
                                                                                        }
                                                                                        scale={
                                                                                            3
                                                                                        }
                                                                                        className="h-4 w-4 rounded-full"
                                                                                    />
                                                                                )}
                                                                                {detail.value
                                                                                    .slice(
                                                                                        0,
                                                                                        18
                                                                                    )
                                                                                    .concat(
                                                                                        "..."
                                                                                    )}
                                                                                <button
                                                                                    className="rounded-lg  text-xs"
                                                                                    onClick={() => {
                                                                                        navigator.clipboard.writeText(
                                                                                            detail.value
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <img
                                                                                        className="h-4 w-4"
                                                                                        src={
                                                                                            copyIcon
                                                                                        }
                                                                                        alt=""
                                                                                    />
                                                                                </button>
                                                                            </h3>
                                                                        </div>
                                                                    )
                                                                )}
                                                            </>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex w-full flex-col gap-y-4">
                                            {nfts?.map((nft, i) => (
                                                <>
                                                    <h2 className="text-3xl font-bold text-[#121212]">
                                                        Token Details:
                                                    </h2>
                                                    <div className="w-full items-center gap-x-[29px] rounded-lg border-[1px] border-[#f9f9f9] bg-[#121212] px-10 py-6 text-white shadow-lg">
                                                        <div className="flex items-center justify-between px-6 py-[14px] text-base font-semibold leading-6 ">
                                                            {tokens?.map(
                                                                (token) => (
                                                                    <div>
                                                                        <h4 className="mb-3 text-base font-semibold leading-6 text-[#65758B]">
                                                                            Token
                                                                            sent
                                                                            to:
                                                                        </h4>
                                                                        <h3 className="mb-[24px] flex items-center gap-2">
                                                                            <Blockies
                                                                                seed={
                                                                                    token.heading
                                                                                }
                                                                                scale={
                                                                                    3
                                                                                }
                                                                                className="h-4 w-4 rounded-full"
                                                                            />
                                                                            {token.heading
                                                                                .split(
                                                                                    " "
                                                                                )[2]
                                                                                .slice(
                                                                                    0,
                                                                                    10
                                                                                )
                                                                                .concat(
                                                                                    "..."
                                                                                )}
                                                                            <button
                                                                                className="rounded-lg  text-xs"
                                                                                onClick={() => {
                                                                                    navigator.clipboard.writeText(
                                                                                        token.heading
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <img
                                                                                    className="h-4 w-4"
                                                                                    src={
                                                                                        copyIcon
                                                                                    }
                                                                                    alt=""
                                                                                />
                                                                            </button>
                                                                        </h3>
                                                                        <h4 className="text-xs font-semibold leading-6 text-[#65758B]">
                                                                            Price:
                                                                        </h4>
                                                                        <h3 className="flex items-center text-[16px] font-medium">
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
                                                                                        token.ticker_logo ||
                                                                                        CHAIN?.logo_url
                                                                                    }
                                                                                    is_chain_logo
                                                                                />
                                                                            </figure>
                                                                            {calculatePrettyBalance(
                                                                                BigInt(
                                                                                    token.value
                                                                                ),
                                                                                token.decimals
                                                                            )}
                                                                            {
                                                                                "ETH "
                                                                            }
                                                                            (
                                                                            {
                                                                                token.pretty_quote
                                                                            }
                                                                            )
                                                                        </h3>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                </>
                                            ))}
                                        </div>
                                        <div>
                                            <h2 className="mb-4 text-3xl font-bold text-[#121212]">
                                                Transaction metadata:
                                            </h2>

                                            <div className="grid w-full  grid-cols-[1fr_1fr_1fr] items-center gap-x-6 gap-y-4 rounded-lg border-[1px] border-[#f9f9f9] bg-[#121212] px-10 py-6 text-white shadow-lg">
                                                <div>
                                                    <h4 className="text-sm font-semibold leading-6 text-[#65758B]">
                                                        Block time stamp:
                                                    </h4>
                                                    <h3>
                                                        {meta!.block_signed_at}
                                                    </h3>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold leading-6 text-[#65758B]">
                                                        Block height:
                                                    </h4>
                                                    <h3>
                                                        {meta!.block_height}
                                                    </h3>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold leading-6 text-[#65758B]">
                                                        Block hash:
                                                    </h4>
                                                    <h3 className="flex items-center gap-x-2">
                                                        {meta!.block_hash
                                                            .slice(0, 17)
                                                            .concat("...")}
                                                        <button
                                                            className="rounded-lg  text-xs"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    meta!
                                                                        .block_hash
                                                                );
                                                            }}
                                                        >
                                                            <img
                                                                className="h-4 w-4"
                                                                src={copyIcon}
                                                                alt=""
                                                            />
                                                        </button>
                                                    </h3>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold leading-6 text-[#65758B]">
                                                        Txn hash:
                                                    </h4>
                                                    <h3 className="flex items-center gap-x-2">
                                                        {meta!.tx_hash
                                                            .slice(0, 17)
                                                            .concat("...")}
                                                        <button
                                                            className="rounded-lg  text-xs"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    meta!
                                                                        .tx_hash
                                                                );
                                                            }}
                                                        >
                                                            <img
                                                                className="h-4 w-4"
                                                                src={copyIcon}
                                                                alt=""
                                                            />
                                                        </button>
                                                    </h3>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold leading-6 text-[#65758B]">
                                                        Gas fee:
                                                    </h4>
                                                    <h3 className="flex items-center gap-x-2">
                                                        {meta!.pretty_gas_quote}
                                                    </h3>
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold leading-6 text-[#65758B]">
                                                        Miner Address:
                                                    </h4>
                                                    <h3 className="flex items-center gap-x-2">
                                                        <Blockies
                                                            seed={
                                                                meta!
                                                                    .miner_address
                                                            }
                                                            className="h-4 w-4 rounded-full"
                                                        />
                                                        {meta!.miner_address
                                                            .slice(0, 17)
                                                            .concat("...")}
                                                        <button
                                                            className="rounded-lg  text-xs"
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(
                                                                    meta!
                                                                        .tx_hash
                                                                );
                                                            }}
                                                        >
                                                            <img
                                                                className="h-4 w-4"
                                                                src={copyIcon}
                                                                alt=""
                                                            />
                                                        </button>
                                                    </h3>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )
                        )}
                    </div>
                ),
            })}
        </>
    );
};
