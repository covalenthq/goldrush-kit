import { IconWrapper } from ".";
import { type TableHeaderSortingProps } from "@/utils/types/shared.types";

export const TableHeaderSorting: <T>(
    props: TableHeaderSortingProps<T>
) => React.ReactNode = ({ header, column, align, icon = true }) => {
    const sortedIcon =
        column.getIsSorted() === "asc"
            ? "arrow_drop_up"
            : column.getIsSorted() === "desc"
              ? "arrow_drop_down"
              : "sort";
    return (
        <div
            className={`group flex cursor-pointer items-center gap-1 whitespace-nowrap ${
                align === "right"
                    ? "justify-end"
                    : align === "center"
                      ? "justify-center"
                      : ""
            }`}
        >
            <span className="transition-all group-hover:underline">
                {header}
            </span>

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
