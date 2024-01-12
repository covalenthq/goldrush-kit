import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolInformationView } from "./XYKPoolInformationView";

type Story = StoryObj<typeof XYKPoolInformationView>;

const meta: Meta<typeof XYKPoolInformationView> = {
    title: "Molecules/XYK",
    component: XYKPoolInformationView,
};

export default meta;

export const XYKPoolInformation: Story = {
    args: {
        pool_address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e",
        dex_name: "uniswap_v2",
        chain_name: "eth-mainnet",
    },
};
