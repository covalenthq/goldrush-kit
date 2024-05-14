import { type Meta, type StoryObj } from "@storybook/react";
import { XYKPoolTransactionsList as XYKPoolTransactionsListComponent } from "./XYKPoolTransactionsList";

type Story = StoryObj<typeof XYKPoolTransactionsListComponent>;

const meta: Meta<typeof XYKPoolTransactionsListComponent> = {
    title: "Molecules/XYK Pool Transactions List",
    component: XYKPoolTransactionsListComponent,
};

export default meta;

export const XYKPoolTransactionsList: Story = {
    args: {
        chain_name: "eth-mainnet",
        dex_name: "uniswap_v2",
        pool_address: "0x21b8065d10f73ee2e260e5b47d3344d3ced7596e",
    },
};
