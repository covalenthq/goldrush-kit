export const themedSvg = async (
    url: string | null,
    fallback: string,
    fill: string
) => {
    let data: string | null = null;
    let isSvg = url?.toLowerCase().endsWith(".svg") || false;

    if (isSvg) {
        try {
            data = await (await fetch(url || "")).text();
        } catch (err) {
            console.error(err);
            try {
                data = await (await fetch(fallback)).text();
            } catch (fallbackErr) {
                console.error(fallbackErr);
                throw new Error(
                    "Failed to fetch both primary and fallback images."
                );
            }
        }
    }

    if (isSvg && data) {
        const svg = new DOMParser().parseFromString(
            data,
            "image/svg+xml"
        ).documentElement;

        const paths = svg.querySelectorAll("path");
        paths.forEach((path) => {
            path.style.fill = fill;
        });

        svg.removeAttribute("width");
        svg.removeAttribute("height");

        return svg;
    } else {
        const img = document.createElement("img");
        img.src = url || fallback;
        img.alt = "Image";
        img.onerror = () => {
            img.src = fallback;
        };
        return img;
    }
};
