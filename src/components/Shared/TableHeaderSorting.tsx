import { IconWrapper } from ".";
import { type TableHeaderSortingProps } from "@/utils/types/shared.types";

export const TableHeaderSorting: React.FC<TableHeaderSortingProps> = ({
    header_name,
    column,
    align,
    icon = true,
}) => {
    const sortedIcon =
        column.getIsSorted() === "asc"
            ? "arrow_drop_up"
            : column.getIsSorted() === "desc"
              ? "arrow_drop_down"
              : "sort";
    return (
        <div
            className={`flex cursor-pointer items-center gap-1 whitespace-nowrap ${
                align === "right"
                    ? "justify-end"
                    : align === "center"
                      ? "justify-center"
                      : ""
            }`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {header_name}
            {icon && (
                <IconWrapper
                    icon_size={sortedIcon === "sort" ? "text-base" : ""}
                    class_name="transition-all "
                    icon_class_name={sortedIcon}
                />
            )}
        </div>
    );
};
