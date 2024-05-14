import { type Option, Some, None } from "@/utils/option";
import {
    prettifyCurrency,
    type NftTokenContractBalanceItem,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { CardDetail } from "@/components/Shared";
import { type NFTWalletCollectionDetailsProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import {
    type CardDetailProps,
    type CovalentAPIError,
} from "@/utils/types/shared.types";
import {
    GRK_SIZES,
    defaultErrorMessage,
} from "@/utils/constants/shared.constants";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const NFTWalletCollectionDetails: React.FC<
    NFTWalletCollectionDetailsProps
> = ({
    chain_name,
    address,
    maybeResult: initialMaybeResult = null,
    errorMessage: initialErrorMessage = null,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<NftTokenContractBalanceItem[] | null>>(None);
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
                setMaybeResult(None);
                setErrorMessage(null);
                try {
                    const { data, ...error } =
                        await covalentClient.NftService.getNftsForAddress(
                            chain_name,
                            address
                        );
                    if (error.error) {
                        throw error;
                    }
                    setMaybeResult(new Some(data.items));
                } catch (error: CovalentAPIError | any) {
                    setErrorMessage(
                        error?.error_message ?? defaultErrorMessage
                    );
                    setMaybeResult(new Some(null));
                    console.error(error);
                }
            }
        })();
    }, [chain_name, address, initialMaybeResult]);

    return (
        <Card className="grid w-full grid-cols-1 items-start gap-4 break-all border p-2">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(1)
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
                        <p>{errorMessage}</p>
                    ) : result ? (
                        (
                            [
                                {
                                    heading: "TOTAL QUOTE",
                                    content: (() => {
                                        let totalFloorPriceQuote: number = 0;
                                        result.forEach(
                                            ({ floor_price_quote }) =>
                                                (totalFloorPriceQuote +=
                                                    floor_price_quote)
                                        );
                                        return prettifyCurrency(
                                            totalFloorPriceQuote,
                                            2,
                                            "USD",
                                            true
                                        );
                                    })(),
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
