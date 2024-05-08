import { type Option, None, Some } from "@/utils/option";
import { type ChainActivityEvent } from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { AccountCard } from "@/components/Molecules";
import { Skeleton } from "@/components/ui/skeleton";
import { timestampParser } from "@/utils/functions";
import { TokenAvatar } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { IconWrapper } from "@/components/Shared";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type AddressActivityListViewProps } from "@/utils/types/organisms.types";

export const AddressActivityListView: React.FC<
    AddressActivityListViewProps
> = ({ address }) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setResult] =
        useState<Option<ChainActivityEvent[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.BaseService.getAddressActivity(
                        address.trim(),
                        {
                            testnets: true,
                        }
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
    }, [address]);

    const columns: ColumnDef<ChainActivityEvent>[] = [
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
                    <div className="flex items-center gap-x-1">
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
                const t = (row.getValue("last_seen_at") as string).toString();

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

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap place-content-between gap-2">
                <AccountCard address={address} />
                <div className="w-full rounded border border-secondary-light p-2 dark:border-secondary-dark md:max-w-60 lg:max-w-60">
                    <div className="flex place-content-between items-center space-x-1">
                        {" "}
                        <span>Mainnet Chains Active</span>{" "}
                        <span className="text-secondary-light dark:text-secondary-dark">
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
                        <span className="text-secondary-light dark:text-secondary-dark">
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

            <TableList<ChainActivityEvent>
                columns={columns}
                errorMessage={errorMessage}
                maybeData={maybeResult}
            />
        </div>
    );
};
