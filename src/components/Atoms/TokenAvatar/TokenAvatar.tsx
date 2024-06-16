import { useEffect, useMemo, useRef } from "react";
import { type TokenAvatarProps } from "@/utils/types/atoms.types";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import DefaultToken from "@/static/avatar/default-token.svg";
import { Avatar } from "@/components/ui/avatar";
import { themedSvg } from "@/utils/functions";

export const TokenAvatar: React.FC<TokenAvatarProps> = ({
    primary_url,
    secondary_url,
    size = GRK_SIZES.SMALL,
    only_primary = false,
    chain_color,
    rounded = true,
}) => {
    const primaryRef = useRef<HTMLSpanElement>(null);
    const secondaryRef = useRef<HTMLSpanElement>(null);

    const PRIMARY_SIZE = useMemo<string>(() => {
        switch (size) {
            case GRK_SIZES.EXTRA_EXTRA_SMALL:
                return "w-6 h-6";
            case GRK_SIZES.EXTRA_SMALL:
                return "w-8 h-8";
            case GRK_SIZES.SMALL:
                return "w-12 h-12";
            case GRK_SIZES.MEDIUM:
                return "w-20 h-20";
            case GRK_SIZES.LARGE:
                return "w-24 h-24";
        }
    }, [size]);

    const SECONDARY_SIZE = useMemo<string>(() => {
        switch (size) {
            case GRK_SIZES.EXTRA_EXTRA_SMALL:
                return "w-3 h-3";
            case GRK_SIZES.EXTRA_SMALL:
                return "w-6 h-6";
            case GRK_SIZES.SMALL:
                return "w-8 h-8";
            case GRK_SIZES.MEDIUM:
                return "w-10 h-10";
            case GRK_SIZES.LARGE:
                return "w-12 h-12";
        }
    }, [size]);

    useEffect(() => {
        (async () => {
            const svg = await themedSvg(
                primary_url || "",
                DefaultToken.toString(),
                "currentColor"
            );

            if (primaryRef.current) {
                primaryRef.current.innerHTML = svg.outerHTML;
            }
        })();
    }, [primary_url, primaryRef]);

    useEffect(() => {
        (async () => {
            const svg = await themedSvg(
                secondary_url || "",
                DefaultToken.toString(),
                "currentColor"
            );

            if (secondaryRef.current) {
                secondaryRef.current.innerHTML = svg.outerHTML;
            }
        })();
    }, [secondary_url, secondaryRef]);

    return (
        <figure className="relative h-fit w-fit">
            <Avatar
                className={`${PRIMARY_SIZE} ${
                    rounded ? "rounded-full" : "rounded"
                } ${
                    only_primary ? "border-none" : "border-2 p-0.5"
                } bg-background-light dark:bg-background-dark`}
                style={{
                    borderColor: chain_color ? chain_color : "inherit",
                }}
                ref={primaryRef}
            />

            {!only_primary && (
                <Avatar
                    ref={secondaryRef}
                    className={`${SECONDARY_SIZE} ${
                        rounded ? "rounded-full" : "rounded"
                    } absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4 border-2 bg-background-light dark:bg-background-dark`}
                    style={{
                        borderColor: chain_color ? chain_color : "inherit",
                    }}
                />
            )}
        </figure>
    );
};
