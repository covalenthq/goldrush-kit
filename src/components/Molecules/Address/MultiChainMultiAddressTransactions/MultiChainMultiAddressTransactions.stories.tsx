import { MultiChainMultiAddressTransactions as MultiChainMultiAddressTransactionsComponent } from "./MultiChainMultiAddressTransactions";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof MultiChainMultiAddressTransactionsComponent>;

const meta: Meta<typeof MultiChainMultiAddressTransactionsComponent> = {
    title: "Molecules/Address/MultiChain MultiAddress Transactions",
    component: MultiChainMultiAddressTransactionsComponent,
};

export default meta;

export const MultiChainMultiAddressTransactions: Story = {
    args: {
        chain_names: ["eth-mainnet", "matic-mainnet"],
        addresses: [
            "0x49b5eae7e881c22001c0daf6f211db1473310b7b",
            "0x83C1B24e8CB73D165787dcEb9A8B2D8A6d5188fD",
        ],
        actionable_address: (address) => storyAction(address),
        actionable_block: (block_height) => storyAction(block_height),
        actionable_transaction: (tx_hash) => storyAction(tx_hash),
    },
};
