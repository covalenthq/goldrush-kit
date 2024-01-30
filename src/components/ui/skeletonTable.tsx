import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { Skeleton } from "./skeleton";
import { TableCell, TableRow } from "./table";

interface SkeletonTableProps {
    rows?: number;
    cols?: number;
    float?: "right" | "left";
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
    rows = 10,
    cols = 6,
    float = "left",
}) => {
    return (
        <>
            {[...Array(rows)].map((_, index) => (
                <TableRow key={index}>
                    <TableCell className="h-12 text-center"></TableCell>
                    <TableCell className="h-12 text-right">
                        <div className="float-left">
                            <Skeleton size={GRK_SIZES.LARGE} />
                        </div>
                    </TableCell>
                    {[...Array(cols)].map((_, colIndex) => (
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
