/// <reference types="react" />
import { type GRK_SIZES } from "@/utils/constants/shared.constants";
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    size: GRK_SIZES;
    isNFT?: boolean;
}
declare function Skeleton({ size, isNFT }: SkeletonProps): import("react/jsx-runtime").JSX.Element;
export { Skeleton };
//# sourceMappingURL=skeleton.d.ts.map