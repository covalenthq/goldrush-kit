import { type Meta, type StoryObj } from "@storybook/react";
import { AddressDetailView } from "./AddressDetailView";

type Story = StoryObj<typeof AddressDetailView>;

const meta: Meta<typeof AddressDetailView> = {
    title: "Organisms",
    component: AddressDetailView,
};

export default meta;

export const AddressDetails: Story = {
    args: {
        address: "0xf15689636571dba322b48E9EC9bA6cFB3DF818e1",
        chain_name: "eth-mainnet",
    },
};
