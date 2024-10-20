import { TransactionRawLogs as TransactionReceiptComponent } from "./TransactionRawLogs";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TransactionReceiptComponent>;

const meta: Meta<typeof TransactionReceiptComponent> = {
    title: "Molecules/Transaction/Transaction Raw Logs",
    component: TransactionReceiptComponent,
};

export default meta;

export const TransactionRawLogs: Story = {
    args: {
        chain_name: "eth-mainnet",
        tx_hash:
            "0x59ae86b6f07e922bd41dcc40fb22a13baee3457eafad22d7d279bfcc72addf09",
        actionable_address: (address) => storyAction(address),
    },
};
