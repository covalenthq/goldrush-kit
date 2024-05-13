import { Address } from "@/components/Atoms";
import { CardDetail } from "@/components/Shared";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type LatestBlocksProps } from "@/utils/types/molecules.types";
import { type CardDetailProps } from "@/utils/types/shared.types";
import { type Block } from "@covalenthq/client-sdk";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export const LatestBlocks: React.FC<LatestBlocksProps> = ({
    chain_name,
    limit = 5,
    on_view_details,
}) => {
    const { covalentClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setResult] = useState<Option<Block[]>>(None);

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.BaseService.getBlockHeightsByPage(
                        chain_name,
                        timestampParser(new Date(), "YYYY MM DD"),
                        "2100-01-01",
                        {
                            pageSize: limit,
                        }
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
    }, [chain_name, limit]);

    return maybeResult.match({
        None: () => (
            <>
                {new Array(limit).fill(null).map(() => (
                    <Skeleton key={Math.random()} size={GRK_SIZES.LARGE} />
                ))}
            </>
        ),
        Some: (blocks) =>
            errorMessage ? (
                <p className="col-span-5">{errorMessage}</p>
            ) : (
                blocks.map((block) => (
                    <Card
                        key={block.height}
                        className="flex w-full flex-col rounded border border-secondary-light p-2 dark:border-secondary-dark dark:bg-background-dark dark:text-white"
                    >
                        {(
                            [
                                {
                                    heading: "BLOCK HEIGHT",
                                    content: block.height.toLocaleString(),
                                },
                                {
                                    heading: "SIGNED AT",
                                    content: timestampParser(
                                        block.signed_at,
                                        "relative"
                                    ),
                                },
                                {
                                    heading: "BLOCK HASH",
                                    content: (
                                        <Address
                                            address={block.block_hash}
                                            show_copy_icon={false}
                                        />
                                    ),
                                },
                                {
                                    heading: "GAS USED",
                                    content: `${(
                                        (block.gas_used / block.gas_limit) *
                                        100
                                    ).toFixed(2)}%`,
                                },
                                {
                                    heading: "GAS LIMIT",
                                    content: block.gas_limit.toLocaleString(),
                                },
                            ] as CardDetailProps[]
                        ).map((props) => (
                            <CardDetail
                                key={props.heading?.toString()}
                                wrapperClassName="flex justify-between"
                                {...props}
                            />
                        ))}

                        {on_view_details ? (
                            <Button
                                variant="ghost"
                                className="mx-auto mb-2 mt-4 flex items-center justify-center gap-x-2 text-sm"
                                onClick={() => on_view_details(block)}
                            >
                                View Block Details
                                <ExternalLinkIcon />
                            </Button>
                        ) : (
                            <></>
                        )}
                    </Card>
                ))
            ),
    });
};
