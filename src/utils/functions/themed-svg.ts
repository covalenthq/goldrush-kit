const svgData = async (src: string): Promise<HTMLOrSVGImageElement | null> => {
    const isSvg = src?.toLowerCase().endsWith(".svg") || false;
    if (!isSvg) {
        return null;
    }

    try {
        const data = await (await fetch(src)).text();

        const svg = new DOMParser().parseFromString(
            data,
            "image/svg+xml"
        ).documentElement;

        const parserError = svg.getElementsByTagName("parsererror");
        if (parserError.length > 0) {
            throw Error(`Error parsing SVG", ${parserError[0].textContent}`);
        }

        const paths = svg.querySelectorAll("path");
        paths.forEach((path) => {
            path.style.fill = "currentColor";
        });

        svg.removeAttribute("width");
        svg.removeAttribute("height");

        return svg as HTMLOrSVGImageElement;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export const themedSvg = async (
    parentRef: React.RefObject<HTMLSpanElement>,
    src: string | null,
    fallback: string
): Promise<void> => {
    const _src = src || "";

    const svg = await svgData(_src);
    if (svg) {
        if (parentRef?.current) {
            parentRef.current.innerHTML = svg.outerHTML;
        }
    } else {
        const img = document.createElement("img");
        img.src = _src;
        img.alt = "GoldRush Block Explorer - powered by Covalent";

        img.addEventListener("error", async () => {
            const fallBackSvg = await svgData(fallback);

            if (fallBackSvg) {
                if (parentRef?.current) {
                    parentRef.current.innerHTML = fallBackSvg.outerHTML;
                }
            } else {
                const fallbackImg = document.createElement("img");
                fallbackImg.src = _src;
                fallbackImg.alt =
                    "GoldRush Block Explorer - powered by Covalent";
                if (parentRef?.current) {
                    parentRef.current.innerHTML = fallbackImg.outerHTML;
                }
            }
        });
        if (parentRef?.current) {
            parentRef.current.innerHTML = img.outerHTML;
        }
    }
};
