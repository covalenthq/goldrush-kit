import { type Option, None, Some } from "@/utils/option";
import {
    type BlockTransactionWithContractTransfers,
    type Pagination,
    calculatePrettyBalance,
    prettifyCurrency,
} from "@covalenthq/client-sdk";
import { TIME_SERIES_GROUP } from "@/utils/constants/shared.constants";
import { Fragment, useCallback, useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { TableCell, TableRow } from "@/components/ui/table";
import { AddressAvatar } from "../../Atoms";
import {
    timestampParser,
    truncate,
    calculateTimeSeriesGroup,
} from "@/utils/functions";
import { Badge } from "@/components/ui/badge";
import {
    IconWrapper,
    TableHeaderSorting,
    TableList,
} from "@/components/Shared";
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

    const updateResult = useCallback(async (_pagination: Pagination | null) => {
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
    }, []);

    const handleOnChangePagination = (updatedPagination: Pagination) => {
        setPagination(updatedPagination);
        updateResult(updatedPagination);
    };

    const columns: ColumnDef<BlockTransactionWithContractTransfers>[] = [
        {
            accessorKey: "block_signed_at",
            header: ({ column }) => (
                <div className="ml-4">
                    <TableHeaderSorting
                        align="left"
                        header_name={"Time"}
                        column={column}
                    />
                </div>
            ),
            cell: ({ row }) => {
                const t = row.getValue("block_signed_at") as string;

                return (
                    <div className="ml-4">{timestampParser(t, "relative")}</div>
                );
            },
        },
        {
            accessorKey: "from_address",
            header: "From",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-x-1">
                        <AddressAvatar
                            size={GRK_SIZES.EXTRA_SMALL}
                            type="fingerprint"
                            address={row.getValue("from_address")}
                        />
                        {truncate(row.getValue("from_address"))}
                    </div>
                );
            },
        },
        {
            accessorKey: "to_address",
            header: "To",
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
            header: "In/Out",
            cell: ({ row }) => {
                return <Badge>{row.original.transfers[0].transfer_type}</Badge>;
            },
        },
        {
            id: "tokenAmount",
            accessorKey: "delta",
            header: ({ column }) => (
                <TableHeaderSorting
                    align="right"
                    header_name={"Token Amount"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const transfer = row.original.transfers[0];
                if (transfer) {
                    return (
                        <div className="text-right">
                            {calculatePrettyBalance(
                                transfer?.delta ?? 0,
                                transfer?.contract_decimals
                            )}{" "}
                            {transfer?.contract_ticker_symbol}
                        </div>
                    );
                }
                return null;
            },
        },
        {
            id: "value",
            accessorKey: "delta_quote",
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
                        {prettifyCurrency(
                            row.original.transfers[0].delta_quote,
                            2,
                            "USD",
                            true
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "tx_hash",
            header: ({ column }) => (
                <div className="mr-4">
                    <TableHeaderSorting
                        align="right"
                        header_name={"Transsdaction"}
                        column={column}
                        icon={false}
                    />
                </div>
            ),
            cell: ({ row }) => {
                const txHash: string = row.getValue("tx_hash");
                return (
                    <a
                        className="mr-4 flex items-center justify-end gap-x-2"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={row.original.transfers[0].explorers[0].url}
                    >
                        {truncate(txHash)}
                        <IconWrapper
                            icon_class_name="open_in_new"
                            class_name="h-3 w-3"
                            icon_size="text-sm text-black dark:text-white"
                        />
                    </a>
                );
            },
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
