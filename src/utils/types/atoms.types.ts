import { type GRK_SIZES } from "../constants/shared.constants";

export interface AddressProps {
    address: string;
}

export interface AddressAvatarProps {
    address: string;
    type: "fingerprint" | "effigy" | "wallet";
    size: GRK_SIZES;
    rounded?: boolean;
    fallback?: string;
    className?: string;
}

export interface AvatarGroupProps {
    groupClassName?: string;
    iconClassName?: string;
    titleClassName?: string;
    title?: string;
    chainText?: string;
    show?: number;
    isCountShown?: boolean;
    iconList?: Array<{ url: string; bgColor: string }>;
    fallbackTitle?: Array<string>;
    rounded?: boolean;
}

export interface BalancePriceDeltaProps {
    numerator: number;
    denominator: number;
}

export interface CopyImageProps {
    url: string;
}

export interface IconWrapperPropsType {
    //   icon: string;
    //   alt: string;
    className?: string;
    iconClassName?: string;
    onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
    iconSize?: string;
    iconType?: string;
}

export interface MultiSelectDropDownProps {
    className?: string;
    label?: React.ReactNode;
    search?: React.ReactNode;
    childrenClassName?: string;
    arrowClassName?: string;
    menuClassName?: string;
    isOpen?: boolean;
    handleOpen?: (val: boolean) => void;
    showBalance?: boolean;
    chainsList?: any;
    chainsBalances?: any;
    searchPlaceholder?: string;
    address?: string;
    position?: "left" | "right";
}

export interface NetPriceDeltaProps {
    numerator: number;
    denominator: number;
}

export interface SelectDropDownProps {
    className?: string;
    label?: React.ReactNode;
    search?: React.ReactNode;
    childrenClassName?: string;
    arrowClassName?: string;
    menuClassName?: string;
    isOpen?: boolean;
    handleOpen?: (val: boolean) => void;
    showBalance?: boolean;
    chainsList?: any;
    chainsBalances?: any;
    searchPlaceholder?: string;
    address?: string;
    position?: "left" | "right";
}

export interface TokenAvatarProps {
    tokenUrl?: string | null;
    subUrl?: string | null;
    size: GRK_SIZES;
    isChainLogo?: boolean;
    chainColor?: string | null;
}
