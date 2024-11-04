import { Transactions } from "@/components/Shared";
import {
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { type Option, None, Some } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type MultiChainMultiAddressTransactionsProps } from "@/utils/types/molecules.types";
import type { GoldRushResponse, Transaction } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const MultiChainMultiAddressTransactions: React.FC<
    MultiChainMultiAddressTransactionsProps
> = ({
    chain_names,
    addresses,
    actionable_address,
    actionable_block,
    actionable_transaction,
}) => {
    const { goldrushClient } = useGoldRush();

    const [maybeResult, setMaybeResult] =
        useState<Option<Transaction[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await goldrushClient.AllChainsService.getMultiChainAndMultiAddressTransactions(
                        {
                            addresses,
                            chains: chain_names,
                        },
                    );
                if (error.error) {
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
    }, [chain_names, addresses]);

    return (
        <Transactions
            addresses={addresses}
            showChain
            errorMessage={errorMessage}
            maybeResult={maybeResult}
            actionable_address={actionable_address}
            actionable_block={actionable_block}
            actionable_transaction={actionable_transaction}
        />
    );
};
