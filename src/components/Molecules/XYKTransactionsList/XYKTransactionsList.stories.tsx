import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTransactionsList as XYKTransactionsListComponent } from "./XYKTransactionsList";

type Story = StoryObj<typeof XYKTransactionsListComponent>;

const meta: Meta<typeof XYKTransactionsListComponent> = {
    title: "Molecules/XYK Transactions List",
    component: XYKTransactionsListComponent,
};

export default meta;

export const XYKTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
    },
};
