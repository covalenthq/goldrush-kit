import { Timestamp } from "@/components/Atoms";
import { CardDetail } from "@/components/Shared";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { actionableWrapper, timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type LatestBlocksProps } from "@/utils/types/molecules.types";
import type { GoldRushResponse, Block } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const LatestBlocks: React.FC<LatestBlocksProps> = ({
    chain_name,
    actionable_block = () => null,
}) => {
    const { goldrushClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setMaybeResult] =
        useState<Option<Block[] | null>>(None);

    useEffect(() => {
        (async () => {
            try {
                setMaybeResult(None);
                setErrorMessage(null);
                const { data, ...error } =
                    await goldrushClient.BaseService.getBlockHeightsByPage(
                        chain_name,
                        timestampParser(new Date(), "YYYY MM DD"),
                        "2100-01-01",
                        {
                            pageSize: 5,
                        },
                    );
                if (error.error) {
                    throw error;
                }
                if (!data?.items) {
                    throw FALLBACK_ERROR;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: GoldRushResponse<null> | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name]);

    return (
        <Card className="flex w-full flex-col px-4">
            {maybeResult.match({
                None: () =>
                    new Array(5).fill(null).map(() => (
                        <div
                            key={Math.random()}
                            className="grid grid-cols-2 border-b border-secondary-light py-4 last:border-b-0 dark:border-secondary-dark"
                        >
                            {Array(2)
                                .fill(null)
                                .map(() => (
                                    <Skeleton
                                        key={Math.random()}
                                        size={GRK_SIZES.LARGE}
                                    />
                                ))}
                        </div>
                    )),
                Some: (blocks) =>
                    errorMessage ? (
                        <p className="col-span-5">{errorMessage}</p>
                    ) : blocks ? (
                        blocks.map((block) => (
                            <div
                                key={block.height}
                                className="grid grid-cols-2 items-center border-b border-secondary-light py-4 last:border-b-0 dark:border-secondary-dark"
                            >
                                <CardDetail
                                    heading={
                                        <Timestamp
                                            timestamp={block.signed_at}
                                            defaultType="relative"
                                        />
                                    }
                                    content={actionableWrapper(
                                        actionable_block(block.height),
                                        <p className="text-base">
                                            {block.height?.toLocaleString()}
                                        </p>,
                                    )}
                                    wrapperClassName="flex flex-col-reverse"
                                />

                                <CardDetail
                                    heading={"GAS USED"}
                                    content={`${(
                                        (Number(block.gas_used) /
                                            Number(block.gas_limit)) *
                                        100
                                    ).toFixed(2)}%`}
                                    subtext={`of ${block.gas_limit?.toLocaleString()}`}
                                />
                            </div>
                        ))
                    ) : (
                        <></>
                    ),
            })}
        </Card>
    );
};
