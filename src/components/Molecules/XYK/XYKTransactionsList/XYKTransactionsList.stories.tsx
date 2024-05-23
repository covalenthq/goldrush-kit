import { type Meta, type StoryObj } from "@storybook/react";
import { XYKTransactionsList as XYKTransactionsListComponent } from "./XYKTransactionsList";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof XYKTransactionsListComponent>;

const meta: Meta<typeof XYKTransactionsListComponent> = {
    title: "Molecules/XYK/XYK Transactions List",
    component: XYKTransactionsListComponent,
};

export default meta;

export const XYKTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        actionable_transaction: (address: string) => storyAction(address),
        actionable_token_0: (address: string) => storyAction(address),
        actionable_token_1: (address: string) => storyAction(address),
    },
};
