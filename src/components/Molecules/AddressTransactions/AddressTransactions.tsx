import { type Option, None, Some } from "@/utils/option";
import { type Transaction } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { type AddressTransactionsProps } from "@/utils/types/molecules.types";
import { Transactions } from "@/components/Shared";
import { useGoldRush } from "@/utils/store";

export const AddressTransactions: React.FC<AddressTransactionsProps> = ({
    chain_name,
    address,
    ...props
}) => {
    const { covalentClient } = useGoldRush();

    const [maybeResult, setResult] = useState<Option<Transaction[]>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setResult(None);
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
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setResult(new Some(data.items));
            } catch (exception) {
                console.error(exception);
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
