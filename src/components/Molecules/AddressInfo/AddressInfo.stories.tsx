import { type Meta, type StoryObj } from "@storybook/react";
import { AddressInfo as AddressInfoComponent } from "./AddressInfo";

type Story = StoryObj<typeof AddressInfoComponent>;

const meta: Meta<typeof AddressInfoComponent> = {
    title: "Molecules",
    component: AddressInfoComponent,
};

export default meta;

export const AddressInfo: Story = {
    args: {
        address: "0xf15689636571dba322b48E9EC9bA6cFB3DF818e1",
        chain_names: ["eth-mainnet", "matic-mainnet"],
    },
};
