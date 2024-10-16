import { AddressActivityList as AddressActivityListComponent } from "./AddressActivityList";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof AddressActivityListComponent>;

const meta: Meta<typeof AddressActivityListComponent> = {
    title: "Molecules/Address/Address Activity List",
    component: AddressActivityListComponent,
};

export default meta;

export const AddressActivityList: Story = {
    args: {
        address: "demo.eth",
        changeSelectedChain: false,
    },
};
