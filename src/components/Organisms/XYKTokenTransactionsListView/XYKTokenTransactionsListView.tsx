import { type Option, None, Some } from "@/utils/option";
import { type ExchangeTransaction } from "@covalenthq/client-sdk";
import { POOL_TRANSACTION_MAP } from "@/utils/constants/shared.constants";
import { useEffect, useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";

import { timestampParser } from "@/utils/functions";
import { Badge } from "@/components/ui/badge";
import { type XYKTokenTransactionsListViewProps } from "@/utils/types/organisms.types";
import { useGoldRush } from "@/utils/store";
import { handleTokenTransactions } from "@/utils/functions/pretty-exchange-amount";
import { handleExchangeType } from "@/utils/functions/exchange-type";
import {
    IconWrapper,
    TableHeaderSorting,
    TableList,
} from "@/components/Shared";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const XYKTokenTransactionsListView: React.FC<
    XYKTokenTransactionsListViewProps
> = ({
    chain_name,
    dex_name,
    token_address,
    on_transaction_click,
    on_native_explorer_click,
    on_goldrush_receipt_click,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setResult] =
        useState<Option<ExchangeTransaction[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.XykService.getTransactionsForTokenAddress(
                        chain_name,
                        dex_name,
                        token_address.trim()
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setResult(new Some(data.items));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [token_address, dex_name, chain_name]);

    const columns: ColumnDef<ExchangeTransaction>[] = [
        {
            accessorKey: "block_signed_at",
            id: "block_signed_at",
            header: ({ column }) => (
                <TableHeaderSorting<ExchangeTransaction>
                    align="left"
                    header={"Signed at"}
                    column={column}
                />
            ),
            cell: ({ row }) =>
                timestampParser(row.getValue("block_signed_at"), "relative"),
        },
        {
            accessorKey: "act",
            id: "act",
            header: ({ column }) => (
                <TableHeaderSorting<ExchangeTransaction>
                    align="left"
                    header={"Transaction type"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                const token_0 = row.original.token_0;
                const token_1 = row.original.token_1;

                if (row.original.act !== "SWAP") {
                    return (
                        <div
                            className={
                                on_transaction_click
                                    ? "cursor-pointer hover:opacity-75"
                                    : ""
                            }
                            onClick={() => {
                                if (on_transaction_click) {
                                    on_transaction_click(row.original);
                                }
                            }}
                        >
                            <Badge
                                className="mr-2"
                                variant={
                                    POOL_TRANSACTION_MAP[row.original.act].color
                                }
                            >
                                {POOL_TRANSACTION_MAP[row.original.act].name}
                            </Badge>{" "}
                            {token_0.contract_ticker_symbol}{" "}
                            {row.original.act === "SWAP" ? "for" : "and"}{" "}
                            {token_1.contract_ticker_symbol}
                        </div>
                    );
                }
                const token_in =
                    handleExchangeType(row.original, 0) === "in"
                        ? token_0
                        : token_1;
                const token_out =
                    handleExchangeType(row.original, 0) === "out"
                        ? token_0
                        : token_1;
                return (
                    <div
                        className={
                            on_transaction_click
                                ? "cursor-pointer hover:opacity-75"
                                : ""
                        }
                        onClick={() => {
                            if (on_transaction_click) {
                                on_transaction_click(row.original);
                            }
                        }}
                    >
                        <Badge
                            className="mr-2"
                            variant={
                                POOL_TRANSACTION_MAP[row.original.act].color
                            }
                        >
                            {POOL_TRANSACTION_MAP[row.original.act].name}
                        </Badge>{" "}
                        {token_in.contract_ticker_symbol}{" "}
                        {row.original.act === "SWAP" ? "for" : "and"}{" "}
                        {token_out.contract_ticker_symbol}
                    </div>
                );
            },
        },
        {
            accessorKey: "total_quote",
            id: "total_quote",
            header: ({ column }) => (
                <TableHeaderSorting<ExchangeTransaction>
                    align="left"
                    header={"Total value"}
                    column={column}
                />
            ),
            cell: ({ row }) => row.original.pretty_total_quote,
        },
        {
            accessorKey: "amount_0",
            id: "amount_0",
            header: ({ column }) => (
                <TableHeaderSorting<ExchangeTransaction>
                    align="left"
                    header={"Token Amount"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                if (row.original.act !== "SWAP") {
                    return (
                        <span>
                            {handleTokenTransactions(
                                row.original.act,
                                "0",
                                row.original,
                                row.original.token_0.contract_decimals
                            )}{" "}
                            {row.original.token_0.contract_ticker_symbol}
                        </span>
                    );
                }
                const token_in =
                    handleExchangeType(row.original, 0) === "in" ? "0" : "1";
                return (
                    <span>
                        {handleTokenTransactions(
                            row.original.act,
                            token_in,
                            row.original,
                            row.original[`token_${token_in}`].contract_decimals
                        )}{" "}
                        {
                            row.original[`token_${token_in}`]
                                .contract_ticker_symbol
                        }
                    </span>
                );
            },
        },
        {
            accessorKey: "amount_1",
            id: "amount_1",
            header: ({ column }) => (
                <TableHeaderSorting<ExchangeTransaction>
                    align="left"
                    header={"Token Amount"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                if (row.original.act !== "SWAP") {
                    return (
                        <span>
                            {handleTokenTransactions(
                                row.original.act,
                                "1",
                                row.original,
                                row.original.token_1.contract_decimals
                            )}{" "}
                            {row.original.token_1.contract_ticker_symbol}
                        </span>
                    );
                }
                const token_in =
                    handleExchangeType(row.original, 0) === "out" ? "0" : "1";
                const token_amount = handleTokenTransactions(
                    row.original.act,
                    token_in,
                    row.original,
                    row.original[`token_${token_in}`].contract_decimals
                );
                return (
                    <span>
                        {token_amount}{" "}
                        {
                            row.original[`token_${token_in}`]
                                .contract_ticker_symbol
                        }
                    </span>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                if (!on_native_explorer_click && !on_goldrush_receipt_click)
                    return;
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
                                {on_native_explorer_click && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            on_native_explorer_click(
                                                row.original
                                            );
                                        }}
                                    >
                                        <IconWrapper
                                            icon_class_name="open_in_new"
                                            class_name="mr-2"
                                        />{" "}
                                        View on explorer
                                    </DropdownMenuItem>
                                )}
                                {on_goldrush_receipt_click && (
                                    <DropdownMenuItem
                                        onClick={() => {
                                            on_goldrush_receipt_click(
                                                row.original
                                            );
                                        }}
                                    >
                                        <IconWrapper
                                            icon_class_name="open_in_new"
                                            class_name="mr-2"
                                        />{" "}
                                        View goldrush receipt
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            },
        },
    ];

    return (
        <div className="space-y-4">
            <TableList<ExchangeTransaction>
                columns={columns}
                errorMessage={errorMessage}
                maybeData={maybeResult}
                sorting_state={[
                    {
                        id: "block_signed_at",
                        desc: true,
                    },
                ]}
            />
        </div>
    );
};
