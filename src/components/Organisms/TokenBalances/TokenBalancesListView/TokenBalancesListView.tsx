import { type Option, None, Some } from "@/utils/option";
import {
    type BalanceItem,
    type ChainItem,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenAvatar } from "../../../Atoms/TokenAvatar/TokenAvatar";
import { Button } from "@/components/ui/button";
import { timestampParser } from "@/utils/functions";
import { AccountCard } from "@/components/Molecules/AccountCard/AccountCard";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { sum } from "lodash";
import { BalancePriceDelta, IconWrapper } from "@/components/Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import {
    type CrossChainBalanceItem,
    type TokenBalancesListViewProps,
} from "@/utils/types/organisms.types";
import { SkeletonTable } from "@/components/ui/skeletonTable";

export const TokenBalancesListView: React.FC<TokenBalancesListViewProps> = ({
    chain_names,
    address,
    mask_balances,
    hide_small_balances,
    on_transfer_click,
}) => {
    const { covalentClient, chains } = useGoldRush();

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "pretty_quote",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] =
        useState<Option<CrossChainBalanceItem[]>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });
    const [filterResult, setFilterResult] =
        useState<Option<CrossChainBalanceItem[]>>(None);
    const [windowWidth, setWindowWidth] = useState<number>(0);

    const handleTokenBalances = async (_address: string) => {
        setResult(None);
        const promises = chain_names.map(async (chain) => {
            let response;
            try {
                response =
                    await covalentClient.BalanceService.getTokenBalancesForWalletAddress(
                        chain,
                        _address.trim()
                    );

                setError({ error: false, error_message: "" });
                return response.data.items.map((o) => {
                    return { ...o, chain };
                });
            } catch (error) {
                console.error(`Error fetching balances for ${chain}:`, error);
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
                return [];
            }
        });

        const results = await Promise.all(promises);
        setResult(new Some(results.flat()));
    };

    useEffect(() => {
        setWindowWidth(window.innerWidth);

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        handleTokenBalances(address);
    }, [chain_names, address]);

    useEffect(() => {
        maybeResult.match({
            None: () => [],
            Some: (result) => {
                if (hide_small_balances) {
                    setFilterResult(
                        new Some(
                            result.filter(
                                (o) =>
                                    o.quote !== null &&
                                    o.quote > 0 &&
                                    o.type !== "dust"
                            )
                        )
                    );
                    return result;
                }
                setFilterResult(new Some(result));
            },
        });
    }, [maybeResult, hide_small_balances]);

    const columns: ColumnDef<CrossChainBalanceItem>[] = [
        {
            id: "contract_name",
            accessorKey: "contract_name",
            header: ({ column }) => (
                <div className="ml-4">
                    <TableHeaderSorting
                        align="left"
                        header_name={"Token"}
                        column={column}
                    />
                </div>
            ),
            cell: ({ row }) => {
                const chain: ChainItem | null =
                    chains?.find((o) => o.name === row.original.chain) ?? null;
                const chainColor = chain?.color_theme.hex;
                const chain_label = (chain?.label ? chain.label : "").replace(
                    " Mainnet",
                    ""
                );
                const protocol_url = row.original.logo_urls.protocol_logo_url;

                return (
                    <div className="ml-4 flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            chain_color={chainColor}
                            sub_url={protocol_url}
                            token_url={row.original.logo_urls.token_logo_url}
                        />
                        <div className="flex flex-col">
                            <div style={{ color: chainColor }}>
                                {chain_label}
                            </div>
                            <label className="text-base">
                                {row.original.contract_display_name
                                    ? row.original.contract_display_name
                                    : ""}
                            </label>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "quote_rate",
            accessorKey: "quote_rate",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Quote Rate"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        {" "}
                        {prettifyCurrency(
                            row.getValue("quote_rate"),
                            2,
                            "USD",
                            true
                        )}{" "}
                    </div>
                );
            },
        },
        {
            id: "balance",
            accessorKey: "balance",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Balance"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const original = row.original as BalanceItem;
                const valueFormatted = calculatePrettyBalance(
                    original.balance ?? 0,
                    row.original.contract_decimals,
                    true,
                    4
                );

                return (
                    <div className="text-right">
                        {!mask_balances ? valueFormatted : "*****"}{" "}
                        {row.original.contract_ticker_symbol}
                    </div>
                );
            },
        },
        {
            id: "pretty_quote",
            accessorKey: "quote",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Quote"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        {" "}
                        {row.original.pretty_quote
                            ? row.original.pretty_quote
                            : "$0.00"}{" "}
                    </div>
                );
            },
        },
        {
            id: "delta",
            accessorKey: "quote_24h",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Delta"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                // * INFO: debugger
                // const delta =  row.original.quote / (row.original as any).quote_24h

                return (
                    <div className="text-right">
                        {" "}
                        <BalancePriceDelta
                            numerator={row.original.quote_24h}
                            denominator={row.original.quote}
                        />{" "}
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-auto  ">
                                    <span className="sr-only">Open menu</span>
                                    <IconWrapper icon_class_name="expand_more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (on_transfer_click) {
                                            on_transfer_click({
                                                chain_name: row.original.chain,
                                                contract_address:
                                                    row.original
                                                        .contract_address,
                                            });
                                        }
                                    }}
                                >
                                    <IconWrapper
                                        icon_class_name="swap_horiz"
                                        class_name="mr-2"
                                    />{" "}
                                    View Transfer History
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>
                                    <div className="flex">
                                        <IconWrapper
                                            icon_class_name="history"
                                            class_name="mr-2"
                                        />
                                        {row.original.last_transferred_at
                                            ? `Last transfered ${timestampParser(
                                                  row.original.last_transferred_at.toDateString(),
                                                  "relative"
                                              )} `
                                            : "FIX ME"}
                                    </div>{" "}
                                </DropdownMenuLabel>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const mobile_columns: ColumnDef<CrossChainBalanceItem>[] = [
        {
            id: "contract_name",
            accessorKey: "contract_name",
            // header: <div className="text-left">Token</div>,
            header: ({ column }) => (
                <div className="ml-4">
                    <TableHeaderSorting
                        align="left"
                        header_name={"Token"}
                        column={column}
                    />
                </div>
            ),
            cell: ({ row }) => {
                const original = row.original as BalanceItem;
                const valueFormatted = calculatePrettyBalance(
                    original.balance ?? 0,
                    row.original.contract_decimals,
                    true,
                    4
                );
                const formattedNumber = parseFloat(
                    valueFormatted.toString()
                ).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                });

                const chain: ChainItem | null =
                    chains?.find((o) => o.name === row.original.chain) ?? null;
                const chainColor = chain?.color_theme.hex;
                const chain_label = (chain?.label ? chain.label : "").replace(
                    " Mainnet",
                    ""
                );
                const protocol_url = row.original.logo_urls.protocol_logo_url;

                return (
                    <div className="ml-4 flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            chain_color={chainColor}
                            sub_url={protocol_url}
                            token_url={row.original.logo_urls.token_logo_url}
                        />
                        <div className="flex flex-col gap-1">
                            <div style={{ color: chainColor }}>
                                {chain_label}
                            </div>
                            <label className="text-base">
                                {row.getValue("contract_display_name")}
                            </label>
                            <div className="text-secondary">
                                {!mask_balances ? formattedNumber : "*****"}{" "}
                                {row.original.contract_ticker_symbol}
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "pretty_quote",
            accessorKey: "quote",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Quote"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex flex-col">
                        <div className="text-right text-base">
                            {row.original.pretty_quote
                                ? row.original.pretty_quote
                                : "$0.00"}
                        </div>
                        <div className="text-right ">
                            <BalancePriceDelta
                                numerator={row.original.quote_24h}
                                denominator={row.original.quote}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return (
                    <div className="text-right">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="ml-auto  ">
                                    <span className="sr-only">Open menu</span>
                                    <IconWrapper icon_class_name="expand_more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (on_transfer_click) {
                                            on_transfer_click({
                                                chain_name: row.original.chain,
                                                contract_address:
                                                    row.original
                                                        .contract_address,
                                            });
                                        }
                                    }}
                                >
                                    <IconWrapper
                                        icon_class_name="swap_horiz"
                                        class_name="mr-2"
                                    />{" "}
                                    View Transfer History
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem>
                                    <IconWrapper
                                        icon_class_name="swap_calls"
                                        class_name="mr-2"
                                    />{" "}
                                    Swap {row.original.contract_ticker_symbol}
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>
                                    <div className="flex">
                                        <IconWrapper
                                            icon_class_name="history"
                                            class_name="mr-2"
                                        />
                                        {row.original.last_transferred_at
                                            ? `Last transfered ${timestampParser(
                                                  row.original.last_transferred_at.toDateString(),
                                                  "relative"
                                              )} `
                                            : "FIX ME"}
                                    </div>{" "}
                                </DropdownMenuLabel>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: filterResult.match({
            None: () => [],
            Some: (result) => result,
        }),
        columns: windowWidth < 700 ? mobile_columns : columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            rowSelection,
        },
    });

    const body = filterResult.match({
        None: () => <SkeletonTable cols={4} float="right" />,
        Some: () =>
            error.error ? (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                        {error.error_message}
                    </TableCell>
                </TableRow>
            ) : !error.error && table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                    <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                    >
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))
            ) : (
                <TableRow>
                    <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                    >
                        No results.
                    </TableCell>
                </TableRow>
            ),
    });

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap place-content-between gap-2">
                <AccountCard address={address} />
                <div className="w-full rounded border p-2 md:max-w-[15rem] lg:max-w-[15rem]">
                    <h2 className="text-md text-secondary">Total Quote</h2>
                    <div className="flex items-end gap-2">
                        <span className="text-base">
                            {filterResult.match({
                                None: () => (
                                    <Skeleton size={GRK_SIZES.MEDIUM} />
                                ),
                                Some: (result) => {
                                    const s = sum(result.map((x) => x.quote));
                                    return (
                                        <span>
                                            {prettifyCurrency(
                                                s,
                                                2,
                                                "USD",
                                                true
                                            )}
                                        </span>
                                    );
                                },
                            })}
                        </span>
                        <span className="flex text-sm text-secondary">
                            {filterResult.match({
                                None: () => (
                                    <Skeleton
                                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                    />
                                ),
                                Some: (result) => {
                                    return (
                                        <span>({result.length} Tokens)</span>
                                    );
                                },
                            })}
                        </span>
                    </div>
                </div>
            </div>

            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext()
                                              )}
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>{body}</TableBody>
            </Table>
        </div>
    );
};
