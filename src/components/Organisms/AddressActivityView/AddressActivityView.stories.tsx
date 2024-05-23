import { type Meta, type StoryObj } from "@storybook/react";
import { AddressActivityView as AddressActivityViewComponent } from "./AddressActivityView";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof AddressActivityViewComponent>;

const meta: Meta<typeof AddressActivityViewComponent> = {
    title: "Organisms/Address Activity View",
    component: AddressActivityViewComponent,
};

export default meta;

export const AddressActivityView: Story = {
    args: {
        address: "ganeshswami.eth",
        actionable_address: (address: string) => storyAction(address),
    },
};
