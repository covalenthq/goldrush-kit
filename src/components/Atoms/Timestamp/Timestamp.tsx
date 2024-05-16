import { timestampParser } from "@/utils/functions";
import { type TimestampProps } from "@/utils/types/atoms.types";
import { useState } from "react";
import { ClockIcon } from "@radix-ui/react-icons";

export const Timestamp: React.FC<TimestampProps> = ({
    timestamp,
    defaultType = "descriptive",
}) => {
    const [relativeTime, setRelativeTime] = useState<boolean>(
        defaultType === "relative"
    );

    return (
        <span className="inline-flex items-center gap-x-1">
            {timestampParser(
                timestamp,
                relativeTime ? "relative" : "descriptive"
            )}
            <button
                onClick={() => setRelativeTime(!relativeTime)}
                className="text-foreground-light opacity-75 dark:text-foreground-dark"
            >
                <ClockIcon />
            </button>
        </span>
    );
};
