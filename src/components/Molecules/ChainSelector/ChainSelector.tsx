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
import { useState } from "react";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { type ChainSelectorProps } from "@/utils/types/molecules.types";

export const ChainSelector: React.FC<ChainSelectorProps> = ({
    onChangeChain,
}) => {
    const { chains, selectedChain, setSelectedChain } = useGoldRush();
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="flex w-72 items-center justify-between text-accent dark:bg-background-dark dark:text-white"
                    style={{
                        borderColor: selectedChain?.color_theme.hex,
                    }}
                >
                    {!selectedChain ? "Select a chain..." : selectedChain.label}
                    <DoubleArrowDownIcon />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="max-h-96 w-72 overflow-y-scroll rounded bg-accent !p-0 dark:bg-background-dark dark:text-white">
                <Command className="dark:bg-background-dark dark:text-white">
                    <CommandInput placeholder="Search chain..." />
                    <CommandEmpty>No chain found.</CommandEmpty>
                    <CommandGroup>
                        {chains?.map((chain) => (
                            <CommandItem
                                key={chain.name}
                                value={chain.name}
                                onSelect={() => {
                                    setSelectedChain(chain);
                                    setOpen(false);
                                    if (onChangeChain) {
                                        onChangeChain(chain);
                                    }
                                }}
                                className="dark:bg-background-dark dark:text-white"
                            >
                                {chain.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
};
