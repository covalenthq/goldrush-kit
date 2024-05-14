import { type Meta, type StoryObj } from "@storybook/react";
import { XYKOverviewTransactionsListView } from "./XYKOverviewTransactionsListView";

type Story = StoryObj<typeof XYKOverviewTransactionsListView>;

const meta: Meta<typeof XYKOverviewTransactionsListView> = {
    title: "Organisms",
    component: XYKOverviewTransactionsListView,
};

export default meta;

export const XYKOverviewTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
    },
};
