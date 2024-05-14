import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { Skeleton } from "../ui/skeleton";

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
                    <Skeleton size={GRK_SIZES.LARGE} />
                ))}
        </div>
    );
};
