import { type Meta, type StoryObj } from "@storybook/react";
import { AddressOverview as AddressOverviewComponent } from "./AddressOverview";

type Story = StoryObj<typeof AddressOverviewComponent>;

const meta: Meta<typeof AddressOverviewComponent> = {
    title: "Molecules",
    component: AddressOverviewComponent,
};

export default meta;

export const AddressOverview: Story = {
    args: {
        address: "0xf15689636571dba322b48E9EC9bA6cFB3DF818e1",
        chain_name: "eth-mainnet",
    },
};
