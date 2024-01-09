import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolListView } from "./XYKPoolListView";

type Story = StoryObj<typeof XYKPoolListView>;

const meta: Meta<typeof XYKPoolListView> = {
    title: "Organisms/XYK",
    component: XYKPoolListView,
};

export default meta;

export const XYKPoolList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
    },
};
