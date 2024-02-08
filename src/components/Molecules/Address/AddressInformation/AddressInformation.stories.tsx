import { type Meta, type StoryObj } from "@storybook/react";
import { AddressInformation as AddressInfoComponent } from "./AddressInformation";

type Story = StoryObj<typeof AddressInfoComponent>;

const meta: Meta<typeof AddressInfoComponent> = {
    title: "Molecules/Address",
    component: AddressInfoComponent,
};

export default meta;

export const AddressInformation: Story = {
    args: {
        address: "0xf15689636571dba322b48E9EC9bA6cFB3DF818e1",
        chain_name: "eth-mainnet",
    },
};
