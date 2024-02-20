import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type BlockDetailsProps } from "@/utils/types/molecules.types";
import { type Block } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const BlockDetails: React.FC<BlockDetailsProps> = ({
    chain_name,
    height,
}) => {
    const { covalentClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setResult] = useState<Option<Block>>(None);

    useEffect(() => {
        (async () => {
            setResult(None);
            try {
                const { data, ...error } =
                    await covalentClient.BaseService.getBlock(
                        chain_name,
                        height.toString()
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setResult(new Some(data.items[0]));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [chain_name, height]);

    return (
        <>
            <Card className="flex w-full flex-col items-start gap-x-4 rounded border p-2 dark:bg-background-dark dark:text-white md:max-w-[20rem] lg:max-w-[20rem]">
                <CardTitle className="">Overview</CardTitle>
                {maybeResult.match({
                    None: () => (
                        <div className="mt-4">
                            <Skeleton size={GRK_SIZES.LARGE} />
                        </div>
                    ),
                    Some: ({ height, signed_at }) =>
                        errorMessage ? (
                            <p className="mt-4">{errorMessage}</p>
                        ) : (
                            <div className="mt-2 flex flex-col gap-y-2">
                                <div>
                                    <CardDescription>HEIGHT</CardDescription>

                                    <p className="mt-1 flex items-center gap-x-1.5">
                                        {height.toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <CardDescription>SIGNED AT</CardDescription>

                                    <div className="flex items-center gap-x-2">
                                        <p>
                                            {timestampParser(
                                                signed_at,
                                                "relative"
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ),
                })}
            </Card>
        </>
    );
};
