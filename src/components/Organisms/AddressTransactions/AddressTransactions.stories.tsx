import { type Meta, type StoryObj } from "@storybook/react";
import { AddressTransactions as AddressTransactionsComponent } from "./AddressTransactions";

type Story = StoryObj<typeof AddressTransactionsComponent>;

const meta: Meta<typeof AddressTransactionsComponent> = {
    title: "Organisms/Address Transactions",
    component: AddressTransactionsComponent,
};

export default meta;

export const AddressTransactions: Story = {
    args: {
        chain_name: "eth-mainnet",
        address: "0x972B8FAD70de6e430D8b368198AbFF1E42eFf022",
    },
};
