import { useEffect, useMemo, useRef } from "react";
import { type TokenAvatarProps } from "@/utils/types/atoms.types";
import { GRK_SIZES } from "@/utils/constants/shared.constants";

export const TokenAvatar: React.FC<TokenAvatarProps> = ({
    token_url,
    sub_url,
    size,
    is_chain_logo = false,
    chain_color,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const SIZE_CLASS = useMemo<string>(() => {
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
            default:
                return "w-12 h-12";
        }
    }, [size]);

    const SUB_SIZE = useMemo<string>(() => {
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
            default:
                return "w-8 h-8";
        }
    }, [size]);

    useEffect(() => {
        if (is_chain_logo) {
            (async () => {
                const response = await fetch(
                    token_url ?? "https://goldrush.vercel.app/icons/token.svg"
                );
                const data = await response.text();

                const parser = new DOMParser();
                const svg = parser.parseFromString(
                    data,
                    "image/svg+xml"
                ).documentElement;

                const paths = svg.querySelectorAll("path");
                const fillColor = document.documentElement.classList.contains(
                    "dark"
                )
                    ? "white"
                    : "black";
                paths.forEach((path) => {
                    path.style.fill = fillColor;
                });

                const [width, height] = SIZE_CLASS.split(" ");
                svg.setAttribute("width", width);
                svg.setAttribute("height", height);

                if (ref.current) {
                    ref.current.innerHTML = svg.outerHTML;
                }
            })();
        }
    }, [token_url, SIZE_CLASS]);

    return is_chain_logo ? (
        <div ref={ref} className={SIZE_CLASS} />
    ) : (
        <div
            className={`${SIZE_CLASS} relative rounded-[100%]`}
            style={{ background: chain_color ?? "", padding: "2px" }}
        >
            <img
                src={token_url ?? "https://goldrush.vercel.app/icons/token.svg"}
                alt="Token Image"
                style={{ background: "#fff" }}
                className={`h-full w-full rounded-[100%] p-0.5`}
                onError={(e) => {
                    e.currentTarget.src =
                        "https://goldrush.vercel.app/icons/token.svg";
                }}
            />
            {sub_url && (
                <img
                    src={sub_url}
                    alt="Token Image"
                    style={{
                        background: chain_color ? chain_color : "grey",
                        padding: "1px",
                    }}
                    className={`${SUB_SIZE} absolute -bottom-2 -left-3 rounded-[100%] p-0.5`}
                    onError={(e) => {
                        e.currentTarget.src =
                            "https://goldrush.vercel.app/icons/token.svg";
                    }}
                />
            )}
        </div>
    );
};
