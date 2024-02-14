import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/utils/hooks/use-debounce";
import { AddressActivityListView } from "@/components/Organisms/TokenBalances/AddressActivityListView/AddressActivityListView";
import { TypographyH3 } from "@/components/ui/typography";
import { ChainSelector } from "../ChainSelector/ChainSelector";
import { useCovalent } from "@/utils/store/Covalent";
import { BlockDetails } from "../BlockDetails/BlockDetails";
import { type Chain } from "@covalenthq/client-sdk";
import { TransactionReceiptView } from "@/components/Organisms/TransactionReceiptView/TransactionReceiptView";
import { AddressDetailsView } from "@/components/Organisms/AddressDetailsView/AddressDetailsView";

export const SearchBar: React.FC = () => {
    const { selectedChain } = useCovalent();

    const [searchInput, setSearchInput] = useState<string>("");
    const [searchType, setSearchType] = useState<
        | "address"
        | "tx"
        | "block"
        // | "token"
        | "not found"
        | "none"
    >("none");

    useDebounce(
        () => {
            if (searchInput && selectedChain) {
                handleSearch();
            }
        },
        500,
        [searchInput, selectedChain]
    );

    const handleSearch = useCallback(() => {
        const addressRegex = /^0x[a-fA-F0-9]{40}$/;
        const txnHashRegex = /^0x[a-fA-F0-9]{64}$/;
        const blockRegex = /^\d+$/;
        // const tokenRegex = /^[a-zA-Z0-9]+$/;
        const domainNameRegex = /^[a-zA-Z0-9.-]+$/;

        setSearchType("none");

        if (addressRegex.test(searchInput)) {
            setSearchType("address");
        } else if (txnHashRegex.test(searchInput)) {
            setSearchType("tx");
        } else if (blockRegex.test(searchInput)) {
            setSearchType("block");
        }
        // else if (tokenRegex.test(searchInput)) {
        //     setSearchType("token");
        // }
        else if (domainNameRegex.test(searchInput)) {
            setSearchType("address");
        } else {
            setSearchType("not found");
        }
    }, [searchInput]);

    const handleResults = useCallback(() => {
        switch (searchType) {
            case "address": {
                return (
                    <div className="flex w-full flex-col gap-y-8">
                        <AddressDetailsView
                            address={searchInput}
                            chain_name={selectedChain?.name as Chain}
                            show_chain_selector={false}
                        />
                        <AddressActivityListView address={searchInput} />
                    </div>
                );
            }
            case "tx": {
                return (
                    <TransactionReceiptView
                        chain_name={selectedChain?.name as Chain}
                        tx_hash={searchInput}
                    />
                );
            }
            // case "token": {
            //     return <>not sure how to handle this</>;
            // }
            case "block": {
                return (
                    <BlockDetails
                        chain_name={selectedChain?.name as Chain}
                        height={+searchInput}
                    />
                );
            }
            case "none": {
                return <></>;
            }
            case "not found":
            default: {
                return <TypographyH3>{searchInput} not found</TypographyH3>;
            }
        }
    }, [searchType, searchInput, selectedChain]);

    return (
        <main>
            <div className="flex items-center gap-x-4">
                <ChainSelector />
                <Input
                    type="text"
                    name="search"
                    value={searchInput}
                    placeholder="Search by any Address / Txn Hash / Block / Domain Name"
                    onChange={({ target: { value } }) => setSearchInput(value)}
                    className="!border-accent-foreground"
                />
            </div>

            {!searchInput ? (
                <></>
            ) : (
                <div className="mt-4">{handleResults()}</div>
            )}
        </main>
    );
};
