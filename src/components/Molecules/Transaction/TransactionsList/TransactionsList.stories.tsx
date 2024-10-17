import { TransactionsList as TransactionsListComponent } from "./TransactionsList";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TransactionsListComponent>;

const meta: Meta<typeof TransactionsListComponent> = {
    title: "Molecules/Transaction/Transactions List",
    component: TransactionsListComponent,
};

export default meta;

export const TransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        actionable_address: (address) => storyAction(address),
        actionable_block: (block_height) => storyAction(block_height),
        actionable_transaction: (tx_hash) => storyAction(tx_hash),
    },
};
