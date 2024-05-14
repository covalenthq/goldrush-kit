import { type Meta, type StoryObj } from "@storybook/react";
import { AddressActivityDetails as AddressActivityDetailsComponent } from "./AddressActivityDetails";

type Story = StoryObj<typeof AddressActivityDetailsComponent>;

const meta: Meta<typeof AddressActivityDetailsComponent> = {
    title: "Molecules/Address/Address Activity Details",
    component: AddressActivityDetailsComponent,
};

export default meta;

export const AddressActivityDetails: Story = {
    args: {
        address: "ganeshswami.eth",
        hide_no_activity: true,
    },
};
