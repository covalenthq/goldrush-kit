import { type Meta, type StoryObj } from "@storybook/react";
import { TransactionsList as TransactionsListComponent } from "./TransactionsList";

type Story = StoryObj<typeof TransactionsListComponent>;

const meta: Meta<typeof TransactionsListComponent> = {
    title: "Molecules/Transactions List",
    component: TransactionsListComponent,
};

export default meta;

export const TransactionsList: Story = {
    args: {
        chain_names: ["eth-mainnet", "matic-mainnet"],
        address: "0x972B8FAD70de6e430D8b368198AbFF1E42eFf022",
    },
};
