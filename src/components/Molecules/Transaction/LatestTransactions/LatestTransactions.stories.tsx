import { type Meta, type StoryObj } from "@storybook/react";
import { LatestTransactions as LatestTransactionsComponent } from "./LatestTransactions";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof LatestTransactionsComponent>;

const meta: Meta<typeof LatestTransactionsComponent> = {
    title: "Molecules/Transaction/Latest Transactions",
    component: LatestTransactionsComponent,
};

export default meta;

export const LatestTransactions: Story = {
    args: {
        chain_name: "eth-mainnet",
        actionable_transaction: (address) => storyAction(address),
        actionable_address: (address) => storyAction(address),
    },
};
