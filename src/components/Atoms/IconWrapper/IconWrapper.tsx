import { type IconWrapperPropsType } from "@/utils/types/atoms.types";

export const IconWrapper: React.FC<IconWrapperPropsType> = ({
    className,
    iconClassName,
    onClick,
    iconSize,
    iconType,
}) => {
    return (
        <div
            role={"presentation"}
            className={`flex items-center justify-center ${className ?? ""}`}
            onClick={onClick}
        >
            <span
                className={`material-symbols-${iconType || "outlined"} ${
                    iconSize || ""
                }`}
            >
                {iconClassName}
            </span>
        </div>
    );
};
