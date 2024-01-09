import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolDetailView } from "./XYKPoolDetailView";

type Story = StoryObj<typeof XYKPoolDetailView>;

const meta: Meta<typeof XYKPoolDetailView> = {
    title: "Organisms/XYK",
    component: XYKPoolDetailView,
};

export default meta;

export const XYKPoolDetail: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e",
    },
};
