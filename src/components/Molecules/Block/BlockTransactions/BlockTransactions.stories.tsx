import { type Meta, type StoryObj } from "@storybook/react";
import { BlockTransactions as BlockTransactionsComponent } from "./BlockTransactions";
import { fn } from "@storybook/test";

type Story = StoryObj<typeof BlockTransactionsComponent>;

const meta: Meta<typeof BlockTransactionsComponent> = {
    title: "Molecules/Block/Block Transactions",
    component: BlockTransactionsComponent,
};

export default meta;

export const BlockTransactions: Story = {
    args: {
        chain_name: "eth-mainnet",
        block_height: 19575410,
        actionable_transaction: (tx_hash) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(tx_hash);
                }),
            },
        }),
    },
};
