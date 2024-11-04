import { Address } from "@/components/Atoms";
import { Timestamp } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import {
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { actionableWrapper } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type BlocksListProps } from "@/utils/types/molecules.types";
import {
    type Block,
    type Pagination,
    type GoldRushResponse,
    timestampParser,
} from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const BlocksList: React.FC<BlocksListProps> = ({
    chain_name,
    page_number = 0,
    page_size = 10,
    actionable_block = () => null,
    on_page_change = () => null,
}) => {
    const { goldrushClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setMaybeResult] =
        useState<Option<Block[] | null>>(None);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    useEffect(() => {
        updateResult(null);
    }, [chain_name, page_size]);

    const updateResult = async (_pagination: Pagination | null) => {
        try {
            setMaybeResult(None);
            setErrorMessage(null);
            const { data, ...error } =
                await goldrushClient.BaseService.getBlockHeightsByPage(
                    chain_name,
                    timestampParser(new Date(), "YYYY-MM-DD"),
                    "latest",
                    {
                        pageNumber: _pagination?.page_number ?? page_number,
                        pageSize: _pagination?.page_size ?? page_size,
                    },
                );
            if (error.error) {
                throw error;
            }
            if (!data?.items || !data?.pagination) {
                throw FALLBACK_ERROR;
            }
            on_page_change(data.pagination);
            setPagination(data.pagination);
            setMaybeResult(new Some(data.items));
        } catch (error: GoldRushResponse<null> | any) {
            setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
            setMaybeResult(new Some(null));
            console.error(error);
        }
    };

    const columns: ColumnDef<Block>[] = [
        {
            accessorKey: "height",
            id: "height",
            header: ({ column }) => (
                <TableHeaderSorting<Block>
                    align="left"
                    header="Height"
                    column={column}
                />
            ),
            cell: ({ row }) =>
                actionableWrapper(
                    actionable_block(row.original.height),
                    row.original.height?.toLocaleString(),
                ),
        },
        {
            accessorKey: "signed_at",
            id: "signed_at",
            header: ({ column }) => (
                <TableHeaderSorting<Block>
                    align="left"
                    header="Signed At"
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <Timestamp
                    timestamp={row.original.signed_at}
                    defaultType="relative"
                />
            ),
        },
        {
            accessorKey: "block_hash",
            id: "block_hash",
            header: ({ column }) => (
                <TableHeaderSorting<Block>
                    align="left"
                    header="Block Hash"
                    column={column}
                />
            ),
            cell: ({ row }) => <Address address={row.original.block_hash} />,
        },
        {
            accessorKey: "gas_used",
            id: "gas_used",
            header: ({ column }) => (
                <TableHeaderSorting<Block>
                    align="left"
                    header="Gas Used"
                    column={column}
                />
            ),
            cell: ({ row }) =>
                `${((Number(row.original.gas_used) / Number(row.original.gas_limit)) * 100).toFixed(2)}%`,
        },
        {
            accessorKey: "gas_limit",
            id: "gas_limit",
            header: ({ column }) => (
                <TableHeaderSorting<Block>
                    align="left"
                    header="Gas Limit"
                    column={column}
                />
            ),
            cell: ({ row }) => row.original.gas_limit?.toLocaleString(),
        },
    ];

    return (
        <TableList<Block>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={maybeResult}
            pagination={pagination}
            onChangePaginationHandler={updateResult}
        />
    );
};
