import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenDetailView } from "./XYKTokenDetailView";

type Story = StoryObj<typeof XYKTokenDetailView>;

const meta: Meta<typeof XYKTokenDetailView> = {
    title: "Organisms",
    component: XYKTokenDetailView,
};

export default meta;

export const XYKTokenDetail: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
};
