import { prettyToken } from "./pretty-token";

export const handleTokenTransactions = (
    type: string,
    token_num: string,
    transaction: any,
    contract_decimals: number
) => {
    if (type === "SWAP") {
        if (token_num === "0") {
            if (transaction.amount_0_in !== "0") {
                return prettyToken(
                    transaction[`amount_${token_num}_in`],
                    contract_decimals,
                    4
                );
            }
            return prettyToken(
                transaction[`amount_${token_num}_out`],
                contract_decimals,
                4
            );
        }
        if (token_num === "1") {
            if (transaction.amount_1_in !== "0") {
                return prettyToken(
                    transaction[`amount_${token_num}_in`],
                    contract_decimals,
                    4
                );
            }
            return prettyToken(
                transaction[`amount_${token_num}_out`],
                contract_decimals,
                4
            );
        }
    } else {
        if (token_num === "0") {
            return prettyToken(
                transaction[`amount_${token_num}`],
                contract_decimals,
                4
            );
        }
        if (token_num === "1") {
            return prettyToken(
                transaction[`amount_${token_num}`],
                contract_decimals,
                4
            );
        }
    }
};
