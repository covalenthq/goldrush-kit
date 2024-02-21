import { type BalancePriceDeltaProps } from "@/utils/types/shared.types";
import { useMemo } from "react";

const BalancePriceDelta: React.FC<BalancePriceDeltaProps> = ({
    numerator,
    denominator,
}) => {
    const DELTA = useMemo<number>(
        () => (1.0 - numerator / denominator) * 100,
        [numerator, denominator]
    );

    if (DELTA > 0) {
        return (
            <span className="text-success">
                ▲{DELTA.toLocaleString("en", { maximumFractionDigits: 2 })}%
            </span>
        );
    } else if (DELTA < 0) {
        return (
            <span className="text-danger">
                ▼{DELTA.toLocaleString("en", { maximumFractionDigits: 2 })}%
            </span>
        );
    }

    return (
        <span>
            {DELTA === 0
                ? "-"
                : DELTA.toLocaleString("en", { maximumFractionDigits: 2 }) +
                  "%"}{" "}
        </span>
    );
};

export default BalancePriceDelta;
