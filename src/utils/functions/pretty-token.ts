export const prettyToken = (
    reserve: number,
    contract_decimals: number,
    decimals = 0
) => {
    const results = Math.pow(10, contract_decimals);

    const formattedResult = results.toLocaleString("en-US", {
        maximumFractionDigits: 0,
    });

    const resultAsNumber = Number(formattedResult.replace(/,/g, ""));

    const divisionResult = reserve / resultAsNumber;

    const formattedDivisionResult = divisionResult.toLocaleString("en-US", {
        maximumFractionDigits: decimals,
    });

    return formattedDivisionResult;
};
