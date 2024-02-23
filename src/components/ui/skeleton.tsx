import { type GRK_SIZES } from "@/utils/constants/shared.constants";
import { cn } from "../../utils/functions";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    size: GRK_SIZES;
    isNFT?: boolean;
}

function Skeleton({ size, isNFT = false }: SkeletonProps) {
    const sizeClass = (() => {
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
    })();

    return (
        <div
            className={cn(
                "bg-secondary-light animate-pulse rounded",
                isNFT ? "h-[280px] w-[230px]" : sizeClass
            )}
        />
    );
}

export { Skeleton };
