import { type Meta, type StoryObj } from "@storybook/react";
import { TransactionsList as TransactionsListComponent } from "./TransactionsList";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof TransactionsListComponent>;

const meta: Meta<typeof TransactionsListComponent> = {
    title: "Molecules/Transaction/Transactions List",
    component: TransactionsListComponent,
};

export default meta;

export const TransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        actionable_block: (block) => storyAction(block),
        actionable_transaction: (address) => storyAction(address),
        actionable_address: (address) => storyAction(address),
    },
};
