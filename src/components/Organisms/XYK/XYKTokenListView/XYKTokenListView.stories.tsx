import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenListView } from "./XYKTokenListView";

type Story = StoryObj<typeof XYKTokenListView>;

const meta: Meta<typeof XYKTokenListView> = {
    title: "Organisms/XYK/Token",
    component: XYKTokenListView,
};

export default meta;

export const XYKTokenList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
    },
};
