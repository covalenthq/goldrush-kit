export const copyToClipboard = async (text: string): Promise<boolean> => {
    if (navigator.clipboard) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error("Clipboard API failed:", error);
            return false;
        }
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "absolute";
        textArea.style.left = "-999999px";
        document.body.prepend(textArea);
        textArea.select();
        try {
            console.warn(
                "document.execCommand is deprecated and might not work in future versions."
            );
            document.execCommand("copy");
            return true;
        } catch (error) {
            console.error("Fallback copy failed:", error);
            return false;
        } finally {
            textArea.remove();
        }
    }
};
