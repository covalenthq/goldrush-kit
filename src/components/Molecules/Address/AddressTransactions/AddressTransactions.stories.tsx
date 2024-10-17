import { AddressTransactions as AddressTransactionsComponent } from "./AddressTransactions";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof AddressTransactionsComponent>;

const meta: Meta<typeof AddressTransactionsComponent> = {
    title: "Molecules/Address/Address Transactions",
    component: AddressTransactionsComponent,
};

export default meta;

export const AddressTransactions: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0x49b5eae7e881c22001c0daf6f211db1473310b7b",
        actionable_address: (address) => storyAction(address),
        actionable_block: (block_height) => storyAction(block_height),
        actionable_transaction: (tx_hash) => storyAction(tx_hash),
    },
};
