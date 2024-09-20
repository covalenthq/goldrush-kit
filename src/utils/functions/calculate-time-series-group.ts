import { TIME_SERIES_GROUP } from "../constants/shared.constants";

export const calculateTimeSeriesGroup = (
    signed_at: Date | null,
): TIME_SERIES_GROUP => {
    const now = new Date();

    if (!signed_at) {
        return TIME_SERIES_GROUP.EARLIER;
    }

    const dateObj = signed_at;
    const diffInMilliseconds = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) {
        return TIME_SERIES_GROUP.LAST_24H;
    } else if (diffInDays < 7) {
        return TIME_SERIES_GROUP.LAST_7D;
    } else if (diffInDays < 30) {
        return TIME_SERIES_GROUP.LAST_30D;
    }

    return TIME_SERIES_GROUP.EARLIER;
};
