import { type Meta, type StoryObj } from "@storybook/react";
import { AddressDetailsView } from "./AddressDetailsView";

type Story = StoryObj<typeof AddressDetailsView>;

const meta: Meta<typeof AddressDetailsView> = {
    title: "Organisms",
    component: AddressDetailsView,
};

export default meta;

export const AddressDetails: Story = {
    args: {
        address: "0xf15689636571dba322b48E9EC9bA6cFB3DF818e1",
        chain_name: "eth-mainnet",
    },
};
