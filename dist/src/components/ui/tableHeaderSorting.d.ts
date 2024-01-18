import { type Column } from "@tanstack/react-table";
export interface TableHeaderSortingProps {
    header_name: string;
    column: Column<any, unknown>;
    align: "left" | "right" | "center";
}
export declare const TableHeaderSorting: ({ header_name, column, align, }: TableHeaderSortingProps) => import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=tableHeaderSorting.d.ts.map