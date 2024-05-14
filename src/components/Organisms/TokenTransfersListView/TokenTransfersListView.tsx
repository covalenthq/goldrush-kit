import { type Option, None, Some } from "@/utils/option";
import {
    type BlockTransactionWithContractTransfers,
    type Pagination,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { type TIME_SERIES_GROUP } from "@/utils/constants/shared.constants";
import { Fragment, useCallback, useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { Address, AddressAvatar } from "../../Atoms";
import {
    timestampParser,
    truncate,
    calculateTimeSeriesGroup,
} from "@/utils/functions";
import { Badge } from "@/components/ui/badge";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { type TokenTransfersListViewProps } from "@/utils/types/organisms.types";
import { useGoldRush } from "@/utils/store";

export const TokenTransfersListView: React.FC<TokenTransfersListViewProps> = ({
    chain_name,
    address,
    contract_address,
    page_size = 10,
}) => {
    const { covalentClient } = useGoldRush();

    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [maybeResult, setResult] =
        useState<Option<BlockTransactionWithContractTransfers[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [_, setLastTimeSeries] = useState<[]>([]);

    useEffect(() => {
        setLastTimeSeries([]);
    }, [pagination]);

    useEffect(() => {
        updateResult(null);
    }, [address, contract_address, chain_name, page_size]);

    const updateResult = useCallback(
        async (_pagination: Pagination | null) => {
            try {
                setResult(None);
                setErrorMessage(null);
                const { data, ...error } =
                    await covalentClient.BalanceService.getErc20TransfersForWalletAddressByPage(
                        chain_name,
                        address.trim(),
                        {
                            contractAddress: contract_address.trim(),
                            pageNumber: _pagination?.page_number ?? 0,
                            pageSize: _pagination?.page_size ?? page_size,
                        }
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setPagination(data.pagination);
                setResult(new Some(data.items));
            } catch (error) {
                console.error(error);
            }
        },
        [chain_name, address]
    );

    const handleOnChangePagination = (updatedPagination: Pagination) => {
        setPagination(updatedPagination);
        updateResult(updatedPagination);
    };

    const columns: ColumnDef<BlockTransactionWithContractTransfers>[] = [
        {
            accessorKey: "block_signed_at",
            id: "block_signed_at",
            header: ({ column }) => (
                <TableHeaderSorting<BlockTransactionWithContractTransfers>
                    align="left"
                    header={"Signed at"}
                    column={column}
                />
            ),
            cell: ({ row }) =>
                timestampParser(row.getValue("block_signed_at"), "relative"),
        },
        {
            accessorKey: "from_address",
            id: "from_address",
            header: ({ column }) => (
                <TableHeaderSorting<BlockTransactionWithContractTransfers>
                    align="left"
                    header={"From"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-x-1">
                    <AddressAvatar
                        size={GRK_SIZES.EXTRA_SMALL}
                        type="fingerprint"
                        address={row.getValue("from_address")}
                    />
                    {truncate(row.getValue("from_address"))}
                </div>
            ),
        },
        {
            accessorKey: "to_address",
            id: "to_address",
            header: ({ column }) => (
                <TableHeaderSorting<BlockTransactionWithContractTransfers>
                    align="left"
                    header={"To"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-x-1">
                        <AddressAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            type="fingerprint"
                            address={row.getValue("to_address")}
                        />
                        {truncate(row.getValue("to_address"))}
                    </div>
                );
            },
        },
        {
            accessorKey: "transfer_type",
            id: "transfer_type",
            header: ({ column }) => (
                <TableHeaderSorting<BlockTransactionWithContractTransfers>
                    align="left"
                    header={"In/Out"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <Badge>{row.original.transfers[0].transfer_type}</Badge>
            ),
        },
        {
            accessorKey: "delta",
            id: "delta",
            header: ({ column }) => (
                <TableHeaderSorting<BlockTransactionWithContractTransfers>
                    align="right"
                    header={"Token Amount"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const transfer = row.original.transfers[0];
                return transfer ? (
                    <div className="text-right">
                        {calculatePrettyBalance(
                            transfer?.delta ?? 0,
                            transfer?.contract_decimals
                        )}{" "}
                        {transfer?.contract_ticker_symbol}
                    </div>
                ) : (
                    <></>
                );
            },
        },
        {
            accessorKey: "delta_quote",
            id: "delta_quote",
            header: ({ column }) => (
                <TableHeaderSorting<BlockTransactionWithContractTransfers>
                    align="right"
                    header={"Quote"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {prettifyCurrency(
                        row.original.transfers[0].delta_quote,
                        2,
                        "USD",
                        true
                    )}
                </div>
            ),
        },
        {
            accessorKey: "tx_hash",
            id: "tx_hash",
            header: ({ column }) => (
                <TableHeaderSorting<BlockTransactionWithContractTransfers>
                    align="right"
                    header={"Transaction Hash"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="flex justify-end">
                    <Address address={row.getValue("tx_hash")} />
                </div>
            ),
        },
    ];

    let lastTimeSeries: TIME_SERIES_GROUP | null = null;
    return (
        <TableList<BlockTransactionWithContractTransfers>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={maybeResult}
            pagination={pagination}
            onChangePaginationHandler={handleOnChangePagination}
            customRows={(rows, defaultRow) =>
                rows.map((row) => {
                    const currentTimeSeries = calculateTimeSeriesGroup(
                        new Date(),
                        row.original.block_signed_at
                    );
                    return (
                        <Fragment key={row.id}>
                            {(() => {
                                if (lastTimeSeries !== currentTimeSeries) {
                                    lastTimeSeries = currentTimeSeries;
                                    return (
                                        <TableRow className="bg-opacity-10 text-xs uppercase text-primary-light dark:text-primary-dark">
                                            <TableCell colSpan={columns.length}>
                                                {currentTimeSeries}
                                            </TableCell>
                                        </TableRow>
                                    );
                                }
                            })()}

                            {defaultRow(row)}
                        </Fragment>
                    );
                })
            }
        />
    );
};
