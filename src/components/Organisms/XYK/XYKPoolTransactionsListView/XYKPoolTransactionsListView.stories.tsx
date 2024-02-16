import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolTransactionsListView } from "./XYKPoolTransactionsListView";

type Story = StoryObj<typeof XYKPoolTransactionsListView>;

const meta: Meta<typeof XYKPoolTransactionsListView> = {
    title: "Organisms/XYK/Pool",
    component: XYKPoolTransactionsListView,
};

export default meta;

export const XYKPoolTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        pool_address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e"
    },
};
