import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolTransactionsList as XYKPoolTransactionsListComponent } from "./XYKPoolTransactionsList";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof XYKPoolTransactionsListComponent>;

const meta: Meta<typeof XYKPoolTransactionsListComponent> = {
    title: "Molecules/XYK/Pool/XYK Pool Transactions List",
    component: XYKPoolTransactionsListComponent,
};

export default meta;

export const XYKPoolTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        pool_address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e",
        actionable_transaction: (address: string) => storyAction(address),
        actionable_token_0: (address: string) => storyAction(address),
        actionable_token_1: (address: string) => storyAction(address),
    },
};
