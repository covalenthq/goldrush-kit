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
        <span className="inline-flex items-center gap-x-1 text-foreground-light dark:text-foreground-light">
            {timestampParser(
                timestamp,
                relativeTime ? "relative" : "descriptive"
            )}
            <button onClick={() => setRelativeTime(!relativeTime)}>
                <ClockIcon />
            </button>
        </span>
    );
};
