import { AddressCard } from "@/components/Atoms";
import {
    AddressActivityDetails,
    AddressActivityList,
} from "@/components/Molecules";
import {
    DEFAULT_ERROR_MESSAGE,
    FALLBACK_ERROR,
} from "@/utils/constants/shared.constants";
import { type Option, None, Some } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type AddressActivityViewProps } from "@/utils/types/organisms.types";
import {
    type ChainActivityEvent,
    type GoldRushResponse,
} from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const AddressActivityView: React.FC<AddressActivityViewProps> = ({
    address,
    actionable_address,
}) => {
    const { goldrushClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<ChainActivityEvent[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await goldrushClient.BaseService.getAddressActivity(
                        address.trim(),
                        {
                            testnets: true,
                        },
                    );
                if (error.error) {
                    throw error;
                }
                if (!data?.items) {
                    throw FALLBACK_ERROR;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: GoldRushResponse<null> | any) {
                setErrorMessage(error?.error_message ?? DEFAULT_ERROR_MESSAGE);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [address]);

    return (
        <div className="space-y-4">
            <AddressCard
                avatar={{}}
                address={address}
                actionable_address={actionable_address}
            />

            <AddressActivityDetails
                address={address}
                hide_no_activity
                maybeResult={maybeResult}
                errorMessage={errorMessage}
            />

            <AddressActivityList
                address={address}
                maybeResult={maybeResult}
                errorMessage={errorMessage}
            />
        </div>
    );
};
