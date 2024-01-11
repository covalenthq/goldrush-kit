export const handleExchangeType = (transaction: any, token_num: number) => {
    if (token_num === 0) {
        if (transaction.amount_0_in === "0") {
            return "in";
        }
        if (transaction.amount_0_out === "0") {
            return "out";
        }
    }
    if (token_num === 1) {
        if (transaction.amount_1_in === "0") {
            return "in";
        }

        if (transaction.amount_1_out === "0") {
            return "out";
        }
    }
};
