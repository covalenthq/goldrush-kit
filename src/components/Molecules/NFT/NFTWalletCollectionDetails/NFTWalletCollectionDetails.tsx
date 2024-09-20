import { CardDetail } from "@/components/Shared";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type NFTWalletCollectionDetailsProps } from "@/utils/types/molecules.types";
import { type CardDetailProps } from "@/utils/types/shared.types";
import {
    prettifyCurrency,
    type NftTokenContractBalanceItem,
    type GoldRushResponse,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const NFTWalletCollectionDetails: React.FC<
    NFTWalletCollectionDetailsProps
> = ({
    chain_name,
    address,
    maybeResult: initialMaybeResult = null,
    errorMessage: initialErrorMessage = null,
}) => {
    const { goldrushClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<NftTokenContractBalanceItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        initialErrorMessage,
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
                        await goldrushClient.NftService.getNftsForAddress(
                            chain_name,
                            address,
                        );
                    if (error.error) {
                        throw error;
                    }
                    if (!data?.items) {
                        throw FALLBACK_ERROR;
                    }
                    setMaybeResult(new Some(data.items));
                } catch (error: GoldRushResponse<null> | any) {
                    setErrorMessage(
                        error?.error_message ?? DEFAULT_ERROR_MESSAGE,
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
                                                    floor_price_quote || 0),
                                        );
                                        return prettifyCurrency(
                                            totalFloorPriceQuote,
                                            2,
                                            "USD",
                                            true,
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
