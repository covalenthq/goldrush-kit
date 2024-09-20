import { TransactionDetails as TransactionDetailsComponent } from "./TransactionDetails";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof TransactionDetailsComponent>;

const meta: Meta<typeof TransactionDetailsComponent> = {
    title: "Molecules/Transaction/Transaction Details",
    component: TransactionDetailsComponent,
};

export default meta;

export const TransactionDetails: Story = {
    args: {
        chain_name: "eth-mainnet",
        tx_hash:
            "0x7a038d2f5be4d196a3ff389497f8d61a639e4a32d353758b4f062cafbc5d475c",
        actionable_block: (block) => storyAction(block),
        actionable_transaction: (address) => storyAction(address),
        actionable_from: (address) => storyAction(address),
        actionable_to: (address) => storyAction(address),
    },
};
