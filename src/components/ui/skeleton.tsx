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
                return "w-[100px] h-[30px]";
            case "md":
                return "w-[50px] h-[20px]";
            case "sm":
                return "w-[40px] h-[20px]";
            case "xs":
                return "w-[30px] h-[20px]";
            case "xxs":
                return "w-[20px] h-[20px]";
            default:
                return "w-[100px] h-[20px]";
        }
    }, []);

    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-secondary-light dark:bg-secondary-dark",
                isNFT ? "h-[280px] w-[230px]" : sizeClass(),
                className
            )}
            {...props}
        />
    );
}

export { Skeleton };
