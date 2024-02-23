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
                    className="flex w-72 items-center justify-between"
                    style={{
                        borderColor: selectedChain?.color_theme.hex,
                    }}
                >
                    {!selectedChain ? "Select a chain..." : selectedChain.label}
                    <DoubleArrowDownIcon />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="max-h-96 w-72 overflow-y-scroll rounded !p-0">
                <Command className="w-72 bg-background-light dark:bg-background-dark">
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
                                className="bg-background-light dark:bg-background-dark"
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
