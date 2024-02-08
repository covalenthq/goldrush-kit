import { type Meta, type StoryObj } from "@storybook/react";
import { AddressSummary as AddressDetailsComponent } from "./AddressSummary";

type Story = StoryObj<typeof AddressDetailsComponent>;

const meta: Meta<typeof AddressDetailsComponent> = {
    title: "Molecules/Address",
    component: AddressDetailsComponent,
};

export default meta;

export const AddressSummary: Story = {
    args: {
        address: "0xf15689636571dba322b48E9EC9bA6cFB3DF818e1",
        chain_name: "eth-mainnet",
    },
};
