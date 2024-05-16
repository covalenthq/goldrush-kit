import { type Option, None, Some } from "@/utils/option";
import type { NftApprovalsItem } from "@covalenthq/client-sdk";
import { type TokensApprovalItem } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type NFTApprovalsProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { defaultErrorMessage } from "@/utils/constants/shared.constants";
import { NFTApprovalsTable } from "@/components/Shared/NFTTokenApprovals";

export const NFTApprovals: React.FC<NFTApprovalsProps> = ({
    chain_name,
    address,
    ...props
}) => {
    const { covalentClient } = useGoldRush();

    const [maybeResult, setMaybeResult] =
        useState<Option<NftApprovalsItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.SecurityService.getNftApprovals(
                        chain_name,
                        address.trim()
                    );
                if (error.error) {
                    throw error;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name, address]);

    return (
        <NFTApprovalsTable
            {...props}
            errorMessage={errorMessage}
            maybeResult={maybeResult}
        />
    );
};
