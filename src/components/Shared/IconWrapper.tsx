import { type IconWrapperProps } from "@/utils/types/shared.types";

export const IconWrapper: React.FC<IconWrapperProps> = ({
    class_name,
    icon_class_name,
    on_click,
    icon_size,
    icon_type,
}) => {
    return (
        <span
            role={"presentation"}
            className={`flex items-center justify-center ${class_name ?? ""}`}
            onClick={on_click}
        >
            <span
                className={`material-symbols-${icon_type || "outlined"} ${
                    icon_size || ""
                }`}
            >
                {icon_class_name}
            </span>
        </span>
    );
};
