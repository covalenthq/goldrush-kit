export const truncate = (
    text: string | null,
    start: number = 6,
    end: number = 4,
): string => {
    const _text: string = (text || "")?.trim();
    if (_text.length > 15) {
        if (start + end >= _text.length) return _text;
        return `${_text.slice(0, start)}...${_text.slice(-end)}`;
    }
    return _text;
};
