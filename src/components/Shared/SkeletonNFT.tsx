import { Skeleton } from "../ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";

export const SkeletonNFT: React.FC = () => {
    return (
        <div className="flex flex-col gap-4">
            <Skeleton
                key={Math.random()}
                isNFT
                size={GRK_SIZES.EXTRA_EXTRA_SMALL}
            />

            {Array(2)
                .fill(null)
                .map(() => (
                    <Skeleton key={Math.random()} size={GRK_SIZES.LARGE} />
                ))}
        </div>
    );
};
