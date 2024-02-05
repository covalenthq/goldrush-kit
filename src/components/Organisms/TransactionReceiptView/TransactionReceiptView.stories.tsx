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
        chain_name: "eth-mainnet",
        tx_hash:
            "0x7a038d2f5be4d196a3ff389497f8d61a639e4a32d353758b4f062cafbc5d475c",
    },
};
