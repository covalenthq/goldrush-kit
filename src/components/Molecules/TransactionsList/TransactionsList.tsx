import { type Option, None, Some } from "@/utils/option";
import { type ChainItem, calculatePrettyBalance } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

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
import { TokenAvatar } from "../../Atoms/TokenAvatar/TokenAvatar";
import { timestampParser, truncate } from "@/utils/functions";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useCovalent } from "@/utils/store/Covalent";
import { SkeletonTable } from "@/components/ui/skeletonTable";
import {
    type CrossChainTransaction,
    type TransactionListProps,
} from "@/utils/types/molecules.types";

export const TransactionsList: React.FC<TransactionListProps> = ({
    chain_names,
    address,
}) => {
    const { covalentClient, chains } = useCovalent();

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "block_signed_at",
            desc: true,
        },
    ]);
    const [rowSelection, setRowSelection] = useState({});
    const [maybeResult, setResult] =
        useState<Option<CrossChainTransaction[]>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });
    const [filterResult, setFilterResult] =
        useState<Option<CrossChainTransaction[]>>(None);

    useEffect(() => {
        (async () => {
            setResult(None);
            const promises = chain_names.map(async (chain_name) => {
                let response;
                try {
                    response =
                        await covalentClient.TransactionService.getAllTransactionsForAddressByPage(
                            chain_name,
                            address.trim(),
                            {
                                noLogs: true,
                                withSafe: false,
                                quoteCurrency: "USD",
                            }
                        );
                    setError({ error: false, error_message: "" });
                    return response.data.items.map((o) => {
                        return { ...o, chain: chain_name };
                    });
                } catch (error) {
                    console.error(
                        `Error fetching balances for ${chain_name}:`,
                        error
                    );
                    setError({
                        error: response ? response.error : false,
                        error_message: response ? response.error_message : "",
                    });
                    return [];
                }
            });
            const results = await Promise.all(promises);
            setResult(new Some(results.flat()));

            maybeResult.match({
                None: () => [],
                Some: (result) => {
                    setFilterResult(new Some(result));
                    return [];
                },
            });
        })();
    }, [chain_names, address]);

    const columns: ColumnDef<CrossChainTransaction>[] = [
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
            id: "tx_hash",
            accessorKey: "tx_hash",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Transaction Hash"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const chain: ChainItem | null =
                    chains?.find((o) => o.name === row.original.chain) ?? null;
                const chainColor = chain?.color_theme.hex;

                return (
                    <div className="flex items-center gap-3">
                        <TokenAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            chain_color={chainColor}
                            token_url={chain?.logo_url}
                            is_chain_logo
                        />
                        <p className="flex flex-col text-base">
                            {truncate(row.original.tx_hash)}
                        </p>
                    </div>
                );
            },
        },
        {
            id: "block_height",
            accessorKey: "block_height",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Block Height"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return <p>{row.original.block_height}</p>;
            },
        },
        {
            id: "block_signed_at",
            accessorKey: "block_signed_at",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Age"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <p>
                        {timestampParser(
                            row.original.block_signed_at.toString(),
                            "relative"
                        )}
                    </p>
                );
            },
        },
        {
            id: "from_address",
            accessorKey: "from_address",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"From"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <p>
                        {row.original.from_address_label ||
                            truncate(row.original.from_address)}
                    </p>
                );
            },
        },
        {
            id: "to_address",
            accessorKey: "to_address",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"To"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <p className="text-left">
                        {row.original.to_address_label ||
                            truncate(row.original.to_address)}
                    </p>
                );
            },
        },
        {
            id: "value",
            accessorKey: "value",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="center"
                    header_name={"Value"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return row.original.value ? (
                    <p className="text-right">
                        {calculatePrettyBalance(
                            row.original.value,
                            row.original.gas_metadata.contract_decimals
                        )}{" "}
                        {row.original.gas_metadata.contract_ticker_symbol}
                    </p>
                ) : (
                    <p className="text-center">-</p>
                );
            },
        },
        {
            id: "fees_paid",
            accessorKey: "fees_paid",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Fees Paid"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return row.original.fees_paid ? (
                    <p className="text-right">
                        {calculatePrettyBalance(
                            row.original.fees_paid,
                            row.original.gas_metadata.contract_decimals
                        )}
                    </p>
                ) : (
                    <p className="text-center">-</p>
                );
            },
        },
    ];

    // const mobile_columns: ColumnDef<CrossChainTransaction>[] = [
    //     {
    //         id: "select",
    //         header: ({ table }) => (
    //             <Checkbox
    //                 checked={table.getIsAllPageRowsSelected()}
    //                 onCheckedChange={(value) =>
    //                     table.toggleAllPageRowsSelected(!!value)
    //                 }
    //                 aria-label="Select all"
    //             />
    //         ),
    //         cell: ({ row }) => (
    //             <Checkbox
    //                 checked={row.getIsSelected()}
    //                 onCheckedChange={(value) => row.toggleSelected(!!value)}
    //                 aria-label="Select row"
    //             />
    //         ),
    //         enableSorting: false,
    //         enableHiding: false,
    //     },
    //     {
    //         id: "contract_name",
    //         accessorKey: "contract_name",
    //         // header: <div className="text-left">Token</div>,
    //         header: ({ column }) => (
    //             <TableHeaderSorting
    //                 align="left"
    //                 header_name={"Token"}
    //                 column={column}
    //             />
    //         ),
    //         cell: ({ row }) => {
    //             const original = row.original as BalanceItem;
    //             const valueFormatted = calculatePrettyBalance(
    //                 original.balance ?? 0,
    //                 row.original.contract_decimals,
    //                 true,
    //                 4
    //             );
    //             const formattedNumber = parseFloat(
    //                 valueFormatted.toString()
    //             ).toLocaleString(undefined, {
    //                 minimumFractionDigits: 4,
    //                 maximumFractionDigits: 4,
    //             });

    //             const chain: ChainItem | null =
    //                 chains?.find((o) => o.name === row.original.chain) ?? null;
    //             const chainColor = chain?.color_theme.hex;
    //             const chain_label = (
    //                 chain?.label ? chain.label : "FIXME"
    //             ).replace(" Mainnet", "");
    //             const protocol_url = row.original.logo_urls.protocol_logo_url;

    //             return (
    //                 <div className="flex items-center gap-3">
    //                     <TokenAvatar
    //                         size={GRK_SIZES.EXTRA_SMALL}
    //                         chain_color={chainColor}
    //                         sub_url={protocol_url}
    //                         token_url={row.original.logo_urls.token_logo_url}
    //                     />
    //                     <div className="flex flex-col gap-1">
    //                         <div style={{ color: chainColor }}>
    //                             {chain_label}
    //                         </div>
    //                         <label className="text-base">
    //                             {row.getValue("contract_display_name")}
    //                         </label>
    //                         <div className="text-secondary">
    //                             {!mask_balances ? formattedNumber : "*****"}{" "}
    //                             {row.original.contract_ticker_symbol}
    //                         </div>
    //                     </div>
    //                 </div>
    //             );
    //         },
    //     },
    //     {
    //         id: "pretty_quote",
    //         accessorKey: "quote",
    //         header: ({ column }) => (
    //             <TableHeaderSorting
    //                 align="right"
    //                 header_name={"Quote"}
    //                 column={column}
    //             />
    //         ),
    //         cell: ({ row }) => {
    //             return (
    //                 <div className="flex flex-col">
    //                     <div className="text-right text-base">
    //                         {row.original.pretty_quote
    //                             ? row.original.pretty_quote
    //                             : "$0.00"}
    //                     </div>
    //                     <div className="text-right ">
    //                         <BalancePriceDelta
    //                             numerator={row.original.quote_24h}
    //                             denominator={row.original.quote}
    //                         />
    //                     </div>
    //                 </div>
    //             );
    //         },
    //     },
    //     {
    //         id: "actions",
    //         cell: ({ row }) => {
    //             return (
    //                 <div className="text-right">
    //                     <DropdownMenu>
    //                         <DropdownMenuTrigger asChild>
    //                             <Button variant="ghost" className="ml-auto  ">
    //                                 <span className="sr-only">Open menu</span>
    //                                 <IconWrapper icon_class_name="expand_more" />
    //                             </Button>
    //                         </DropdownMenuTrigger>
    //                         <DropdownMenuContent align="end">
    //                             <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                             <DropdownMenuItem
    //                                 onClick={() => {
    //                                     if (on_transfer_click) {
    //                                         on_transfer_click(
    //                                             row.original.contract_address
    //                                         );
    //                                     }
    //                                 }}
    //                             >
    //                                 <IconWrapper
    //                                     icon_class_name="swap_horiz"
    //                                     class_name="mr-2"
    //                                 />{" "}
    //                                 View Transfer History
    //                             </DropdownMenuItem>
    //                             {/* <DropdownMenuItem>
    //                                 <IconWrapper
    //                                     icon_class_name="swap_calls"
    //                                     class_name="mr-2"
    //                                 />{" "}
    //                                 Swap {row.original.contract_ticker_symbol}
    //                             </DropdownMenuItem> */}
    //                             <DropdownMenuSeparator />
    //                             <DropdownMenuLabel>
    //                                 <div className="flex">
    //                                     <IconWrapper
    //                                         icon_class_name="history"
    //                                         class_name="mr-2"
    //                                     />
    //                                     {row.original.last_transferred_at
    //                                         ? `Last transfered ${timestampParser(
    //                                               row.original.last_transferred_at.toDateString(),
    //                                               "relative"
    //                                           )} `
    //                                         : "FIX ME"}
    //                                 </div>{" "}
    //                             </DropdownMenuLabel>
    //                         </DropdownMenuContent>
    //                     </DropdownMenu>
    //                 </div>
    //             );
    //         },
    //     },
    // ];

    const table = useReactTable({
        data: filterResult.match({
            None: () => [],
            Some: (result) => result,
        }),
        columns:
            // windowWidth < 700 ? mobile_columns :
            columns,
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
        None: () => <SkeletonTable cols={6} float="right" />,
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
                                              header.column.columnDef.header,
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
    );
};
