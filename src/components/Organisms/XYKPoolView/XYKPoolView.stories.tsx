import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolView as XYKPoolViewComponent } from "./XYKPoolView";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof XYKPoolViewComponent>;

const meta: Meta<typeof XYKPoolViewComponent> = {
    title: "Organisms/XYK Pool View",
    component: XYKPoolViewComponent,
};

export default meta;

export const XYKPoolView: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        pool_address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e",
        actionable_address: (address: string) => storyAction(address),
        actionable_token_0: (address: string) => storyAction(address),
        actionable_token_1: (address: string) => storyAction(address),
    },
};
