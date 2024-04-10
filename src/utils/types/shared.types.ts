import { type Transaction } from "@covalenthq/client-sdk";
import { type Option } from "@/utils/option";

export interface BalancePriceDeltaProps {
    numerator: number;
    denominator: number;
}

export interface CopyImageProps {
    url: string;
}

export interface IconWrapperProps {
    class_name?: string;
    icon_class_name?: string;
    on_click?: (e?: React.MouseEvent<HTMLDivElement>) => void;
    icon_size?: string;
    icon_type?: string;
}

export interface TransactionsProps {
    on_native_explorer_click?: Function;
    on_goldrush_receipt_click?: Function;
    on_transaction_click?: Function;
    maybeResult: Option<Transaction[]>;
    errorMessage: string | null;
}
