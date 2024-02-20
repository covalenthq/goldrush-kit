import { Address } from "@/components/Atoms/Address/Address";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type AddressDetailsProps } from "@/utils/types/molecules.types";
import {
    type TransactionsSummary,
    type Chain,
    type BalanceItem,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { AccountCard } from "@/components/Molecules/AccountCard/AccountCard";
import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { CaretDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { ChainSelector } from "@/components/Molecules/ChainSelector/ChainSelector";

export const AddressDetailsView: React.FC<AddressDetailsProps> = ({
    address,
    chain_name: initialChainName,
    show_chain_selector = true,
}) => {
    const { covalentClient, chains, setSelectedChain, selectedChain } =
        useGoldRush();

    const [maybeResult, setMaybeResult] = useState<
        Option<{
            balances: BalanceItem[];
            summary: TransactionsSummary;
        }>
    >(None);
    const [chainName, setChainName] = useState<Chain>(initialChainName);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);

            try {
                const [
                    { data: summaryData, ...summaryError },
                    { data: balancesData, ...balancesError },
                ] = await Promise.all([
                    covalentClient.TransactionService.getTransactionSummary(
                        chainName,
                        address.trim()
                    ),
                    covalentClient.BalanceService.getTokenBalancesForWalletAddress(
                        chainName,
                        address.trim()
                    ),
                ]);
                if (summaryError.error) {
                    throw summaryError;
                }
                if (balancesError.error) {
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
                console.error(
                    `Error fetching transactions summary for ${chainName}:`,
                    error
                );
            }
        })();
    }, [address, chainName]);

    useEffect(() => {
        const chain = chains?.find((o) => o.name === chainName) ?? null;
        setSelectedChain(chain);
    }, [chains, chainName]);

    return (
        <Card className="flex flex-col gap-y-4 rounded border p-4 dark:bg-background-dark dark:text-white">
            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                    <AccountCard address={address} />
                </div>

                {show_chain_selector && (
                    <ChainSelector
                        onChangeChain={({ name }) =>
                            setChainName(name as Chain)
                        }
                    />
                )}
            </div>

            {maybeResult.match({
                None: () => (
                    <div className="grid grid-cols-1 items-start gap-4 text-sm md:grid-cols-3">
                        <Skeleton size={GRK_SIZES.LARGE} />
                        <Skeleton size={GRK_SIZES.LARGE} />
                        <Skeleton size={GRK_SIZES.LARGE} />
                        <Skeleton size={GRK_SIZES.LARGE} />
                        <Skeleton size={GRK_SIZES.LARGE} />
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                ),
                Some: ({
                    balances: [native, ...holdings],
                    summary: {
                        earliest_transaction,
                        latest_transaction,
                        total_count,
                    },
                }) => (
                    <div className="grid grid-cols-1 items-start gap-4 text-sm md:grid-cols-3">
                        {native.balance ? (
                            <>
                                <div>
                                    <CardDescription>
                                        {native.contract_ticker_symbol} BALANCE
                                    </CardDescription>

                                    <div className="mt-1 flex items-center gap-x-1.5">
                                        <TokenAvatar
                                            size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                            token_url={
                                                native.logo_urls.chain_logo_url
                                            }
                                            chain_color={
                                                selectedChain?.color_theme.hex
                                            }
                                            is_chain_logo
                                        />
                                        {calculatePrettyBalance(
                                            native.balance,
                                            native.contract_decimals,
                                            false,
                                            native.contract_decimals
                                        )}{" "}
                                        {native.contract_ticker_symbol}
                                    </div>
                                </div>

                                <div>
                                    <CardDescription>
                                        {native.contract_ticker_symbol} VALUE
                                    </CardDescription>

                                    <div className="flex items-center gap-x-2">
                                        {prettifyCurrency(
                                            (Number(native.balance) /
                                                Math.pow(
                                                    10,
                                                    native.contract_decimals
                                                )) *
                                                native.quote_rate
                                        )}
                                        <CardDescription>
                                            @{" "}
                                            {prettifyCurrency(
                                                native.quote_rate
                                            )}
                                            /{native.contract_ticker_symbol}
                                        </CardDescription>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <></>
                        )}

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild className="mt-2 w-72">
                                <Button
                                    variant="outline"
                                    style={{
                                        borderColor:
                                            selectedChain?.color_theme.hex,
                                    }}
                                >
                                    <CardDescription className="flex w-full items-center justify-between">
                                        Token Holdings ({holdings.length}{" "}
                                        tokens)
                                        <CaretDownIcon />
                                    </CardDescription>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="z-10 mx-auto w-72 rounded border bg-white dark:bg-background-dark dark:text-white"
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
                                            key={contract_address}
                                            className="mt-1 flex items-center gap-x-2 border-t p-1 first:border-t-0"
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
                                                            ?.color_theme.hex
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <CardDescription className="flex text-xs">
                                                    {contract_display_name} (
                                                    {contract_ticker_symbol})
                                                </CardDescription>
                                                <CardContent className="text-sm">
                                                    {balance ? (
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
                                                    ) : (
                                                        <></>
                                                    )}
                                                </CardContent>
                                            </div>
                                        </DropdownMenuItem>
                                    )
                                )}
                                <DropdownMenuSeparator />
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div>
                            <CardDescription>
                                LATEST TRANSACTION
                            </CardDescription>

                            <div className="mt-1 flex items-center gap-x-1.5">
                                <Address address={latest_transaction.tx_hash} />
                                <CardDescription>
                                    {timestampParser(
                                        latest_transaction.block_signed_at,
                                        "relative"
                                    )}
                                </CardDescription>
                            </div>
                        </div>

                        <div>
                            <CardDescription>
                                EARLIEST TRANSACTION
                            </CardDescription>

                            <div className="flex items-center gap-x-2">
                                <Address
                                    address={earliest_transaction.tx_hash}
                                />
                                <CardDescription>
                                    {timestampParser(
                                        earliest_transaction.block_signed_at,
                                        "relative"
                                    )}
                                </CardDescription>
                            </div>
                        </div>

                        <div>
                            <CardDescription>TOTAL COUNT</CardDescription>

                            <p>{total_count.toLocaleString()} transactions</p>
                        </div>
                    </div>
                ),
            })}
        </Card>
    );
};
