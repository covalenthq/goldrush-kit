import { type Meta, type StoryObj } from "@storybook/react";
import { AddressDetails as AddressInfoComponent } from "./AddressDetails";

type Story = StoryObj<typeof AddressInfoComponent>;

const meta: Meta<typeof AddressInfoComponent> = {
    title: "Molecules/Address Details",
    component: AddressInfoComponent,
};

export default meta;

export const AddressDetails: Story = {
    args: {
        address: "0xf15689636571dba322b48E9EC9bA6cFB3DF818e1",
        chain_name: "eth-mainnet",
    },
};
