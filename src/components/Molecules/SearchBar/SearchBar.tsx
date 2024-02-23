import { useCallback, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/utils/hooks/use-debounce";
import { AddressActivityListView } from "@/components/Organisms/AddressActivityListView/AddressActivityListView";
import { ChainSelector } from "../ChainSelector/ChainSelector";
import { useGoldRush } from "@/utils/store";
import { BlockDetails } from "../BlockDetails/BlockDetails";
import { type Chain } from "@covalenthq/client-sdk";
import { TransactionReceiptView } from "@/components/Organisms/TransactionReceiptView/TransactionReceiptView";
import { AddressDetailsView } from "@/components/Organisms/AddressDetailsView/AddressDetailsView";
import { useSearch } from "@/utils/hooks/use-search";
import { type SEARCH_RESULTS_TYPE } from "@/utils/constants/shared.constants";
import { Button } from "@/components/ui/button";

export const SearchBar: React.FC = () => {
    const { selectedChain } = useGoldRush();
    const { handleSearch } = useSearch();

    const [searchInput, setSearchInput] = useState<string>("");
    const [searchType, setSearchType] = useState<SEARCH_RESULTS_TYPE | null>(
        null
    );

    useDebounce(
        () => {
            if (searchInput && selectedChain) {
                setSearchType(handleSearch(searchInput));
            }
        },
        500,
        [searchInput, selectedChain]
    );

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
            case "block": {
                return (
                    <BlockDetails
                        chain_name={selectedChain?.name as Chain}
                        height={+searchInput}
                    />
                );
            }
            case "not found":
            default: {
                return <p>not found</p>;
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
                <Button
                    variant="outline"
                    onClick={() => setSearchType(handleSearch(searchInput))}
                    disabled={!searchInput || !selectedChain}
                >
                    Search
                </Button>
            </div>

            {!searchInput || !selectedChain ? (
                <></>
            ) : (
                <div className="mt-4">{handleResults()}</div>
            )}
        </main>
    );
};
