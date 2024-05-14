import { type Option, None, Some } from "@/utils/option";
import { type Transaction } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type AddressTransactionsProps } from "@/utils/types/molecules.types";
import { Transactions } from "@/components/Shared";
import { useGoldRush } from "@/utils/store";
import { type CovalentAPIError } from "@/utils/types/shared.types";
import { defaultErrorMessage } from "@/utils/constants/shared.constants";

export const AddressTransactions: React.FC<AddressTransactionsProps> = ({
    chain_name,
    address,
    ...props
}) => {
    const { covalentClient } = useGoldRush();

    const [maybeResult, setMaybeResult] =
        useState<Option<Transaction[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.TransactionService.getAllTransactionsForAddressByPage(
                        chain_name,
                        address.trim(),
                        {
                            noLogs: true,
                            withSafe: false,
                            quoteCurrency: "USD",
                        }
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
        <Transactions
            {...props}
            errorMessage={errorMessage}
            maybeResult={maybeResult}
        />
    );
};
