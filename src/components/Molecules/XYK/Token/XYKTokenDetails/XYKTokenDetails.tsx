import { useEffect } from "react";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TokenV2VolumeWithChartData } from "@covalenthq/client-sdk";
import { useState } from "react";
import { CardDetail } from "@/components/Shared";
import { type XYKTokenDetailsProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
} from "@/utils/constants/shared.constants";
import { Card } from "@/components/ui/card";
import {
    type CardDetailProps,
    type CovalentAPIError,
} from "@/utils/types/shared.types";
import { Address, TokenAvatar } from "@/components/Atoms";

export const XYKTokenDetails: React.FC<XYKTokenDetailsProps> = ({
    chain_name,
    dex_name,
    token_address,
    maybeResult: initialMaybeResult = null,
    errorMessage: initialErrorMessage = null,
    actionable_address,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<TokenV2VolumeWithChartData | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        initialErrorMessage
    );

    useEffect(() => {
        if (initialErrorMessage) {
            setErrorMessage(initialErrorMessage);
        }
    }, [initialErrorMessage]);

    useEffect(() => {
        if (initialMaybeResult) {
            setMaybeResult(initialMaybeResult);
        }
    }, [initialMaybeResult]);

    useEffect(() => {
        (async () => {
            if (!initialMaybeResult) {
                try {
                    setMaybeResult(None);
                    setErrorMessage(null);
                    const { data, ...error } =
                        await covalentClient.XykService.getLpTokenView(
                            chain_name,
                            dex_name,
                            token_address
                        );
                    if (error.error) {
                        throw error;
                    }
                    setMaybeResult(new Some(data.items[0]));
                } catch (error: CovalentAPIError | any) {
                    setErrorMessage(
                        error?.error_message ?? DEFAULT_ERROR_MESSAGE
                    );
                    setMaybeResult(new Some(null));
                    console.error(error);
                }
            }
        })();
    }, [chain_name, dex_name, token_address, initialMaybeResult]);

    return (
        <Card className="grid w-full grid-cols-1 items-center gap-4 break-all p-2 md:grid-cols-2 lg:grid-cols-3">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(6)
                            .fill(null)
                            .map(() => (
                                <div key={Math.random()}>
                                    <Skeleton size={GRK_SIZES.LARGE} />
                                </div>
                            ))}
                    </>
                ),
                Some: (result) =>
                    errorMessage ? (
                        <p className="col-span-4">{errorMessage}</p>
                    ) : result ? (
                        (
                            [
                                {
                                    content: (
                                        <>
                                            <div className="mr-2 flex items-center">
                                                <TokenAvatar
                                                    size={GRK_SIZES.EXTRA_SMALL}
                                                    primary_url={
                                                        result.logo_url
                                                    }
                                                />
                                            </div>

                                            {result.contract_ticker_symbol}
                                        </>
                                    ),
                                },
                                {
                                    heading: "NAME",
                                    content: result.contract_name,
                                },
                                {
                                    heading: "ADDRESS",
                                    content: (
                                        <Address
                                            address={token_address}
                                            actionable_address={
                                                actionable_address
                                            }
                                        />
                                    ),
                                },
                                {
                                    heading: "TOTAL LIQUIDITY",
                                    content:
                                        result.pretty_total_liquidity_quote,
                                },
                                {
                                    heading: "VOLUME (24 HOURS)",
                                    content:
                                        result.pretty_total_volume_24h_quote,
                                },
                                {
                                    heading: "TRANSACTIONS",
                                    content:
                                        result.transactions_24h.toLocaleString(),
                                },
                            ] as CardDetailProps[]
                        ).map((props) => (
                            <CardDetail
                                key={props.heading?.toString()}
                                {...props}
                            />
                        ))
                    ) : (
                        <></>
                    ),
            })}
        </Card>
    );
};
