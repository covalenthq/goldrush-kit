import { type Meta, type StoryObj } from "@storybook/react";
import { AddressActivityView as AddressActivityViewComponent } from "./AddressActivityView";

type Story = StoryObj<typeof AddressActivityViewComponent>;

const meta: Meta<typeof AddressActivityViewComponent> = {
    title: "Organisms/Address Activity View",
    component: AddressActivityViewComponent,
};

export default meta;

export const AddressActivityView: Story = {
    args: {
        address: "ganeshswami.eth",
    },
};
