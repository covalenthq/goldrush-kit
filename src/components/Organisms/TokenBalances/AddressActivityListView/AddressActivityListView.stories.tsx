import { type Meta, type StoryObj } from "@storybook/react";
import { AddressActivityListView } from "./AddressActivityListView";

type Story = StoryObj<typeof AddressActivityListView>;

const meta: Meta<typeof AddressActivityListView> = {
    title: "Organisms/Token Balances",
    component: AddressActivityListView,
};

export default meta;

export const AddressActivityList: Story = {
    args: {
        address: "ganeshswami.eth",
    },
};
