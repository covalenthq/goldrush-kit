import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/utils/hooks/use-debounce";
import { AddressActivityListView } from "@/components/Organisms/TokenBalances/AddressActivityListView/AddressActivityListView";
import { TypographyH3 } from "@/components/ui/typography";

export const SearchBar: React.FC = () => {
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchType, setSearchType] = useState<
        "address" | "tx" | "block" | "token" | "not found" | "none"
    >("none");

    useDebounce(
        () => {
            if (searchInput) {
                handleSearch();
            }
        },
        500,
        [searchInput]
    );

    const handleSearch = useCallback(() => {
        const addressRegex = /^0x[a-fA-F0-9]{40}$/;
        const txnHashRegex = /^0x[a-fA-F0-9]{64}$/;
        const blockRegex = /^\d+$/;
        const tokenRegex = /^[a-zA-Z0-9]+$/;
        const domainNameRegex = /^[a-zA-Z0-9.-]+$/;

        setSearchType("none");

        if (addressRegex.test(searchInput)) {
            setSearchType("address");
        } else if (txnHashRegex.test(searchInput)) {
            setSearchType("tx");
        } else if (blockRegex.test(searchInput)) {
            setSearchType("block");
        } else if (tokenRegex.test(searchInput)) {
            setSearchType("token");
        } else if (domainNameRegex.test(searchInput)) {
            setSearchType("address");
        } else {
            setSearchType("not found");
        }
    }, [searchInput]);

    const handleResults = useCallback(() => {
        console.log(searchType);
        switch (searchType) {
            case "address": {
                return <AddressActivityListView address={searchInput} />;
            }
            case "tx": {
                return <>need the decoded tx molecule here</>;
            }
            case "token": {
                return <>not sure how to handle this</>;
            }
            case "block": {
                return <>will be added by community</>;
            }
            case "none": {
                return <></>;
            }
            case "not found":
            default: {
                return <TypographyH3>{searchInput} not found</TypographyH3>;
            }
        }
    }, [searchType, searchInput]);

    return (
        <main>
            <Input
                type="text"
                name="search"
                value={searchInput}
                placeholder="Search by any Address / Txn Hash / Block / Domain Name"
                onChange={({ target: { value } }) => setSearchInput(value)}
            />

            {!searchInput ? (
                <></>
            ) : (
                <div className="mt-4">{handleResults()}</div>
            )}
        </main>
    );
};
