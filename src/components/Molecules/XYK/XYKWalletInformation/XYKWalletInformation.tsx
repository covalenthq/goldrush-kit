import { useEffect } from "react";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import {
    prettifyCurrency,
    type ExchangeTransaction,
} from "@covalenthq/client-sdk";
import { useState } from "react";
import { CardDetail } from "@/components/Shared";
import { type XYKWalletInformationProps } from "@/utils/types/molecules.types";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { Card } from "@/components/ui/card";
import { CardDetailProps } from "@/utils/types/shared.types";

export const XYKWalletInformation: React.FC<XYKWalletInformationProps> = ({
    chain_name,
    dex_name,
    wallet_address,
    wallet_data,
}) => {
    const [maybeResult, setResult] =
        useState<Option<ExchangeTransaction[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { covalentClient } = useGoldRush();

    useEffect(() => {
        (async () => {
            if (wallet_data) {
                setResult(new Some(wallet_data));
                return;
            }

            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getTransactionsForAccountAddress(
                        chain_name,
                        dex_name,
                        wallet_address
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setResult(new Some(data.items));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [chain_name, dex_name, wallet_address, wallet_data]);

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
                    ) : (
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
                    ),
            })}
        </Card>
    );
};
