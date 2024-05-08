import { type Meta, type StoryObj } from "@storybook/react";
import { LatestTransactions as LatestTransactionsComponent } from "./LatestTransactions";

type Story = StoryObj<typeof LatestTransactionsComponent>;

const meta: Meta<typeof LatestTransactionsComponent> = {
    title: "Molecules/Latest Transactions",
    component: LatestTransactionsComponent,
};

export default meta;

export const LatestTransactions: Story = {
    args: {
        chain_name: "eth-mainnet",
    },
};
