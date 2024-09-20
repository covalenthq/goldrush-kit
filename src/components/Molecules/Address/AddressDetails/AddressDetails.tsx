import { Address, TokenAvatar } from "@/components/Atoms";
import { Timestamp } from "@/components/Atoms";
import { CardDetail } from "@/components/Shared";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
} from "@/utils/constants/shared.constants";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type AddressDetailsProps } from "@/utils/types/molecules.types";
import { type CardDetailProps } from "@/utils/types/shared.types";
import type {
    TransactionsSummary,
    BalanceItem,
    GoldRushResponse,
} from "@covalenthq/client-sdk";
import {
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

export const AddressDetails: React.FC<AddressDetailsProps> = ({
    address,
    chain_name,
    actionable_transaction,
}) => {
    const { goldrushClient, selectedChain } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setMaybeResult] = useState<
        Option<{
            balances: BalanceItem[];
            summary: TransactionsSummary;
        } | null>
    >(None);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const [
                    { data: summaryData, ...summaryError },
                    { data: balancesData, ...balancesError },
                ] = await Promise.all([
                    goldrushClient.TransactionService.getTransactionSummary(
                        chain_name,
                        address.trim()
                    ),
                    goldrushClient.BalanceService.getTokenBalancesForWalletAddress(
                        chain_name,
                        address.trim()
                    ),
                ]);
                if (summaryError.error) {
                    throw summaryError;
                }
                if (balancesError.error) {
                    throw balancesError;
                }
                const balances = balancesData!.items;
                const nativeTokenIndex = balances.findIndex(
                    (token) => token.native_token
                );
                const nativeToken: BalanceItem = balances.splice(
                    nativeTokenIndex,
                    1
                )[0];
                setMaybeResult(
                    new Some({
                        balances: [nativeToken, ...balances],
                        summary: summaryData.items[0],
                    })
                );
            } catch (error: GoldRushResponse<null> | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [address, chain_name]);

    return (
        <Card className="grid w-full grid-cols-1 items-start gap-4 break-all border p-2 md:grid-cols-3">
            {maybeResult.match({
                None: () => (
                    <>
                        {Array(6)
                            .fill(null)
                            .map(() => (
                                <div key={Math.random()}>
                                    <Skeleton size={GRK_SIZES.LARGE} />
                                </div>
                            ))}
                    </>
                ),
                Some: (data) => {
                    if (errorMessage) {
                        return <p className="col-span-3">{errorMessage}</p>;
                    } else {
                        const {
                            balances: [native, ...holdings],
                            summary: {
                                earliest_transaction,
                                latest_transaction,
                                total_count,
                            },
                        } = data!;

                        return (
                            [
                                {
                                    heading: `${native.contract_ticker_symbol} BALANCE`,
                                    content: (
                                        <>
                                            <TokenAvatar
                                                size={
                                                    GRK_SIZES.EXTRA_EXTRA_SMALL
                                                }
                                                primary_url={
                                                    native.logo_urls
                                                        ?.chain_logo_url
                                                }
                                                chain_color={
                                                    selectedChain?.color_theme
                                                        ?.hex
                                                }
                                                only_primary
                                            />
                                            {calculatePrettyBalance(
                                                native.balance ?? 0,
                                                native.contract_decimals || 0,
                                                false,
                                                native.contract_decimals || 0
                                            )}{" "}
                                            {native.contract_ticker_symbol}
                                        </>
                                    ),
                                },
                                {
                                    heading: `${native.contract_ticker_symbol} VALUE`,
                                    content: prettifyCurrency(
                                        calculatePrettyBalance(
                                            Number(native.balance) *
                                                native.quote_rate,
                                            native.contract_decimals
                                        )
                                    ),
                                    subtext: `@${prettifyCurrency(
                                        native.quote_rate || 0
                                    )}/${native.contract_ticker_symbol}`,
                                },
                                {
                                    content: (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                asChild
                                                className="mt-2 w-full"
                                            >
                                                <p className="flex w-full cursor-pointer items-center justify-between rounded border border-secondary-light px-4 py-2 text-sm text-secondary-light dark:border-secondary-dark dark:text-secondary-dark">
                                                    Token Holdings (
                                                    {holdings.length} tokens)
                                                    <CaretDownIcon />
                                                </p>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                className="z-10 mx-auto max-h-96 w-full overflow-y-scroll rounded border border-secondary-light bg-white dark:border-secondary-dark dark:bg-background-dark dark:text-white"
                                                align="start"
                                            >
                                                {holdings.map(
                                                    ({
                                                        balance,
                                                        contract_address,
                                                        contract_decimals,
                                                        contract_display_name,
                                                        contract_ticker_symbol,
                                                        logo_urls,
                                                    }) => (
                                                        <DropdownMenuItem
                                                            key={
                                                                contract_address
                                                            }
                                                            className="mt-1 flex w-full items-center gap-x-4 border-t border-secondary-light px-2 py-1 first:border-t-0 dark:border-secondary-dark"
                                                        >
                                                            <div>
                                                                <TokenAvatar
                                                                    size={
                                                                        GRK_SIZES.EXTRA_EXTRA_SMALL
                                                                    }
                                                                    primary_url={
                                                                        logo_urls?.token_logo_url
                                                                    }
                                                                    chain_color={
                                                                        selectedChain
                                                                            ?.color_theme
                                                                            ?.hex
                                                                    }
                                                                />
                                                            </div>

                                                            <CardDetail
                                                                key={`${contract_display_name} (
                                                                    ${contract_ticker_symbol})`}
                                                                heading={`${contract_display_name} (
                                                                    ${contract_ticker_symbol})`}
                                                                content={
                                                                    balance ? (
                                                                        <>
                                                                            {calculatePrettyBalance(
                                                                                balance,
                                                                                contract_decimals ||
                                                                                    0,
                                                                                true
                                                                            )}{" "}
                                                                            {
                                                                                contract_ticker_symbol
                                                                            }
                                                                        </>
                                                                    ) : null
                                                                }
                                                            />
                                                        </DropdownMenuItem>
                                                    )
                                                )}
                                                <DropdownMenuSeparator />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ),
                                },
                                {
                                    heading: "LATEST TRANSACTION",
                                    content: (
                                        <Address
                                            address={
                                                latest_transaction?.tx_hash ||
                                                null
                                            }
                                            actionable_address={
                                                actionable_transaction
                                            }
                                        />
                                    ),
                                    subtext: (
                                        <Timestamp
                                            timestamp={
                                                latest_transaction?.block_signed_at ||
                                                null
                                            }
                                        />
                                    ),
                                },
                                {
                                    heading: "EARLIEST TRANSACTION",
                                    content: (
                                        <Address
                                            address={
                                                earliest_transaction?.tx_hash ||
                                                null
                                            }
                                            actionable_address={
                                                actionable_transaction
                                            }
                                        />
                                    ),
                                    subtext: (
                                        <Timestamp
                                            timestamp={
                                                earliest_transaction?.block_signed_at ||
                                                null
                                            }
                                        />
                                    ),
                                },
                                {
                                    heading: "TOTAL COUNT",
                                    content: `${total_count?.toLocaleString()} transactions`,
                                },
                            ] as CardDetailProps[]
                        ).map((props) => (
                            <CardDetail
                                key={props.heading?.toString()}
                                {...props}
                            />
                        ));
                    }
                },
            })}
        </Card>
    );
};
