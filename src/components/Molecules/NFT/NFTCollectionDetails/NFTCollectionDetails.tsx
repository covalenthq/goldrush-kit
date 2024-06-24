import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
} from "@/utils/constants/shared.constants";
import { type Option, Some, None } from "@/utils/option";
import type {
    MarketFloorPriceItem,
    MarketVolumeItem,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGoldRush } from "@/utils/store";
import { type NFTCollectionDetailsProps } from "@/utils/types/molecules.types";
import { CardDetail } from "@/components/Shared";
import {
    type CardDetailProps,
    type CovalentAPIError,
} from "@/utils/types/shared.types";

export const NFTCollectionDetails: React.FC<NFTCollectionDetailsProps> = ({
    chain_name,
    collection_address,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] = useState<
        Option<{
            volume: MarketVolumeItem[];
            floor: MarketFloorPriceItem[];
        } | null>
    >(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const [
                    { data: volumeData, ...volumeError },
                    { data: floorData, ...floorError },
                ] = await Promise.all([
                    covalentClient.NftService.getNftMarketVolume(
                        chain_name,
                        collection_address
                    ),
                    covalentClient.NftService.getNftMarketFloorPrice(
                        chain_name,
                        collection_address
                    ),
                ]);

                if (volumeError.error) {
                    throw volumeError;
                }
                if (floorError.error) {
                    throw floorError;
                }

                setMaybeResult(
                    new Some({
                        floor: floorData.items,
                        volume: volumeData.items,
                    })
                );
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, collection_address]);

    return (
        <Card className="grid w-full grid-cols-1 items-start gap-4 break-all border p-2 md:grid-cols-2">
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
                        <p className="col-span-3">{errorMessage}</p>
                    ) : (
                        (
                            [
                                {
                                    heading: "MARKET VOLUME",
                                    content:
                                        result?.volume[
                                            result?.volume.length - 1
                                        ].pretty_volume_quote,
                                },
                                {
                                    heading: "FLOOR PRICE",
                                    content:
                                        result?.floor[result?.floor.length - 1]
                                            .pretty_floor_price_quote,
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
