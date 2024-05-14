import { type Option, None, Some } from "@/utils/option";
import { type ChainActivityEvent } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";
import { AddressCard } from "@/components/Atoms";
import {
    AddressActivityDetails,
    AddressActivityList,
} from "@/components/Molecules";
import { useGoldRush } from "@/utils/store";
import { type AddressActivityViewProps } from "@/utils/types/organisms.types";
import { CovalentAPIError } from "@/utils/types/shared.types";
import { defaultErrorMessage } from "@/utils/constants/shared.constants";

export const AddressActivityView: React.FC<AddressActivityViewProps> = ({
    address,
}) => {
    const { covalentClient } = useGoldRush();
    const [maybeResult, setMaybeResult] =
        useState<Option<ChainActivityEvent[] | null>>(None);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            setMaybeResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.BaseService.getAddressActivity(
                        address.trim(),
                        {
                            testnets: true,
                        }
                    );
                if (error.error) {
                    throw error;
                }
                setMaybeResult(new Some(data.items));
            } catch (error: CovalentAPIError | any) {
                setErrorMessage(error?.error_message ?? defaultErrorMessage);
                setMaybeResult(new Some(null));
                console.error(error);
            }
        })();
    }, [address]);

    return (
        <div className="space-y-4">
            <AddressCard address={address} />

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
