import { ChainSelector as ChainSelectorComponent } from "./ChainSelector";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof ChainSelectorComponent>;

const meta: Meta<typeof ChainSelectorComponent> = {
    title: "Molecules/Chain Selector",
    component: ChainSelectorComponent,
};

export default meta;

export const ChainSelector: Story = {
    args: {
        chain_options: [1, 10, "arbitrum-mainnet", "solana-mainnet"],
    },
};
