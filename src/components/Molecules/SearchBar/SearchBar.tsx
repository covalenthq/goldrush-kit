import { TransactionReceipt } from "../";
import { BlockDetails } from "../Block/BlockDetails/BlockDetails";
import { ChainSelector } from "../ChainSelector/ChainSelector";
import { AddressActivityView } from "@/components/Organisms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type SEARCH_RESULTS_TYPE } from "@/utils/constants/shared.constants";
import { useDebounce } from "@/utils/hooks/use-debounce";
import { useGoldRush } from "@/utils/store";
import { type Chain } from "@covalenthq/client-sdk";
import { useCallback, useState } from "react";

export const SearchBar: React.FC = () => {
    const { selectedChain, searchHandler } = useGoldRush();

    const [searchInput, setSearchInput] = useState<string>("");
    const [searchType, setSearchType] = useState<SEARCH_RESULTS_TYPE | null>(
        null,
    );

    useDebounce(
        () => {
            if (searchInput && selectedChain) {
                setSearchType(searchHandler(searchInput));
            }
        },
        500,
        [searchInput, selectedChain],
    );

    const handleResults = useCallback(() => {
        switch (searchType) {
            case "address": {
                return <AddressActivityView address={searchInput} />;
            }
            case "tx": {
                return (
                    <TransactionReceipt
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
            <div className="grid w-full grid-cols-1 gap-x-4 md:grid-cols-6">
                <div className="md:col-span-2">
                    <ChainSelector />
                </div>

                <Input
                    type="text"
                    name="search"
                    value={searchInput}
                    placeholder="Search by any Address / Txn Hash / Block / Domain Name"
                    onChange={({ target: { value } }) => setSearchInput(value)}
                    className="!border-accent-foreground md:col-span-3"
                />

                <Button
                    variant="outline"
                    onClick={() => setSearchType(searchHandler(searchInput))}
                    disabled={!searchInput || !selectedChain}
                    className="md:col-span-1"
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
