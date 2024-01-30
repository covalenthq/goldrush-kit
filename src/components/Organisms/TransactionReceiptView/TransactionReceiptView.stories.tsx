import { type Meta, type StoryObj } from "@storybook/react";
import { TransactionReceiptView } from "./TransactionReceiptView";

type Story = StoryObj<typeof TransactionReceiptView>;

const meta: Meta<typeof TransactionReceiptView> = {
    title: "Organisms",
    component: TransactionReceiptView,
};

export default meta;

export const TransactionReceipt: Story = {
    args: {
        chain_name: "matic-mainnet",
        tx_hash:
            "0xbd0f211af42276a79dca5a5bd5a9b27c95eaa8403083171fa2a129c35a74996f",
    },
};
