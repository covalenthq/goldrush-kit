import { type Meta, type StoryObj } from "@storybook/react";
import { AddressActivityList as AddressActivityListComponent } from "./AddressActivityList";

type Story = StoryObj<typeof AddressActivityListComponent>;

const meta: Meta<typeof AddressActivityListComponent> = {
    title: "Molecules/Address Activity List",
    component: AddressActivityListComponent,
};

export default meta;

export const AddressActivityList: Story = {
    args: {
        address: "ganeshswami.eth",
    },
};
