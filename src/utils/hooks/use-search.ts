import { useCallback } from "react";
import { SEARCH_RESULTS_TYPE } from "../constants/shared.constants";

export const useSearch = () => {
    const handleSearch = useCallback(
        (searchInput: string): SEARCH_RESULTS_TYPE => {
            const addressRegex = /^0x[a-fA-F0-9]{40}$/;
            const txnHashRegex = /^0x[a-fA-F0-9]{64}$/;
            const blockRegex = /^\d+$/;
            const tokenRegex = /^[a-zA-Z0-9]+$/;
            const domainNameRegex = /^[a-zA-Z0-9.-]+$/;

            if (addressRegex.test(searchInput)) {
                return SEARCH_RESULTS_TYPE.ADDRESS;
            } else if (txnHashRegex.test(searchInput)) {
                return SEARCH_RESULTS_TYPE.TRANSACTION;
            } else if (blockRegex.test(searchInput)) {
                return SEARCH_RESULTS_TYPE.BLOCK;
            } else if (tokenRegex.test(searchInput)) {
                return SEARCH_RESULTS_TYPE.TOKEN;
            } else if (domainNameRegex.test(searchInput)) {
                return SEARCH_RESULTS_TYPE.ADDRESS;
            } else {
                return SEARCH_RESULTS_TYPE.NOT_FOUND;
            }
        },
        []
    );

    return { handleSearch };
};
