import { type Meta, type StoryObj } from "@storybook/react";
import { TransactionsList as TransactionsListComponent } from "./TransactionsList";

type Story = StoryObj<typeof TransactionsListComponent>;

const meta: Meta<typeof TransactionsListComponent> = {
    title: "Molecules/Transaction/Transactions List",
    component: TransactionsListComponent,
};

export default meta;

export const TransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
    },
};
