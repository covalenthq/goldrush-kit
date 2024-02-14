import { Address } from "@/components/Atoms/Address/Address";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useCovalent } from "@/utils/store/Covalent";
import { type AddressDetailsProps } from "@/utils/types/molecules.types";
import {
    type TransactionsSummary,
    type ChainItem,
    type BalanceItem,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { useEffect, useMemo, useState } from "react";
import { AccountCard } from "../AccountCard/AccountCard";
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

export const AddressDetails: React.FC<AddressDetailsProps> = ({
    address,
    chain_name,
}) => {
    const { covalentClient, chains } = useCovalent();

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
                    `Error fetching transactions summary for ${chain_name}:`,
                    error
                );
            }
        })();
    }, [address, chain_name]);

    const CHAIN = useMemo<ChainItem | null>(() => {
        return chains?.find((o) => o.name === chain_name) ?? null;
    }, [chains, chain_name]);

    return (
        <Card className="flex w-[64rem] flex-col gap-y-8 rounded border p-4">
            <div>
                <AccountCard address={address} />
            </div>

            {maybeResult.match({
                None: () => (
                    <div className="grid items-start gap-4 text-sm lg:grid-cols-3">
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
                    <div className="grid grid-cols-3 items-start gap-4 text-sm">
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
                                            chain_color={CHAIN?.color_theme.hex}
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
                                        borderColor: CHAIN?.color_theme.hex,
                                    }}
                                >
                                    <CardDescription className="flex w-full items-center justify-between">
                                        <span className="flex items-center gap-x-2">
                                            <span>TOKEN HOLDINGS</span>
                                            <span>
                                                ({holdings.length} tokens)
                                            </span>
                                        </span>
                                        <CaretDownIcon />
                                    </CardDescription>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="z-10 mx-auto w-72 rounded border bg-white"
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
                                                        CHAIN?.color_theme.hex
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
