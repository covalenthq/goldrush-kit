import { type Option, None, Some } from "@/utils/option";
import { type TokensApprovalItem } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type TokenApprovalsProps } from "@/utils/types/molecules.types";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { defaultErrorMessage } from "@/utils/constants/shared.constants";
import { TokenApprovalsTable } from "@/components/Shared/TokenApprovalsTable";

export const TokenApprovals: React.FC<TokenApprovalsProps> = ({
    chain_name,
    address,
    ...props
}) => {
    const { covalentClient } = useGoldRush();

    const [maybeResult, setMaybeResult] =
        useState<Option<TokensApprovalItem[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.SecurityService.getApprovals(
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
        <TokenApprovalsTable
            {...props}
            errorMessage={errorMessage}
            maybeResult={maybeResult}
        />
    );
};
