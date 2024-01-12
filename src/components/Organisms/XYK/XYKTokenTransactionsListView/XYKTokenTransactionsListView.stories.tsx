import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTokenTransactionsListView } from "./XYKTokenTransactionsListView";

type Story = StoryObj<typeof XYKTokenTransactionsListView>;

const meta: Meta<typeof XYKTokenTransactionsListView> = {
    title: "Organisms/XYK/Token",
    component: XYKTokenTransactionsListView,
};

export default meta;

export const XYKTokenTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    },
};
