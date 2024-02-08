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
                                    <div className="flex w-full gap-x-[29px] p-4">
                                        <div className="flex w-fit flex-col">
                                            {nfts?.map((nft, i) => (
                                                <div>
                                                    <div
                                                        key={i}
                                                        className="h-fit w-fit rounded-md bg-black  p-[58px]"
                                                    >
                                                        <img
                                                            className="h-[380px] w-[480px]"
                                                            src={
                                                                nft
                                                                    .images[256] ||
                                                                nft
                                                                    .images[512] ||
                                                                nft
                                                                    .images[1024] ||
                                                                nft.images
                                                                    .default ||
                                                                ""
                                                            }
                                                            alt=""
                                                        />
                                                    </div>
                                                    <h2 className="mt-4 text-base font-semibold leading-6 text-[#65758B]">
                                                        Transaction status:{" "}
                                                        <span className="font-bold text-[#4BD37B]">
                                                            Success
                                                        </span>
                                                    </h2>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex w-full flex-col gap-y-4">
                                            <div className="grid w-full grid-cols-[1fr_1fr] gap-x-3">
                                                <div className="">
                                                    {nfts?.map((nft, i) => (
                                                        <div className="">
                                                            <h4 className="mb-[10px] text-base font-semibold leading-6 text-[#65758B]">
                                                                Nft Details
                                                            </h4>
                                                            <div className="h-[330px] w-full  rounded-lg border-[0.5px] border-solid border-[#8A97A5]">
                                                                <h2 className="border-b-[0.3px] border-[#8A97A5] px-6 py-4 text-base font-semibold leading-6 text-[#65758B]">
                                                                    Offered Nft
                                                                </h2>
                                                                <div className="flex flex-col gap-y-2 px-6 py-[14px] text-base font-semibold leading-6 text-black">
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
                                                                        <h3>
                                                                            {nft.collection_address
                                                                                .slice(
                                                                                    0,
                                                                                    18
                                                                                )
                                                                                .concat(
                                                                                    "..."
                                                                                )}
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
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="">
                                                    {nfts?.map((nft, i) => (
                                                        <>
                                                            <h4 className="mb-[10px] text-base font-semibold leading-6 text-[#65758B]">
                                                                Transaction
                                                                Events
                                                            </h4>
                                                            <div className="h-[330px] w-full rounded-lg border-[0.5px] border-solid border-[#8A97A5]">
                                                                {}
                                                                <h2 className="border-b-[0.3px] border-[#8A97A5] px-6 py-4 text-base font-semibold leading-6 text-[#65758B]">
                                                                    {action}:
                                                                    {name}
                                                                </h2>
                                                                <div className="flex flex-col gap-y-2 px-6 py-[14px] text-base font-semibold leading-6 text-black">
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
                                                                                        className="rounded-lg border-[1px] border-[#c4c4c4] p-2 text-xs"
                                                                                        onClick={() => {
                                                                                            navigator.clipboard.writeText(
                                                                                                detail.value
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        <img
                                                                                            className="h-3 w-3"
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
                                                                </div>
                                                            </div>
                                                        </>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="w-full">
                                                {nfts?.map((nft, i) => (
                                                    <>
                                                        <h4 className="mb-[10px] text-base font-semibold leading-6 text-[#65758B]">
                                                            Token Details
                                                        </h4>
                                                        <div className="w-full rounded-lg border-[0.5px] border-solid border-[#8A97A5]">
                                                            {}
                                                            <h2 className="border-b-[0.3px] border-[#8A97A5] px-6 py-4 text-base font-semibold leading-6 text-[#65758B]">
                                                                Token Sent
                                                            </h2>
                                                            <div className="flex items-center justify-between px-6 py-[14px] text-base font-semibold leading-6 text-black">
                                                                {tokens?.map(
                                                                    (token) => (
                                                                        <div>
                                                                            <h4 className="text-xs font-semibold leading-6 text-[#65758B]">
                                                                                Sent
                                                                                to:
                                                                            </h4>
                                                                            <h3 className="mb-[24px] flex items-center gap-1">
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
                                                                                    className="rounded-lg border-[1px] border-[#c4c4c4] p-1 text-xs"
                                                                                    onClick={() => {
                                                                                        navigator.clipboard.writeText(
                                                                                            token.heading
                                                                                        );
                                                                                    }}
                                                                                >
                                                                                    <img
                                                                                        className="h-3 w-3"
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
                                                                            <h3 className="flex items-center text-[13px] font-normal">
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
                                                                                    " ETH"
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
