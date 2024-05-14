import { useEffect } from "react";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import {
    prettifyCurrency,
    type ExchangeTransaction,
} from "@covalenthq/client-sdk";
import { useState } from "react";
import { CardDetail } from "@/components/Shared";
import { type XYKWalletDetailsProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    defaultErrorMessage,
} from "@/utils/constants/shared.constants";
import { Card } from "@/components/ui/card";
import {
    type CovalentAPIError,
    type CardDetailProps,
} from "@/utils/types/shared.types";

export const XYKWalletDetails: React.FC<XYKWalletDetailsProps> = ({
    chain_name,
    dex_name,
    wallet_address,
}) => {
    const [maybeResult, setMaybeResult] =
        useState<Option<ExchangeTransaction[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            try {
                setMaybeResult(None);
                setErrorMessage(null);
                const { data, ...error } =
                    await covalentClient.XykService.getTransactionsForAccountAddress(
                        chain_name,
                        dex_name,
                        wallet_address
                    );
                if (error.error) {
                    throw error;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, dex_name, wallet_address]);

    return (
        <Card className="grid w-full grid-cols-1 items-center gap-4 break-all p-2 md:grid-cols-2">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(2)
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
                                    heading: "TOTAL VALUE SWAPPED",
                                    content: prettifyCurrency(
                                        result
                                            .filter((o) => o.act === "SWAP")
                                            .reduce((acc, obj) => {
                                                const valueQuote =
                                                    obj.total_quote;
                                                return acc + valueQuote;
                                            }, 0)
                                    ),
                                },
                                {
                                    heading: "TOTAL TRANSACTIONS",
                                    content: result.length.toLocaleString(),
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
