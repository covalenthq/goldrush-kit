import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { None, Some, type Option } from "@/utils/option";
import { useCovalent } from "@/utils/store/Covalent";
import { type AccountOverviewProps } from "@/utils/types/molecules.types";
import {
    calculatePrettyBalance,
    type BalanceItem,
    type Chain,
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
import { useCallback, useEffect, useState } from "react";

export const AddressOverview: React.FC<AccountOverviewProps> = ({
    address,
    chain_names,
}) => {
    const { covalentClient, chains } = useCovalent();

    const [maybeResult, setResult] = useState<
        Option<
            {
                chain_name: Chain;
                balances: BalanceItem[];
                native: BalanceItem;
            }[]
        >
    >(None);

    useEffect(() => {
        (async () => {
            setResult(None);
            const results: {
                chain_name: Chain;
                balances: BalanceItem[];
                native: BalanceItem;
            }[] = [];
            await Promise.all(
                chain_names.map(async (chain_name) => {
                    let response;
                    try {
                        response =
                            await covalentClient.BalanceService.getTokenBalancesForWalletAddress(
                                chain_name,
                                address.trim()
                            );

                        const balances = response.data.items;

                        const nativeTokenIndex = balances.findIndex(
                            (token) => token.native_token
                        );
                        const nativeToken: BalanceItem = balances.splice(
                            nativeTokenIndex,
                            1
                        )[0];

                        results.push({
                            chain_name: chain_name,
                            balances: balances,
                            native: nativeToken,
                        });
                    } catch (error) {
                        console.error(
                            `Error fetching balances for ${chain_name}:`,
                            error
                        );
                    }
                })
            );
            console.log(results);
            setResult(new Some(results));
        })();
    }, [address, chain_names]);

    const handleChain = useCallback(
        (chain_name: Chain) => {
            return chains?.find((o) => o.name === chain_name) ?? null;
        },
        [chains]
    );

    return (
        <>
            <Card className="flex w-full flex-col items-start gap-x-4 rounded border p-2 md:max-w-[20rem] lg:max-w-[20rem]">
                <CardTitle className="">Overview</CardTitle>
                {maybeResult.match({
                    None: () => (
                        <div className="mt-4">
                            <Skeleton size={GRK_SIZES.LARGE} />
                        </div>
                    ),
                    Some: (chains) => (
                        <>
                            {chains.map(({ balances, chain_name, native }) => {
                                const chain = handleChain(chain_name);

                                return (
                                    <div key={chain_name} className="mt-4">
                                        {native.balance ? (
                                            <CardContent className="mt-2 flex flex-col gap-y-2">
                                                <div>
                                                    <CardDescription>
                                                        {
                                                            native.contract_ticker_symbol
                                                        }{" "}
                                                        BALANCE
                                                    </CardDescription>

                                                    <div className="mt-1 flex items-center gap-x-1.5">
                                                        <TokenAvatar
                                                            size={
                                                                GRK_SIZES.EXTRA_EXTRA_SMALL
                                                            }
                                                            token_url={
                                                                native.logo_urls
                                                                    .chain_logo_url
                                                            }
                                                            chain_color={
                                                                chain
                                                                    ?.color_theme
                                                                    .hex
                                                            }
                                                            is_chain_logo
                                                        />
                                                        {calculatePrettyBalance(
                                                            native.balance,
                                                            native.contract_decimals,
                                                            false,
                                                            native.contract_decimals
                                                        )}{" "}
                                                        {
                                                            native.contract_ticker_symbol
                                                        }
                                                    </div>
                                                </div>

                                                <div>
                                                    <CardDescription>
                                                        {
                                                            native.contract_ticker_symbol
                                                        }{" "}
                                                        VALUE
                                                    </CardDescription>

                                                    <div className="flex items-center gap-x-2">
                                                        {prettifyCurrency(
                                                            (Number(
                                                                native.balance
                                                            ) /
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
                                                            /
                                                            {
                                                                native.contract_ticker_symbol
                                                            }
                                                        </CardDescription>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        ) : (
                                            <></>
                                        )}

                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                asChild
                                                className="mx-auto mt-2 w-72"
                                            >
                                                <Button
                                                    variant="outline"
                                                    style={{
                                                        borderColor:
                                                            chain?.color_theme
                                                                .hex,
                                                    }}
                                                >
                                                    <CardDescription className="flex w-full items-center justify-between">
                                                        <span className="flex items-center gap-x-2">
                                                            <span>
                                                                TOKEN HOLDINGS
                                                            </span>
                                                            <span>
                                                                (
                                                                {
                                                                    balances.length
                                                                }{" "}
                                                                tokens)
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
                                                {balances.map(
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
                                                            className="mt-1 flex items-center gap-x-2 p-2"
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
                                                                        chain
                                                                            ?.color_theme
                                                                            .hex
                                                                    }
                                                                />
                                                            </div>

                                                            <div>
                                                                <CardDescription className="flex">
                                                                    {
                                                                        contract_display_name
                                                                    }{" "}
                                                                    (
                                                                    {
                                                                        contract_ticker_symbol
                                                                    }
                                                                    )
                                                                </CardDescription>
                                                                <CardContent>
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
                                    </div>
                                );
                            })}
                        </>
                    ),
                })}
            </Card>
        </>
    );
};
