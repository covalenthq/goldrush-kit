import { Address } from "@/components/Atoms";
import { CardDetail } from "@/components/Shared";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { type Option, None, Some } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TransactionRawLogsProps } from "@/utils/types/molecules.types";
import { type CardDetailProps } from "@/utils/types/shared.types";
import {
    type Transaction,
    type GoldRushResponse,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const TransactionRawLogs: React.FC<TransactionRawLogsProps> = ({
    chain_name,
    tx_hash,
    actionable_address,
}) => {
    const { goldrushClient } = useGoldRush();

    const [maybeResult, setMaybeResult] =
        useState<Option<Transaction | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await goldrushClient.TransactionService.getTransaction(
                        chain_name,
                        tx_hash,
                        {
                            noLogs: false,
                            quoteCurrency: "USD",
                            withSafe: false,
                        },
                    );
                if (error.error) {
                    throw error;
                }
                if (!data?.items?.[0]) {
                    throw FALLBACK_ERROR;
                }
                setMaybeResult(new Some(data.items?.[0]));
            } catch (error: GoldRushResponse<null> | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, tx_hash]);

    return (
        <Card className="overflow-hidden">
            <main className="flex h-full w-full flex-col gap-y-4 p-4">
                {maybeResult.match({
                    None: () => (
                        <>
                            {Array(5)
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
                        ) : (
                            result?.log_events?.map(
                                ({
                                    decoded,
                                    raw_log_data,
                                    raw_log_topics,
                                    log_offset,
                                    sender_address,
                                    sender_name,
                                    sender_address_label,
                                }) => (
                                    <div
                                        key={log_offset}
                                        className="flex gap-8 border-b border-secondary-light py-4 last:border-b-0 dark:border-secondary-dark first:pt-0 last:pb-0"
                                    >
                                        <div className="pt-1">
                                            <Badge>
                                                {log_offset?.toLocaleString()}
                                            </Badge>
                                        </div>

                                        <div>
                                            <Address
                                                address={sender_address}
                                                label={
                                                    sender_name ||
                                                    sender_address_label
                                                }
                                                avatar={{
                                                    size: GRK_SIZES.EXTRA_SMALL,
                                                }}
                                                actionable_address={
                                                    actionable_address
                                                }
                                            />

                                            <div className="mt-4 flex flex-col gap-4">
                                                {(
                                                    [
                                                        {
                                                            heading: (
                                                                <p className="w-10">
                                                                    Name
                                                                </p>
                                                            ),
                                                            content:
                                                                decoded?.signature,
                                                        },
                                                        {
                                                            heading: (
                                                                <p className="w-10">
                                                                    Topics
                                                                </p>
                                                            ),
                                                            content: (
                                                                <div className="flex flex-col gap-3">
                                                                    {raw_log_topics?.map(
                                                                        (
                                                                            topic,
                                                                            i,
                                                                        ) => (
                                                                            <p
                                                                                key={
                                                                                    topic
                                                                                }
                                                                                className="flex items-center gap-2"
                                                                            >
                                                                                <Badge
                                                                                    variant="outline"
                                                                                    className="dark:text-secondary-dark"
                                                                                >
                                                                                    {
                                                                                        i
                                                                                    }{" "}
                                                                                    {i >
                                                                                    0
                                                                                        ? decoded
                                                                                              ?.params?.[
                                                                                              i -
                                                                                                  1
                                                                                          ]
                                                                                              ?.indexed && (
                                                                                              <span>
                                                                                                  :{" "}
                                                                                                  {
                                                                                                      decoded
                                                                                                          ?.params?.[
                                                                                                          i -
                                                                                                              1
                                                                                                      ]
                                                                                                          ?.name
                                                                                                  }
                                                                                              </span>
                                                                                          )
                                                                                        : null}
                                                                                </Badge>

                                                                                <Address
                                                                                    address={
                                                                                        topic
                                                                                    }
                                                                                />
                                                                            </p>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            ),
                                                        },
                                                        {
                                                            heading: (
                                                                <p className="w-10">
                                                                    Data
                                                                </p>
                                                            ),
                                                            content: (
                                                                <div>
                                                                    <Address
                                                                        address={
                                                                            raw_log_data
                                                                        }
                                                                        actionable_address={
                                                                            actionable_address
                                                                        }
                                                                    />

                                                                    {raw_log_data ? (
                                                                        <div className="mt-2">
                                                                            {decoded?.params.map(
                                                                                (
                                                                                    {
                                                                                        indexed,
                                                                                        name,
                                                                                        type,
                                                                                        value,
                                                                                    },
                                                                                    i,
                                                                                ) =>
                                                                                    indexed ? null : (
                                                                                        <p
                                                                                            key={
                                                                                                name +
                                                                                                value +
                                                                                                i
                                                                                            }
                                                                                            className="flex gap-1"
                                                                                        >
                                                                                            <span className="text-secondary-light dark:text-secondary-dark">
                                                                                                {
                                                                                                    name
                                                                                                }{" "}
                                                                                                (
                                                                                                {
                                                                                                    type
                                                                                                }
                                                                                                ):
                                                                                            </span>

                                                                                            {type ===
                                                                                            "address" ? (
                                                                                                <Address
                                                                                                    address={
                                                                                                        value
                                                                                                    }
                                                                                                />
                                                                                            ) : (
                                                                                                value
                                                                                            )}
                                                                                        </p>
                                                                                    ),
                                                                            )}
                                                                        </div>
                                                                    ) : null}
                                                                </div>
                                                            ),
                                                        },
                                                    ] as CardDetailProps[]
                                                ).map((props) => (
                                                    <CardDetail
                                                        key={
                                                            props.heading?.toString() ||
                                                            Math.random().toString()
                                                        }
                                                        wrapperClassName="flex gap-4"
                                                        {...props}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ),
                            )
                        ),
                })}
            </main>
        </Card>
    );
};
