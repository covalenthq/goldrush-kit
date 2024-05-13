const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export const timestampParser = (
    timestamp: string | Date,
    type: "descriptive" | "DD MMM YY" | "relative" | "YYYY MM DD"
): string => {
    const _unix: Date = new Date(timestamp);

    switch (type) {
        case "descriptive": {
            const _minutes = _unix.getMinutes();
            const _hours = _unix.getHours();
            const _seconds = _unix.getSeconds();
            const _parsedSeconds: string = `${
                _seconds <= 9 ? "0" : ""
            }${_seconds}`;
            const _parsedMinutes: string = `${
                _minutes <= 9 ? "0" : ""
            }${_minutes}`;
            const _parsedHours: string = `${_hours <= 9 ? "0" : ""}${_hours}`;

            return `${
                months[_unix.getMonth()]
            } ${_unix.getDate()} ${_unix.getFullYear()} at ${_parsedHours}:${_parsedMinutes}:${_parsedSeconds}`;
        }

        case "DD MMM YY": {
            const day = _unix.getDate().toString().padStart(2, "0");
            const month = months[_unix.getMonth()].substring(0, 3);
            const year = _unix.getFullYear();
            return `${day} ${month} ${year}`;
        }

        case "relative": {
            const currentTime = new Date();

            const yearsDifference =
                currentTime.getFullYear() - _unix.getFullYear();
            const monthsDifference = currentTime.getMonth() - _unix.getMonth();
            const daysDifference = currentTime.getDate() - _unix.getDate();
            const hoursDifference = currentTime.getHours() - _unix.getHours();
            const minutesDifference =
                currentTime.getMinutes() - _unix.getMinutes();
            const secondsDifference =
                currentTime.getSeconds() - _unix.getSeconds();

            if (yearsDifference > 0) {
                return `${yearsDifference} year${
                    yearsDifference > 1 ? "s" : ""
                } ago`;
            } else if (monthsDifference > 0) {
                return `${monthsDifference} month${
                    monthsDifference > 1 ? "s" : ""
                } ago`;
            } else if (daysDifference > 0) {
                return `${daysDifference} day${daysDifference > 1 ? "s" : ""} ago`;
            } else if (hoursDifference > 0) {
                return `${hoursDifference} hour${
                    hoursDifference > 1 ? "s" : ""
                } ago`;
            } else if (minutesDifference > 0) {
                return `${minutesDifference} minute${
                    minutesDifference > 1 ? "s" : ""
                } ago`;
            } else if (secondsDifference > 0) {
                return `${secondsDifference} second${
                    secondsDifference > 1 ? "s" : ""
                } ago`;
            } else {
                return `just now`;
            }
        }

        case "YYYY MM DD": {
            const offsetMinutes = _unix.getTimezoneOffset();
            const offsetMilliseconds = offsetMinutes * 60 * 1000;
            const utcTime = _unix.getTime() + offsetMilliseconds;
            const _utc_unix: Date = new Date(utcTime);

            const year = _utc_unix.getFullYear();
            const month = String(_utc_unix.getMonth() + 1).padStart(2, "0");
            const day = String(_utc_unix.getDate()).padStart(2, "0");

            return `${year}-${month}-${day}`;
        }

        default: {
            return _unix.toISOString();
        }
    }
};
