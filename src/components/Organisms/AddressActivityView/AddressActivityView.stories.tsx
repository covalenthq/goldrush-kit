import { AddressActivityView as AddressActivityViewComponent } from "./AddressActivityView";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof AddressActivityViewComponent>;

const meta: Meta<typeof AddressActivityViewComponent> = {
    title: "Organisms/Address Activity View",
    component: AddressActivityViewComponent,
};

export default meta;

export const AddressActivityView: Story = {
    args: {
        address: "demo.eth",
        actionable_address: (address) => storyAction(address),
    },
};
