import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";
import { type SkeletonTableProps } from "@/utils/types/shared.types";

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
    rows = 10,
    cols = 6,
    float = "left",
}) => {
    return (
        <>
            {[...Array(rows - 1)].map((_, index) => (
                <TableRow key={index}>
                    <TableCell className="h-12 text-right">
                        <div className="float-left">
                            <Skeleton size={GRK_SIZES.LARGE} />
                        </div>
                    </TableCell>
                    {[...Array(cols - 1)].map((_, colIndex) => (
                        <TableCell key={colIndex} className="h-12 text-right">
                            <div className={`float-${float}`}>
                                <Skeleton size={GRK_SIZES.LARGE} />
                            </div>
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );
};
