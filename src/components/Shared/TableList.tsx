import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { type TableListProps } from "@/utils/types/shared.types";
import {
    type SortingState,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    type Row,
} from "@tanstack/react-table";
import { useCallback, useState } from "react";
import { SkeletonTable } from "./SkeletonTable";
import { PaginationFooter } from "./PaginationFooter";

export const TableList: <T>(props: TableListProps<T>) => React.ReactNode = ({
    columns,
    row_selection_state = {},
    errorMessage,
    maybeData,
    sorting_state = [],
    pagination = null,
    onChangePaginationHandler,
    customRows,
}) => {
    const [sorting, setSorting] = useState<SortingState>(sorting_state);
    const [rowSelection, setRowSelection] = useState(row_selection_state);

    const table = useReactTable({
        data: maybeData.match({
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

    const defaultRow = useCallback(
        (row: Row<unknown>): React.ReactNode => (
            <TableRow
                id={row.id}
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
        ),
        []
    );

    return (
        <div className="space-y-4">
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead
                                        key={header.id}
                                        onClick={() =>
                                            header.column.toggleSorting(
                                                header.column.getIsSorted() ===
                                                    "asc"
                                            )
                                        }
                                    >
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
                <TableBody>
                    {maybeData.match({
                        None: () => <SkeletonTable cols={columns.length} />,
                        Some: () =>
                            errorMessage ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        {errorMessage}
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                customRows ? (
                                    customRows(
                                        table.getRowModel().rows,
                                        defaultRow
                                    )
                                ) : (
                                    table
                                        .getRowModel()
                                        .rows.map((row) => defaultRow(row))
                                )
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
                    })}
                </TableBody>
            </Table>

            {pagination &&
                onChangePaginationHandler &&
                maybeData.match({
                    None: () => (
                        <PaginationFooter
                            disabled
                            pagination={pagination}
                            onChangePaginationHandler={
                                onChangePaginationHandler
                            }
                        />
                    ),
                    Some: (data) => (
                        <PaginationFooter
                            disabled={data?.length ? false : true}
                            pagination={pagination}
                            onChangePaginationHandler={
                                onChangePaginationHandler
                            }
                        />
                    ),
                })}
        </div>
    );
};
