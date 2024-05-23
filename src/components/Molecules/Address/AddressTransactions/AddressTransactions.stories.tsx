import { type Meta, type StoryObj } from "@storybook/react";
import { AddressTransactions as AddressTransactionsComponent } from "./AddressTransactions";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof AddressTransactionsComponent>;

const meta: Meta<typeof AddressTransactionsComponent> = {
    title: "Molecules/Address/Address Transactions",
    component: AddressTransactionsComponent,
};

export default meta;

export const AddressTransactions: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0x972B8FAD70de6e430D8b368198AbFF1E42eFf022",
        actionable_transaction: (tx_hash) => storyAction(tx_hash),
    },
};
