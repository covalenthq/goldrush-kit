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
