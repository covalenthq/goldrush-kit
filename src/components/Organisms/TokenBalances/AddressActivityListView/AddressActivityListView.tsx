import { type Option, None, Some } from "@/utils/option";
import { type ChainActivityEvent } from "@covalenthq/client-sdk";
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { AccountCardView } from "@/components/Molecules/AccountCardView/AccountCardView";
import { Skeleton } from "@/components/ui/skeleton";
import { timestampParser } from "@/utils/functions";
import { TokenAvatar } from "@/components/Atoms/TokenAvatar/TokenAvatar";
import { TableHeaderSorting } from "@/components/ui/tableHeaderSorting";
import { IconWrapper } from "@/components/Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useCovalent } from "@/utils/store/Covalent";
import { type AddressActivityListViewProps } from "@/utils/types/organisms.types";
import { SkeletonTable } from "@/components/ui/skeletonTable";

export const AddressActivityListView: React.FC<
    AddressActivityListViewProps
> = ({
    address,
    get_all_row_selection,
    get_row_selection_state,
    row_selection_state,
}) => {
    const { covalentClient } = useCovalent();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState(
        row_selection_state ? row_selection_state : {}
    );
    const [maybeResult, setResult] =
        useState<Option<ChainActivityEvent[]>>(None);
    const [error, setError] = useState({ error: false, error_message: "" });

    useEffect(() => {
        maybeResult.match({
            None: () => null,
            Some: (resp) => {
                const chains_selected: ChainActivityEvent[] = [];
                for (const i in rowSelection) {
                    const index: number = parseInt(i);
                    chains_selected.push(resp[index]);
                }
                if (get_all_row_selection) {
                    get_all_row_selection(chains_selected);
                }
            },
        });
        if (get_row_selection_state) {
            get_row_selection_state(rowSelection);
        }
    }, [maybeResult, rowSelection, row_selection_state]);

    useEffect(() => {
        (async () => {
            setResult(None);
            let response;
            try {
                response = await covalentClient.BaseService.getAddressActivity(
                    address.trim(),
                    {
                        testnets: true,
                    }
                );
                setError({ error: false, error_message: "" });
                setResult(new Some(response.data.items));
            } catch (exception) {
                setResult(new Some([]));
                setError({
                    error: response ? response.error : false,
                    error_message: response ? response.error_message : "",
                });
            }
        })();
    }, [address]);

    const columns: ColumnDef<ChainActivityEvent>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => {
                        table.toggleAllPageRowsSelected(!!value);
                    }}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => {
                        row.toggleSelected(!!value);
                    }}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "label",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Name"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-x-1 ">
                        <TokenAvatar
                            is_chain_logo={true}
                            token_url={row.original.logo_url}
                            size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                        />
                        {row.getValue("label")}
                    </div>
                );
            },
        },
        {
            accessorKey: "last_seen_at",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="left"
                    header_name={"Last Active"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const t = (row.getValue("last_seen_at") as any).toString();

                return <div>{timestampParser(t, "relative")}</div>;
            },
        },
        {
            accessorKey: "is_testnet",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="center"
                    header_name={"Mainnet"}
                    column={column}
                />
            ),

            cell: ({ row }) => {
                const t = row.getValue("is_testnet");

                return (
                    <div className="text-center">
                        {t ? (
                            ""
                        ) : (
                            <IconWrapper icon_class_name="playlist_add_check" />
                        )}
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: maybeResult.match({
            None: () => [],
            Some: (result) => result,
        }),
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

    const body = maybeResult.match({
        None: () => <SkeletonTable cols={1} />,
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
        <div className="space-y-4 ">
            <div className="flex flex-wrap place-content-between gap-2">
                <AccountCardView address={address} />
                <div className="w-full rounded border p-2 md:max-w-[15rem] lg:max-w-[15rem]">
                    <div className="flex place-content-between items-center space-x-1">
                        {" "}
                        <span>Mainnet Chains Active</span>{" "}
                        <span className=" text-secondary ">
                            {" "}
                            {maybeResult.match({
                                None: () => (
                                    <Skeleton
                                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                    />
                                ),
                                Some: (result) => {
                                    return (
                                        <span>
                                            {
                                                result.filter(
                                                    (x) =>
                                                        x.is_testnet === false
                                                ).length
                                            }{" "}
                                        </span>
                                    );
                                },
                            })}{" "}
                        </span>
                    </div>

                    <div className="flex place-content-between items-center space-x-1">
                        {" "}
                        <span>Testnet Chains Active</span>{" "}
                        <span className=" text-secondary ">
                            {" "}
                            {maybeResult.match({
                                None: () => (
                                    <Skeleton
                                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                    />
                                ),
                                Some: (result) => {
                                    return (
                                        <span>
                                            {
                                                result.filter(
                                                    (x) => x.is_testnet === true
                                                ).length
                                            }{" "}
                                        </span>
                                    );
                                },
                            })}{" "}
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
