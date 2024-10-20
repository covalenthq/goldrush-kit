import { TransactionReceipt as TransactionReceiptComponent } from "./TransactionReceipt";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TransactionReceiptComponent>;

const meta: Meta<typeof TransactionReceiptComponent> = {
    title: "Molecules/Transaction/Transaction Receipt",
    component: TransactionReceiptComponent,
};

export default meta;

export const TransactionReceipt: Story = {
    args: {
        chain_name: "eth-mainnet",
        tx_hash:
            "0x7a038d2f5be4d196a3ff389497f8d61a639e4a32d353758b4f062cafbc5d475c",
        actionable_transaction: (address) => storyAction(address),
        actionable_address: (address) => storyAction(address),
    },
};
