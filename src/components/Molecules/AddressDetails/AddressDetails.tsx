import { Address, TokenAvatar } from "@/components/Atoms";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type AddressDetailsProps } from "@/utils/types/molecules.types";
import {
    type TransactionsSummary,
    type BalanceItem,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { CardDetail } from "@/components/Shared";
import { CardDetailProps } from "@/utils/types/shared.types";

export const AddressDetails: React.FC<AddressDetailsProps> = ({
    address,
    chain_name,
}) => {
    const { covalentClient, selectedChain } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setMaybeResult] = useState<
        Option<{
            balances: BalanceItem[];
            summary: TransactionsSummary;
        }>
    >(None);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);

            try {
                const [
                    { data: summaryData, ...summaryError },
                    { data: balancesData, ...balancesError },
                ] = await Promise.all([
                    covalentClient.TransactionService.getTransactionSummary(
                        chain_name,
                        address.trim()
                    ),
                    covalentClient.BalanceService.getTokenBalancesForWalletAddress(
                        chain_name,
                        address.trim()
                    ),
                ]);
                if (summaryError.error) {
                    setErrorMessage(summaryError.error_message);
                    throw summaryError;
                }
                if (balancesError.error) {
                    setErrorMessage(balancesError.error_message);
                    throw balancesError;
                }
                const balances = balancesData.items;
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
            } catch (error) {
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
                Some: ({
                    balances: [native, ...holdings],
                    summary: {
                        earliest_transaction,
                        latest_transaction,
                        total_count,
                    },
                }) =>
                    errorMessage ? (
                        <p className="col-span-3">{errorMessage}</p>
                    ) : (
                        (
                            [
                                {
                                    heading: `${native.contract_ticker_symbol} BALANCE`,
                                    content: (
                                        <>
                                            <TokenAvatar
                                                size={
                                                    GRK_SIZES.EXTRA_EXTRA_SMALL
                                                }
                                                token_url={
                                                    native.logo_urls
                                                        .chain_logo_url
                                                }
                                                chain_color={
                                                    selectedChain?.color_theme
                                                        .hex
                                                }
                                                is_chain_logo
                                            />
                                            {calculatePrettyBalance(
                                                native.balance ?? 0,
                                                native.contract_decimals,
                                                false,
                                                native.contract_decimals
                                            )}{" "}
                                            {native.contract_ticker_symbol}
                                        </>
                                    ),
                                },
                                {
                                    heading: `${native.contract_ticker_symbol} VALUE`,
                                    content: prettifyCurrency(
                                        (Number(native.balance) /
                                            Math.pow(
                                                10,
                                                native.contract_decimals
                                            )) *
                                            native.quote_rate
                                    ),
                                    subtext: `@${prettifyCurrency(
                                        native.quote_rate
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
                                                                    token_url={
                                                                        logo_urls.token_logo_url
                                                                    }
                                                                    chain_color={
                                                                        selectedChain
                                                                            ?.color_theme
                                                                            .hex
                                                                    }
                                                                />
                                                            </div>

                                                            <CardDetail
                                                                heading={`${contract_display_name} (
                                                                    ${contract_ticker_symbol})`}
                                                                content={
                                                                    balance ? (
                                                                        <>
                                                                            {calculatePrettyBalance(
                                                                                balance,
                                                                                contract_decimals,
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
                                            address={latest_transaction.tx_hash}
                                        />
                                    ),
                                    subtext: timestampParser(
                                        latest_transaction.block_signed_at,
                                        "relative"
                                    ),
                                },
                                {
                                    heading: "EARLIEST TRANSACTION",
                                    content: (
                                        <Address
                                            address={
                                                earliest_transaction.tx_hash
                                            }
                                        />
                                    ),
                                    subtext: timestampParser(
                                        earliest_transaction.block_signed_at,
                                        "relative"
                                    ),
                                },
                                {
                                    heading: "TOTAL COUNT",
                                    content: `${total_count.toLocaleString()} transactions`,
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
