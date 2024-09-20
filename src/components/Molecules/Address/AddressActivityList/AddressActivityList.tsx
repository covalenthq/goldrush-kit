import { TokenAvatar } from "@/components/Atoms";
import { Timestamp } from "@/components/Atoms";
import { TableHeaderSorting, TableList } from "@/components/Shared";
import { IconWrapper } from "@/components/Shared";
import {
    GRK_SIZES,
    DEFAULT_ERROR_MESSAGE,
} from "@/utils/constants/shared.constants";
import { type Option, None, Some } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type AddressActivityListProps } from "@/utils/types/molecules.types";
import type {
    GoldRushResponse,
    ChainActivityEvent,
} from "@covalenthq/client-sdk";
import { type ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export const AddressActivityList: React.FC<AddressActivityListProps> = ({
    address,
    maybeResult: initialMaybeResult = null,
    errorMessage: initialErrorMessage = null,
}) => {
    const { goldrushClient } = useGoldRush();
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
                        await goldrushClient.BaseService.getAddressActivity(
                            address.trim(),
                            {
                                testnets: true,
                            }
                        );
                    if (error.error) {
                        throw error;
                    }
                    setMaybeResult(new Some(data!.items));
                } catch (error: GoldRushResponse<null> | any) {
                    setErrorMessage(
                        error?.error_message ?? DEFAULT_ERROR_MESSAGE
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
                        only_primary={true}
                        primary_url={row.original.logo_url}
                        size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                        chain_color={row.original.color_theme?.hex}
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
            cell: ({ row }) => (
                <Timestamp
                    timestamp={row.getValue("last_seen_at")}
                    defaultType="relative"
                />
            ),
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
                    <IconWrapper icon_class_name="check_circle" />
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
