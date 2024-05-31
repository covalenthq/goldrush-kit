import { useGoldRush } from "@/utils/store";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useMemo, useState } from "react";
import { CheckIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { type ChainSelectorProps } from "@/utils/types/molecules.types";
import { type ChainItem } from "@covalenthq/client-sdk";
import { CommandLoading } from "cmdk";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";

export const ChainSelector: React.FC<ChainSelectorProps> = ({
    chain_options = [],
    onChangeChain,
}) => {
    const { chains, selectedChain, setSelectedChain } = useGoldRush();
    const [open, setOpen] = useState<boolean>(false);

    const dropdownChains = useMemo<ChainItem[] | null>(() => {
        if (!chains) {
            return null;
        }

        if (!chain_options.length) {
            return chains;
        }

        return chain_options.reduce((acc: ChainItem[], nameOrId) => {
            const foundChain: ChainItem | null =
                chains.find(
                    ({ name, chain_id }) =>
                        name === nameOrId ||
                        chain_id.toString() === nameOrId.toString()
                ) ?? null;
            if (foundChain) {
                acc.push(foundChain);
            }
            return acc;
        }, []);
    }, [chains, chain_options]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex w-72 items-center justify-between"
                >
                    {!selectedChain ? "Select a chain..." : selectedChain.label}
                    <DoubleArrowDownIcon />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="max-h-96 w-72 overflow-y-scroll rounded !p-0">
                <Command className="w-72">
                    <CommandInput placeholder="Search chain..." />
                    <CommandEmpty>No chain found.</CommandEmpty>
                    {!dropdownChains ? (
                        <CommandLoading>
                            <div className="flex flex-col gap-2 px-4 pt-2">
                                <Skeleton size={GRK_SIZES.LARGE} />
                                <Skeleton size={GRK_SIZES.LARGE} />
                                <Skeleton size={GRK_SIZES.LARGE} />
                            </div>
                        </CommandLoading>
                    ) : (
                        <CommandGroup>
                            {dropdownChains.map((chain) => (
                                <CommandItem
                                    key={chain.name}
                                    value={chain.name}
                                    className="cursor-pointer bg-background-light dark:bg-background-dark"
                                    onSelect={() => {
                                        setSelectedChain(chain);
                                        setOpen(false);
                                        if (onChangeChain) {
                                            onChangeChain(chain);
                                        }
                                    }}
                                >
                                    {chain.label}
                                    <CheckIcon
                                        className={`w-4" ml-auto h-4 ${
                                            chain.name === selectedChain?.name
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};
