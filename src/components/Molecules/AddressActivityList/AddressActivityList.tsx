import { type Option, None, Some } from "@/utils/option";
import { type ChainActivityEvent } from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { timestampParser } from "@/utils/functions";
import { TokenAvatar } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { IconWrapper } from "@/components/Shared";
import {
    GRK_SIZES,
    defaultErrorMessage,
} from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type AddressActivityListProps } from "@/utils/types/molecules.types";
import { CovalentAPIError } from "@/utils/types/shared.types";

export const AddressActivityList: React.FC<AddressActivityListProps> = ({
    address,
    maybeResult: initialMaybeResult = null,
    errorMessage: initialErrorMessage = null,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<ChainActivityEvent[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        initialErrorMessage
    );

    useEffect(() => {
        if (initialErrorMessage) {
            setErrorMessage(initialErrorMessage);
        }
    }, [initialErrorMessage]);

    useEffect(() => {
        if (initialMaybeResult) {
            setMaybeResult(initialMaybeResult);
        }
    }, [initialMaybeResult]);

    useEffect(() => {
        (async () => {
            if (!initialMaybeResult) {
                try {
                    setMaybeResult(None);
                    setErrorMessage(null);
                    const { data, ...error } =
                        await covalentClient.BaseService.getAddressActivity(
                            address.trim(),
                            {
                                testnets: true,
                            }
                        );
                    if (error.error) {
                        throw error;
                    }
                    setMaybeResult(new Some(data.items));
                } catch (error: CovalentAPIError | any) {
                    setErrorMessage(
                        error?.error_message ?? defaultErrorMessage
                    );
                    setMaybeResult(new Some(null));
                    console.error(error);
                }
            }
        })();
    }, [address, initialMaybeResult]);

    const columns: ColumnDef<ChainActivityEvent>[] = [
        {
            accessorKey: "label",
            id: "label",
            header: ({ column }) => (
                <TableHeaderSorting<ChainActivityEvent>
                    align="left"
                    header="Chain Name"
                    column={column}
                />
            ),
            cell: ({ row }) => (
                <div className="flex items-center gap-x-1">
                    <TokenAvatar
                        is_chain_logo={true}
                        token_url={row.original.logo_url}
                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                    />
                    {row.getValue("label")}
                </div>
            ),
        },
        {
            accessorKey: "last_seen_at",
            id: "last_seen_at",
            header: ({ column }) => (
                <TableHeaderSorting<ChainActivityEvent>
                    align="left"
                    header="Last Active"
                    column={column}
                />
            ),
            cell: ({ row }) =>
                timestampParser(row.getValue("last_seen_at"), "relative"),
        },
        {
            accessorKey: "is_testnet",
            id: "is_testnet",
            header: ({ column }) => (
                <TableHeaderSorting<ChainActivityEvent>
                    align="center"
                    header="Mainnet"
                    column={column}
                />
            ),
            cell: ({ row }) =>
                !row.getValue("is_testnet") ? (
                    <IconWrapper icon_class_name="playlist_add_check" />
                ) : (
                    <></>
                ),
        },
    ];

    return (
        <TableList<ChainActivityEvent>
            columns={columns}
            errorMessage={errorMessage}
            maybeData={maybeResult}
        />
    );
};
