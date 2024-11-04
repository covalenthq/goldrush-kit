import { IconWrapper, TableHeaderSorting, TableList } from ".";
import { Badge } from "../ui/badge";
import { Address, TokenAvatar } from "@/components/Atoms";
import { Timestamp } from "@/components/Atoms";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { actionableWrapper } from "@/utils/functions";
import { Some } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TransactionsProps } from "@/utils/types/shared.types";
import {
    calculatePrettyBalance,
    type Transaction,
} from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";

export const Transactions: React.FC<TransactionsProps> = ({
    addresses = null,
    showChain = false,
    errorMessage = null,
    maybeResult = new Some(null),
    actionable_address,
    actionable_block = () => null,
    actionable_transaction,
}) => {
    const { chains } = useGoldRush();

    const columns: ColumnDef<Transaction>[] = [
        ...(showChain
            ? [
                  {
                      id: "chain",
                      accessorKey: "chain",
                      header: ({ column }) => (
                          <TableHeaderSorting<Transaction>
                              align="left"
                              header={"Chain"}
                              column={column}
                          />
                      ),
                      cell: ({ row }) => {
                          const chain =
                              chains?.find(
                                  ({ name }) =>
                                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                      // @ts-expect-error
                                      name === row.original.chain_name,
                              ) || null;

                          if (!chain) return <></>;

                          return (
                              <TokenAvatar
                                  only_primary
                                  size={GRK_SIZES.EXTRA_SMALL}
                                  primary_url={chain.logo_url}
                                  chain_color={chain.color_theme?.hex}
                              />
                          );
                      },
                  } as ColumnDef<Transaction>,
              ]
            : []),
        {
            id: "tx_hash",
            accessorKey: "tx_hash",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"Transaction Hash"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <Address
                    address={row.original.tx_hash}
                    actionable_address={actionable_transaction}
                />
            ),
        },
        {
            id: "block_height",
            accessorKey: "block_height",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"Block Height"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <p>
                        {actionableWrapper(
                            actionable_block(row.original.block_height),
                            row.original.block_height?.toLocaleString(),
                        )}
                    </p>
                );
            },
        },
        {
            id: "block_signed_at",
            accessorKey: "block_signed_at",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"Signed At"}
                    column={column}
                />
            ),
            cell: ({ row }) => {
                return (
                    <Timestamp
                        timestamp={row.original.block_signed_at}
                        defaultType="relative"
                    />
                );
            },
        },
        {
            id: "from_address",
            accessorKey: "from_address",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"From"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <Address
                    label={row.original.from_address_label}
                    avatar={{}}
                    address={row.original.from_address}
                    actionable_address={actionable_address}
                />
            ),
        },
        {
            id: "in_out",
            accessorKey: "in_out",
            header: () => null,
            cell: ({ row }) => {
                const matchAddress = (
                    addr: string | null,
                ): "OUT" | "IN" | null => {
                    const formattedAddr = addr?.toLowerCase();
                    const fromAddr = row.original.from_address?.toLowerCase();
                    const toAddr = row.original.to_address?.toLowerCase();

                    return formattedAddr === fromAddr
                        ? "OUT"
                        : formattedAddr === toAddr
                          ? "IN"
                          : null;
                };

                const match: "OUT" | "IN" | null = Array.isArray(addresses)
                    ? (addresses
                          .map((addr) => addr?.toLowerCase())
                          .map(matchAddress)
                          .find((result) => result !== null) ?? null)
                    : null;

                return (
                    <div className="w-10 flex justify-center">
                        <Badge
                            variant={
                                match === "OUT"
                                    ? "danger"
                                    : match === "IN"
                                      ? "success"
                                      : "ghost"
                            }
                        >
                            {match || (
                                <IconWrapper
                                    icon_class_name="arrow_right_alt"
                                    class_name="opacity-60 text-foreground-light dark:text-foreground-dark"
                                />
                            )}
                        </Badge>
                    </div>
                );
            },
        },
        {
            id: "to_address",
            accessorKey: "to_address",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="left"
                    header={"To"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <Address
                    label={row.original.to_address_label}
                    avatar={{}}
                    address={row.original.to_address}
                    actionable_address={actionable_address}
                />
            ),
        },
        {
            id: "value",
            accessorKey: "value",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="right"
                    header={"Value"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {`${calculatePrettyBalance(
                        row.original.value ?? 0,
                        row.original.gas_metadata?.contract_decimals,
                        true,
                        4,
                    )} ${row.original.gas_metadata?.contract_ticker_symbol}`}
                    <p className="text-xs opacity-80">
                        {row.original.pretty_value_quote}
                    </p>
                </div>
            ),
        },
        {
            id: "fees_paid",
            accessorKey: "fees_paid",
            header: ({ column }) => (
                <TableHeaderSorting<Transaction>
                    align="right"
                    header={"Fees Paid"}
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="text-right">
                    {calculatePrettyBalance(
                        row.original.fees_paid ?? 0,
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
            sorting_state={[
                {
                    id: "block_signed_at",
                    desc: true,
                },
            ]}
        />
    );
};
