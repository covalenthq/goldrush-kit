import { Address, Timestamp } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import {
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { actionableWrapper } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TransactionsListProps } from "@/utils/types/molecules.types";
import {
    calculatePrettyBalance,
    type Transaction,
    type GoldRushResponse,
    timestampParser,
} from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const TransactionsList: React.FC<TransactionsListProps> = ({
    chain_name,
    actionable_block = () => null,
    actionable_transaction,
    actionable_address,
}) => {
    const { goldrushClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setMaybeResult] =
        useState<Option<Transaction[] | null>>(None);

    useEffect(() => {
        (async () => {
            try {
                setMaybeResult(None);
                setErrorMessage(null);
                const { data: blockData, ...blockError } =
                    await goldrushClient.BaseService.getBlockHeightsByPage(
                        chain_name,
                        timestampParser(new Date(), "YYYY MM DD"),
                        "2100-01-01",
                        {
                            pageSize: 1,
                        },
                    );
                if (blockError.error) {
                    setErrorMessage(blockError.error_message);
                    throw blockError;
                }
                if (!blockData?.items?.[0]) {
                    throw FALLBACK_ERROR;
                }
                const latestBlock = blockData.items[0];
                const { data: txData, ...txError } =
                    await goldrushClient.TransactionService.getTransactionsForBlock(
                        chain_name,
                        Number(latestBlock.height) - 2,
                        {
                            noLogs: true,
                            quoteCurrency: "USD",
                            withSafe: false,
                        },
                    );
                if (txError.error) {
                    setErrorMessage(txError.error_message);
                    throw txError;
                }
                if (!txData?.items) {
                    throw FALLBACK_ERROR;
                }
                setMaybeResult(new Some(txData.items));
            } catch (error: GoldRushResponse<null> | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name]);

    const columns: ColumnDef<Transaction>[] = [
        {
            accessorKey: "tx_hash",
            id: "tx_hash",
            header: "Transaction Hash",
            cell: ({ row }) => (
                <Address
                    address={row.original.tx_hash}
                    actionable_address={actionable_transaction}
                />
            ),
        },
        {
            accessorKey: "block_signed_at",
            id: "block_signed_at",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header="Signed At"
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <Timestamp
                    timestamp={row.original.block_signed_at}
                    defaultType="relative"
                />
            ),
        },
        {
            accessorKey: "block_height",
            id: "block_height",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header="Block Height"
                    column={column}
                />
            ),
            cell: ({ row }) =>
                actionableWrapper(
                    actionable_block(row.original.block_height),
                    row.original.block_height?.toLocaleString(),
                ),
        },
        {
            accessorKey: "from",
            id: "from",
            header: "From",
            cell: ({ row }) => (
                <Address
                    address={row.original.from_address}
                    avatar={{}}
                    actionable_address={actionable_address}
                />
            ),
        },
        {
            accessorKey: "to",
            id: "to",
            header: "To",
            cell: ({ row }) => (
                <Address
                    address={row.original.to_address}
                    avatar={{}}
                    actionable_address={actionable_address}
                />
            ),
        },
        {
            accessorKey: "value",
            id: "value",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header="Value"
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div>
                    {calculatePrettyBalance(
                        row.original.value ?? 0,
                        row.original.gas_metadata?.contract_decimals,
                        true,
                        4,
                    )}{" "}
                    {row.original.gas_metadata?.contract_ticker_symbol}
                    <p className="text-xs opacity-80">
                        {row.original.pretty_value_quote}
                    </p>
                </div>
            ),
        },
        {
            accessorKey: "tx_fee",
            id: "tx_fee",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header="Fee"
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div>
                    {calculatePrettyBalance(
                        BigInt(row.original.fees_paid || 0)!,
                        row.original.gas_metadata?.contract_decimals,
                        true,
                        4,
                    )}{" "}
                    {row.original.gas_metadata?.contract_ticker_symbol}
                    <p className="text-xs opacity-80">
                        {row.original.pretty_gas_quote}
                    </p>
                </div>
            ),
        },
    ];

    return (
        <TableList<Transaction>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={maybeResult}
        />
    );
};
