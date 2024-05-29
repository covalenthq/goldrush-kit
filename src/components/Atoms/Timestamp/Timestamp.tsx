import { timestampParser } from "@/utils/functions";
import { type TimestampProps } from "@/utils/types/atoms.types";
import { useEffect, useState } from "react";
import { ClockIcon } from "@radix-ui/react-icons";

export const Timestamp: React.FC<TimestampProps> = ({
    timestamp,
    defaultType = "descriptive",
    dynamic = true,
}) => {
    const [relativeTime, setRelativeTime] = useState<boolean>(
        defaultType === "relative"
    );
    const [parsedTime, setParsedTime] = useState<string>(
        timestampParser(timestamp, relativeTime ? "relative" : "descriptive")
    );

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (dynamic) {
            interval = setInterval(() => {
                setParsedTime(
                    timestampParser(
                        timestamp,
                        relativeTime ? "relative" : "descriptive"
                    )
                );
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timestamp, relativeTime, dynamic]);

    return (
        <span className="inline-flex items-center gap-x-1">
            {parsedTime}
            <button
                onClick={() => setRelativeTime(!relativeTime)}
                className="text-foreground-light opacity-75 dark:text-foreground-dark"
            >
                <ClockIcon />
            </button>
        </span>
    );
};
