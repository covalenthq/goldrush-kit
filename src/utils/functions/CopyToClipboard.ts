export const copyToClipboard = async (text: string) => {
    if (!navigator?.clipboard) {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        try {
            document.execCommand("copy");
        } catch (error) {
            console.error(error);
        } finally {
            textArea.remove();
        }
        return false;
    } else {
        try {
            await navigator?.clipboard?.writeText(text);

            return true;
        } catch (error) {
            console.warn("Copy failed", error);

            return false;
        }
    }
};
