import { TokenAvatar } from "@/components/Atoms";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { useGoldRush } from "@/utils/store";
import { type ChainSelectorProps } from "@/utils/types/molecules.types";
import { type ChainItem } from "@covalenthq/client-sdk";
import { CheckIcon, DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { CommandLoading } from "cmdk";
import { useMemo, useState } from "react";

export const ChainSelector: React.FC<ChainSelectorProps> = ({
    chain_options = [],
    onChangeChain,
}) => {
    const { chains, selectedChain, setSelectedChain } = useGoldRush();
    const [open, setOpen] = useState<boolean>(false);

    const dropdownChains = useMemo<{
        foundational: ChainItem[];
        frontier: ChainItem[];
        community: ChainItem[];
    }>(() => {
        if (!chains) {
            return {
                foundational: [],
                frontier: [],
                community: [],
            };
        }

        const foundational: ChainItem[] = [];
        const frontier: ChainItem[] = [];
        const community: ChainItem[] = [];

        if (!chain_options.length) {
            chains.forEach((chain: ChainItem) => {
                // @ts-expect-error Priority Label yet to be added to the ChainItem type
                if (chain.name && chain.priority_label === "Foundational") {
                    foundational.push(chain);
                    // @ts-expect-error Priority Label yet to be added to the ChainItem type
                } else if (chain.name && chain.priority_label === "Frontier") {
                    frontier.push(chain);
                } else {
                    community.push(chain);
                }
            });
            return {
                foundational,
                frontier,
                community,
            };
        }

        const selectedChains: ChainItem[] = [];
        chain_options.forEach((nameOrId) => {
            const foundChain: ChainItem | null =
                chains.find(
                    ({ name, chain_id }) =>
                        name === nameOrId ||
                        chain_id?.toString() === nameOrId.toString(),
                ) ?? null;
            if (foundChain) {
                selectedChains.push(foundChain);
            }
        });
        return {
            foundational: selectedChains.filter(
                // @ts-expect-error Priority Label yet to be added to the ChainItem type
                (chain) => chain.priority_label === "Foundational",
            ),
            frontier: selectedChains.filter(
                // @ts-expect-error Priority Label yet to be added to the ChainItem type
                (chain) => chain.priority_label === "Frontier",
            ),
            community: selectedChains.filter(
                (chain) =>
                    // @ts-expect-error Priority Label yet to be added to the ChainItem type
                    chain.priority_label !== "Foundational" &&
                    // @ts-expect-error Priority Label yet to be added to the ChainItem type
                    chain.priority_label !== "Frontier",
            ),
        };
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
                    {!selectedChain ? (
                        "Select a chain..."
                    ) : (
                        <div className="flex items-center gap-x-1">
                            <TokenAvatar
                                only_primary
                                size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                chain_color={selectedChain.color_theme?.hex}
                                primary_url={selectedChain.logo_url}
                            />
                            {selectedChain.label}
                        </div>
                    )}
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
                        <CommandList>
                            <CommandGroup heading="Foundational Chains">
                                {dropdownChains.foundational.map((chain) => (
                                    <CommandItem
                                        key={chain.name}
                                        value={chain.name as string}
                                        className="flex cursor-pointer gap-1 bg-background-light dark:bg-background-dark"
                                        onSelect={() => {
                                            setSelectedChain(chain);
                                            setOpen(false);
                                            if (onChangeChain) {
                                                onChangeChain(chain);
                                            }
                                        }}
                                    >
                                        <TokenAvatar
                                            only_primary
                                            size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                            chain_color={chain.color_theme?.hex}
                                            primary_url={chain.logo_url}
                                        />
                                        {chain.label}
                                        <CheckIcon
                                            className={`w-4" ml-auto h-4 ${
                                                chain.name ===
                                                selectedChain?.name
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Frontier Chains">
                                {dropdownChains.frontier.map((chain) => (
                                    <CommandItem
                                        key={chain.name}
                                        value={chain.name as string}
                                        className="flex cursor-pointer gap-1 bg-background-light dark:bg-background-dark"
                                        onSelect={() => {
                                            setSelectedChain(chain);
                                            setOpen(false);
                                            if (onChangeChain) {
                                                onChangeChain(chain);
                                            }
                                        }}
                                    >
                                        <TokenAvatar
                                            only_primary
                                            size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                            chain_color={chain.color_theme?.hex}
                                            primary_url={chain.logo_url}
                                        />
                                        {chain.label}
                                        <CheckIcon
                                            className={`w-4" ml-auto h-4 ${
                                                chain.name ===
                                                selectedChain?.name
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup heading="Community Chains">
                                {dropdownChains.community.map((chain) => (
                                    <CommandItem
                                        key={chain.name}
                                        value={chain.name as string}
                                        className="flex cursor-pointer gap-1 bg-background-light dark:bg-background-dark"
                                        onSelect={() => {
                                            setSelectedChain(chain);
                                            setOpen(false);
                                            if (onChangeChain) {
                                                onChangeChain(chain);
                                            }
                                        }}
                                    >
                                        <TokenAvatar
                                            only_primary
                                            size={GRK_SIZES.EXTRA_EXTRA_SMALL}
                                            chain_color={chain.color_theme?.hex}
                                            primary_url={chain.logo_url}
                                        />
                                        {chain.label}
                                        <CheckIcon
                                            className={`w-4" ml-auto h-4 ${
                                                chain.name ===
                                                selectedChain?.name
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
};
