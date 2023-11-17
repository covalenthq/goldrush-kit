import { useMemo } from "react";
import { type NetPriceDeltaProps } from "@/utils/types/atoms.types";

export const NetPriceDelta: React.FC<NetPriceDeltaProps> = ({
    numerator,
    denominator,
}) => {
    const DELTA = useMemo<number>(
        () => ((numerator - denominator) / denominator) * 100,
        [numerator, denominator]
    );

    const AMOUNT = useMemo<number>(() => (DELTA / 100) * denominator, [DELTA]);

    const SUMMARY_STRING = useMemo<string>(
        () =>
            `${DELTA.toLocaleString("en", {
                maximumFractionDigits: 2,
            })}% (${AMOUNT.toLocaleString("en", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 2,
            })})`,
        [AMOUNT, DELTA]
    );

    if (DELTA > 1) {
        return <span className="text-success">▲{SUMMARY_STRING}</span>;
    } else if (DELTA < 1) {
        return <span className="text-danger">▼{SUMMARY_STRING}</span>;
    }

    return <span>-</span>;
};
