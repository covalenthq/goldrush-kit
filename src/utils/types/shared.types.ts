import { type Option } from "@/utils/option";
import type {
    NftApprovalsItem,
    TokensApprovalItem,
} from "@covalenthq/client-sdk";
import { type Pagination, type Transaction } from "@covalenthq/client-sdk";
import {
    type Column,
    type ColumnDef,
    type Row,
    type SortingState,
} from "@tanstack/react-table";

export interface BalancePriceDeltaProps {
    numerator: number;
    denominator: number;
}

export interface CardDetailProps {
    heading?: React.ReactNode;
    content?: React.ReactNode;
    subtext?: React.ReactNode;
    wrapperClassName?: string;
}

export interface CopyImageProps {
    url: string;
}

export interface IconWrapperProps {
    class_name?: string;
    icon_class_name?: string;
    on_click?: (e?: React.MouseEvent) => void;
    icon_size?: string;
    icon_type?: string;
}

export interface TransactionsProps {
    maybeResult: Option<Transaction[] | null>;
    errorMessage: string | null;
    actionable_transaction?: (tx_hash: string | null) => ActionableType;
    actionable_block?: (block_height: number | null) => ActionableType;
    actionable_address?: (address: string | null) => ActionableType;
}

export interface TokenApprovalsTableProps {
    maybeResult: Option<TokensApprovalItem[] | null>;
    errorMessage: string | null;
}

export interface NFTApprovalsTableProps {
    maybeResult: Option<NftApprovalsItem[] | null>;
    errorMessage: string | null;
}

export interface SkeletonTableProps {
    rows?: number;
    cols?: number;
    float?: "right" | "left";
}

export interface TableHeaderSortingProps<T> {
    header: string;
    column: Column<T, unknown>;
    align: "left" | "right" | "center";
    icon?: boolean;
}

export interface TableListProps<T> extends Partial<PaginationFooterProps> {
    maybeData: Option<T[] | null>;
    columns: ColumnDef<T>[];
    row_selection_state?: Record<string, boolean>;
    sorting_state?: SortingState;
    errorMessage: string | null;
    customRows?: (
        row: Row<T>[],
        defaultRow: (row: Row<T>) => React.ReactNode
    ) => React.ReactNode[];
}

export interface PaginationFooterProps {
    disabled?: boolean;
    pagination: Pagination | null;
    onChangePaginationHandler: (updatedPagination: Pagination) => void;
}

export interface HeadingProps
    extends React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
    > {
    size: 1 | 2 | 3 | 4;
}

export type ActionableType<
    T extends
        | keyof JSX.IntrinsicElements
        | React.ComponentType<any> = keyof JSX.IntrinsicElements,
> =
    | (T extends keyof JSX.IntrinsicElements
          ? { parent: T; parentProps: JSX.IntrinsicElements[T] }
          : { parent: T; parentProps: React.ComponentProps<T> })
    | null;
