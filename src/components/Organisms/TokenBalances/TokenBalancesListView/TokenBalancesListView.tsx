import { type Option, None, Some } from "@/utils/option";
import {
    type BalanceItem,
    type ChainItem,
    calculatePrettyBalance,
    prettifyCurrency
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
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { TokenAvatar } from "../../../Atoms/TokenAvatar/TokenAvatar";
import { Button } from "@/components/ui/button";
import { timestampParser } from "@/utils/functions";
import { BalancePriceDelta } from "@/components/Atoms/BalancePriceDelta/BalancePriceDelta";
import { AccountCardView } from "@/components/Molecules/AccountCardView/AccountCardView";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { sum } from "lodash";
import { IconWrapper } from "@/components/Atoms/IconWrapper/IconWrapper";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useGoldrush } from "@/utils/store/Goldrush";
import {
    type CrossChainBalanceItem,
    type TokenBalancesListViewProps,
} from "@/utils/types/organisms.types";

export const TokenBalancesListView: React.FC<TokenBalancesListViewProps> = ({
    chain_names,
    address,
    mask_balances,
    hide_small_balances,
}) => {
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "pretty_quote",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] =
        useState<Option<CrossChainBalanceItem[]>>(None);
    const { covalentClient } = useGoldrush();
    const [error, setError] = useState({ error: false, error_message: "" });
    const [allChains, setAllChains] = useState<Option<ChainItem[]>>(None);

    const [filterResult, setFilterResult] =
        useState<Option<CrossChainBalanceItem[]>>(None);
    const [windowWidth, setWindowWidth] = useState(0);

    const handleAllChains = async () => {
        const allChainsResp = await covalentClient.BaseService.getAllChains();
        setAllChains(new Some(allChainsResp.data.items));
    };

    const handleTokenBalances = async (_address: string) => {
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
        handleAllChains();

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
        setResult(None);
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
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    className="mx-1"
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    className="mx-1"
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "contract_name",
            accessorKey: "contract_name",
            // header: <div className="text-left">Token</div>,
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Token"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return allChains.match({
                    None: () => <></>,
                    Some: (chains) => {
                        const chain: ChainItem = chains.filter(
                            (o) => o.name === row.original.chain
                        )[0];
                        const chainColor = chain.color_theme.hex;
                        const chain_label = (
                            chain?.label ? chain.label : "FIXME"
                        ).replace(" Mainnet", "");
                        const protocol_url =
                            row.original.logo_urls.protocol_logo_url;

                        return (
                            <div className="flex items-center gap-3 ">
                                <TokenAvatar
                                    size={GRK_SIZES.EXTRA_SMALL}
                                    chainColor={chainColor}
                                    subUrl={protocol_url}
                                    tokenUrl={row.original.logo_url}
                                />
                                <div className="flex flex-col">
                                    <div style={{ color: chainColor }}>
                                        {chain_label}
                                    </div>
                                    <label className="text-base">
                                        {row.original.contract_display_name
                                            ? row.original.contract_display_name
                                            : "FIXME"}
                                    </label>
                                </div>
                            </div>
                        );
                    },
                });
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
                        {prettifyCurrency(row.getValue("quote_rate"), 2, "USD", true)}{" "}
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
                // const delta =  row.original.quote / (row.original as any).quote_24h
                // debugger;

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
                                    <IconWrapper iconClassName="expand_more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <IconWrapper
                                        iconClassName="swap_horiz"
                                        className="mr-2"
                                    />{" "}
                                    View Transfer History
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <IconWrapper
                                        iconClassName="swap_calls"
                                        className="mr-2"
                                    />{" "}
                                    Swap {row.original.contract_ticker_symbol}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>
                                    <div className="flex">
                                        <IconWrapper
                                            iconClassName="history"
                                            className="mr-2"
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
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(!!value)
                    }
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "contract_name",
            accessorKey: "contract_name",
            // header: <div className="text-left">Token</div>,
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Token"}
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
                const formattedNumber = parseFloat(
                    valueFormatted.toString()
                ).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 4,
                });

                return allChains.match({
                    None: () => <></>,
                    Some: (chains) => {
                        const chain: ChainItem = chains.filter(
                            (o) => o.name === row.original.chain
                        )[0];
                        const chainColor = chain.color_theme.hex;
                        const chain_label = (
                            chain?.label ? chain.label : "FIXME"
                        ).replace(" Mainnet", "");
                        const protocol_url =
                            row.original.logo_urls.protocol_logo_url;

                        return (
                            <div className="flex items-center gap-3">
                                <TokenAvatar
                                    size={GRK_SIZES.EXTRA_SMALL}
                                    chainColor={chainColor}
                                    subUrl={protocol_url}
                                    tokenUrl={row.original.logo_url}
                                />
                                <div className="flex flex-col gap-1">
                                    <div style={{ color: chainColor }}>
                                        {chain_label}
                                    </div>
                                    <label className="text-base">
                                        {row.getValue("contract_display_name")}
                                    </label>
                                    <div className="text-secondary">
                                        {!mask_balances
                                            ? formattedNumber
                                            : "*****"}{" "}
                                        {row.original.contract_ticker_symbol}
                                    </div>
                                </div>
                            </div>
                        );
                    },
                });
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
                                    <IconWrapper iconClassName="expand_more" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem>
                                    <IconWrapper
                                        iconClassName="swap_horiz"
                                        className="mr-2"
                                    />{" "}
                                    View Transfer History
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <IconWrapper
                                        iconClassName="swap_calls"
                                        className="mr-2"
                                    />{" "}
                                    Swap {row.original.contract_ticker_symbol}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel>
                                    <div className="flex">
                                        <IconWrapper
                                            iconClassName="history"
                                            className="mr-2"
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
        None: () => (
            <TableRow>
                <TableCell className="h-12 text-center"></TableCell>
                <TableCell className="h-12 text-right">
                    <div className="float-left">
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                </TableCell>
                <TableCell className="h-12 text-right">
                    <div className="float-right">
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                </TableCell>
                <TableCell className="h-12 text-right">
                    <div className="float-right">
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                </TableCell>
                <TableCell className="h-12 text-right">
                    <div className="float-right">
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                </TableCell>
                <TableCell className="h-12 text-right">
                    <div className="float-right">
                        <Skeleton size={GRK_SIZES.LARGE} />
                    </div>
                </TableCell>
            </TableRow>
        ),
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
                <AccountCardView address={address} />
                <div className="w-full rounded border p-2 md:w-min lg:w-min">
                    <h2 className="text-base font-semibold  text-secondary ">Total Quote</h2>
                    <div className="flex items-end gap-2">
                        <span className="text-xl">
                            {filterResult.match({
                                None: () => (
                                    <Skeleton size={GRK_SIZES.MEDIUM} />
                                ),
                                Some: (result) => {
                                    const s = sum(result.map((x) => x.quote));
                                    return <span>{prettifyCurrency(s, 2, "USD", true)}</span>;
                                },
                            })}
                        </span>
                        <div className="flex  gap-1  text-sm text-secondary">
                            <span className="">
                                {" "}
                                (
                                {filterResult.match({
                                    None: () => (
                                        <Skeleton
                                            size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                        />
                                    ),
                                    Some: (result) => {
                                        return <span>{result.length}</span>;
                                    },
                                })}{" "}
                            </span>
                            Tokens)
                        </div>
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
