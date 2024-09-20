import { Address } from "@/components/Atoms";
import { Timestamp } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
    type TIME_SERIES_GROUP,
} from "@/utils/constants/shared.constants";
import { calculateTimeSeriesGroup } from "@/utils/functions";
import { type Option, None, Some } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TokenTransfersListProps } from "@/utils/types/molecules.types";
import {
    type BlockTransactionWithContractTransfers,
    type Pagination,
    type GoldRushResponse,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";
import { Fragment, useCallback, useEffect, useState } from "react";

export const TokenTransfersList: React.FC<TokenTransfersListProps> = ({
    chain_name,
    address,
    contract_address,
    page_size = 10,
    actionable_from,
    actionable_to,
}) => {
    const { goldrushClient } = useGoldRush();

    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [maybeResult, setMaybeResult] =
        useState<Option<BlockTransactionWithContractTransfers[] | null>>(None);
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
                setMaybeResult(None);
                setErrorMessage(null);
                const { data, ...error } =
                    await goldrushClient.BalanceService.getErc20TransfersForWalletAddressByPage(
                        chain_name,
                        address.trim(),
                        {
                            contractAddress: contract_address.trim(),
                            pageNumber: _pagination?.page_number ?? 0,
                            pageSize: _pagination?.page_size ?? page_size,
                        },
                    );
                if (error.error) {
                    throw error;
                }
                if (!data?.items) {
                    throw FALLBACK_ERROR;
                }
                setPagination(data.pagination);
                setMaybeResult(new Some(data.items));
            } catch (error: GoldRushResponse<null> | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        },
        [chain_name, address],
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
            cell: ({ row }) => (
                <Timestamp
                    timestamp={row.getValue("block_signed_at")}
                    defaultType="relative"
                />
            ),
        },
        {
            accessorKey: "from_address",
            id: "from_address",
            header: "From",
            cell: ({ row }) => (
                <Address
                    address={row.original.from_address}
                    label={row.original.from_address_label}
                    avatar={{}}
                    actionable_address={actionable_from}
                />
            ),
        },
        {
            accessorKey: "to_address",
            id: "to_address",
            header: "To",
            cell: ({ row }) => {
                return (
                    <Address
                        address={row.original.to_address}
                        label={row.original.to_address_label}
                        avatar={{}}
                        actionable_address={actionable_to}
                    />
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
                <Badge>{row.original.transfers?.[0].transfer_type}</Badge>
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
                const transfer = row.original.transfers?.[0];
                return transfer ? (
                    <div className="text-right">
                        {calculatePrettyBalance(
                            transfer?.delta ?? 0,
                            Number(transfer?.contract_decimals),
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
                        Number(row.original.transfers?.[0].delta_quote),
                        2,
                        "USD",
                        true,
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
                        row.original.block_signed_at,
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
