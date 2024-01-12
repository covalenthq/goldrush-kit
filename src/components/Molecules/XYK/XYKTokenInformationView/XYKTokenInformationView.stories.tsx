import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenInformationView } from "./XYKTokenInformationView";

type Story = StoryObj<typeof XYKTokenInformationView>;

const meta: Meta<typeof XYKTokenInformationView> = {
    title: "Molecules/XYK",
    component: XYKTokenInformationView,
};

export default meta;

export const XYKTokenInformation: Story = {
    args: {
        pool_address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e",
        dex_name: "uniswap_v2",
        chain_name: "eth-mainnet",
    },
};
