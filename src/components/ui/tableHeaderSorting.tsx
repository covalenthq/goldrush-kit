import { type Column } from "@tanstack/react-table";
import { IconWrapper } from "../Atoms/IconWrapper/IconWrapper";

export interface TableHeaderSortingProps {
    header_name: string;
    column: Column<any, unknown>;
    align: "left" | "right" | "center";
}

export const TableHeaderSorting = ({
    header_name,
    column,
    align,
}: TableHeaderSortingProps) => {
    const sortedIcon =
        column.getIsSorted() === "asc"
            ? "arrow_drop_up"
            : column.getIsSorted() === "desc"
              ? "arrow_drop_down"
              : "sort";
    return (
        <div
            className={`flex cursor-pointer items-center gap-1 whitespace-nowrap hover:text-text-color-900 dark:hover:text-text-color-50  ${
                align === "right"
                    ? "justify-end"
                    : align === "center"
                      ? "justify-center"
                      : ""
            }`}
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {header_name}
            <IconWrapper
                iconSize={sortedIcon === "sort" ? "text-base" : ""}
                className="transition-all "
                iconClassName={sortedIcon}
            />
        </div>
    );
};
