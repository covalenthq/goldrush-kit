import { Transactions } from "@/components/Shared";
import {
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type TransactionsListProps } from "@/utils/types/molecules.types";
import {
    type Transaction,
    type GoldRushResponse,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const TransactionsList: React.FC<TransactionsListProps> = ({
    chain_name,
    actionable_address,
    actionable_block,
    actionable_transaction,
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
                const { data, ...error } =
                    await goldrushClient.TransactionService.getTransactionsForBlock(
                        chain_name,
                        "latest",
                        {
                            noLogs: true,
                            quoteCurrency: "USD",
                            withSafe: false,
                        },
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                if (!data?.items) {
                    throw FALLBACK_ERROR;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: GoldRushResponse<null> | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [chain_name]);

    return (
        <Transactions
            errorMessage={errorMessage}
            maybeResult={maybeResult}
            actionable_address={actionable_address}
            actionable_block={actionable_block}
            actionable_transaction={actionable_transaction}
        />
    );
};
