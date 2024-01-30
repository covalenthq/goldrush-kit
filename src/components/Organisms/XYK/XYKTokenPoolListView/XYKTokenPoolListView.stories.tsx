import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenPoolListView } from "./XYKTokenPoolListView";

type Story = StoryObj<typeof XYKTokenPoolListView>;

const meta: Meta<typeof XYKTokenPoolListView> = {
    title: "Organisms/XYK/Token",
    component: XYKTokenPoolListView,
};

export default meta;

export const XYKTokenPoolList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
};
