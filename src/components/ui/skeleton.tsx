import { useCallback } from "react";
import { type GRK_SIZES } from "@/utils/constants/shared.constants";
import { cn } from "@/utils/functions";

function Skeleton({
    className,
    isNFT,
    size,
    ...props
}: React.HTMLAttributes<HTMLDivElement> & {
    isNFT?: boolean;
    size: GRK_SIZES;
}) {
    const sizeClass = useCallback((): string => {
        switch (size) {
            case "lg":
                return "w-28 h-8";
            case "md":
                return "w-12 h-5";
            case "sm":
                return "w-10 h-5";
            case "xs":
                return "w-8 h-5";
            case "xxs":
                return "w-5 h-5";
            default:
                return "w-28 h-5";
        }
    }, []);

    return (
        <div
            className={cn(
                "animate-pulse rounded border bg-secondary-light dark:bg-secondary-dark",
                isNFT ? "h-[280px] w-[230px]" : sizeClass(),
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };
