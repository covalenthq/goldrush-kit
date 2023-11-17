const LESS_THAN_ZERO = "<$0.01";
const ZERO_USD = "$0.00";

export const prettyCurrency = (
    val: any,
    decimals = 2,
    currency = "USD",
    ignoreSmallVal = false,
    ignoreMinus = true,
    ignoreZero = false
) => {
    if (typeof val === "string") {
        val = Number(val);
    }
    let minus = "";
    let currencySuffix = "";

    // pass ignoreMinus false to get the negative number for currency formatter
    if (!ignoreMinus && val < 0) {
        val = Math.abs(val);
        minus = "-";
    }
    if (val === 1) {
        return "$1.00";
    }
    if (val === 0 || !val) {
        // if value is 0, pass ignoreZero true to get this string "<$0.01"
        if (ignoreZero) {
            return LESS_THAN_ZERO;
        } else {
            return ZERO_USD;
        }
    } else if (val < 0 || val < 1) {
        if (val < 0.01 && !ignoreSmallVal) {
            return LESS_THAN_ZERO;
        }
    } else if (val > 999999999) {
        val = val / 1000000000;
        currencySuffix = "B";
    } else if (val > 999999) {
        val = val / 1000000; // convert to M for number from > 1 million
        currencySuffix = "M";
    }
    // Added to round down the number
    const expo = Math.pow(10, decimals);
    val = Math.floor(val * expo) / expo;
    const _val = val.toLocaleString("en-US", {
        style: "currency",
        currency: currency,
        maximumFractionDigits: decimals,
        currencyDisplay: "symbol",
    });
    if (!_val.includes("$")) {
        return minus + "$" + _val + currencySuffix;
    }
    if (decimals === 2 && _val.includes(".") && _val.endsWith(".00")) {
        return minus + _val.slice(0, -3) + currencySuffix;
    }
    return minus + _val + currencySuffix;
};
