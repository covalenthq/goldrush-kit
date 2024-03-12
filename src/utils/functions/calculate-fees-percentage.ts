export function calculateFeePercentage(number: number) {
    const sign = number > 0 ? "+" : "";

    const formattedPercentage = `${sign}${(number * 100).toFixed(2)}%`;

    return formattedPercentage;
}
