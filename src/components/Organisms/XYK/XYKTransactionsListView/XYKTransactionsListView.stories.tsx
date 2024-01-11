import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTransactionsListView } from "./XYKTransactionsListView";

type Story = StoryObj<typeof XYKTransactionsListView>;

const meta: Meta<typeof XYKTransactionsListView> = {
    title: "Organisms/XYK",
    component: XYKTransactionsListView,
};

export default meta;

export const XYKTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        pool_address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e",
    },
};
