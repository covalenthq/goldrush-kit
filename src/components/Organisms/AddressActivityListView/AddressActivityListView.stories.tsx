import { type Meta, type StoryObj } from "@storybook/react";
import { AddressActivityListView } from "./AddressActivityListView";

type Story = StoryObj<typeof AddressActivityListView>;

const meta: Meta<typeof AddressActivityListView> = {
    title: "Organisms/Address Activity",
    component: AddressActivityListView,
};

export default meta;

export const AddressActivity: Story = {
    args: {
        address: "ganeshswami.eth",
    },
};
