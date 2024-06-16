import { type Option, None, Some } from "@/utils/option";
import { type ChainActivityEvent } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CardDetail } from "@/components/Shared";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
} from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type AddressActivityDetailsProps } from "@/utils/types/molecules.types";
import { Card } from "@/components/ui/card";
import {
    type CovalentAPIError,
    type CardDetailProps,
} from "@/utils/types/shared.types";

export const AddressActivityDetails: React.FC<AddressActivityDetailsProps> = ({
    address,
    hide_no_activity = false,
    maybeResult: initialMaybeResult = null,
    errorMessage: initialErrorMessage = null,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<ChainActivityEvent[] | null>>(None);
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
                        await covalentClient.BaseService.getAddressActivity(
                            address.trim(),
                            {
                                testnets: true,
                            }
                        );
                    if (error.error) {
                        throw error;
                    }
                    setMaybeResult(new Some(data.items));
                } catch (error: CovalentAPIError | any) {
                    setErrorMessage(
                        error?.error_message ?? DEFAULT_ERROR_MESSAGE
                    );
                    setMaybeResult(new Some(null));
                    console.error(error);
                }
            }
        })();
    }, [address, initialMaybeResult]);

    return (
        <Card className="grid w-full items-start gap-4 break-all border p-2">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(4)
                            .fill(null)
                            .map(() => (
                                <div key={Math.random()}>
                                    <Skeleton size={GRK_SIZES.LARGE} />
                                </div>
                            ))}
                    </>
                ),
                Some: (activity) => {
                    if (errorMessage) {
                        return <p className="col-span-4">{errorMessage}</p>;
                    }

                    const testnets: ChainActivityEvent[] = [];
                    const mainnets: ChainActivityEvent[] = [];
                    const appchains: ChainActivityEvent[] = [];
                    const appchain_testnets: ChainActivityEvent[] = [];
                    activity?.forEach((chain) => {
                        if (chain.is_appchain && chain.is_testnet) {
                            appchain_testnets.push();
                        } else if (!chain.is_appchain && chain.is_testnet) {
                            testnets.push(chain);
                        } else if (chain.is_appchain && !chain.is_testnet) {
                            appchains.push(chain);
                        } else {
                            mainnets.push(chain);
                        }
                    });

                    return (
                        [
                            hide_no_activity && !mainnets.length
                                ? null
                                : {
                                      heading: "MAINNETS",
                                      content: mainnets.length,
                                  },
                            hide_no_activity && !testnets.length
                                ? null
                                : {
                                      heading: "TESTNETS",
                                      content: testnets.length,
                                  },
                            hide_no_activity && !appchains.length
                                ? null
                                : {
                                      heading: "APPCHAINS",
                                      content: appchains.length,
                                  },
                            hide_no_activity && !appchain_testnets.length
                                ? null
                                : {
                                      heading: "APPCHAIN TESTNETS",
                                      content: appchain_testnets.length,
                                  },
                        ].filter(Boolean) as CardDetailProps[]
                    ).map((props) => (
                        <CardDetail
                            key={props.heading?.toString()}
                            {...props}
                        />
                    ));
                },
            })}
        </Card>
    );
};
