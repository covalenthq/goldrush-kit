import { type Meta, type StoryObj } from "@storybook/react";
import { TransactionDetails as TransactionDetailsComponent } from "./TransactionDetails";

type Story = StoryObj<typeof TransactionDetailsComponent>;

const meta: Meta<typeof TransactionDetailsComponent> = {
    title: "Molecules/Transaction Details",
    component: TransactionDetailsComponent,
};

export default meta;

export const TransactionDetails: Story = {
    args: {
        chain_name: "eth-mainnet",
        tx_hash:
            "0x7a038d2f5be4d196a3ff389497f8d61a639e4a32d353758b4f062cafbc5d475c",
    },
};
