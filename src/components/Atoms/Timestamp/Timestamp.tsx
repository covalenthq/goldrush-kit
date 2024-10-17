import { type TimestampProps } from "@/utils/types/atoms.types";
import { timestampParser } from "@covalenthq/client-sdk";
import { ClockIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";

export const Timestamp: React.FC<TimestampProps> = ({
    timestamp,
    defaultType = "relative",
    dynamic = true,
}) => {
    if (!timestamp) {
        return <></>;
    }

    const [relativeTime, setRelativeTime] = useState<boolean>(
        defaultType === "relative",
    );
    const [parsedTime, setParsedTime] = useState<string>(
        timestampParser(timestamp, relativeTime ? "relative" : "descriptive"),
    );

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (dynamic) {
            interval = setInterval(() => {
                setParsedTime(
                    timestampParser(
                        timestamp,
                        relativeTime ? "relative" : "descriptive",
                    ),
                );
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timestamp, relativeTime, dynamic]);

    const handleToggle = useCallback((isRelative: boolean) => {
        setRelativeTime(!isRelative);
        setParsedTime(
            timestampParser(
                timestamp,
                !isRelative ? "relative" : "descriptive",
            ),
        );
    }, []);

    return (
        <button
            className="inline-flex items-center gap-x-1"
            onClick={() => handleToggle(relativeTime)}
        >
            {parsedTime}

            <span className="text-foreground-light opacity-75 dark:text-foreground-dark mt-0.5">
                <ClockIcon />
            </span>
        </button>
    );
};
