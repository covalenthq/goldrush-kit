import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTransfersListView } from "./XYKTransfersListView";

type Story = StoryObj<typeof XYKTransfersListView>;

const meta: Meta<typeof XYKTransfersListView> = {
    title: "Organisms/XYK",
    component: XYKTransfersListView,
};

export default meta;

export const XYKTransfersList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        pool_address: "0xa43fe16908251ee70ef74718545e4fe6c5ccec9f",
    },
};
