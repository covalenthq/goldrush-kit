import { type Meta, type StoryObj } from "@storybook/react";
import { AddressCard as AddressCardComponent } from "./AddressCard";
import { storyAction } from "@/utils/functions";

type Story = StoryObj<typeof AddressCardComponent>;

const meta: Meta<typeof AddressCardComponent> = {
    title: "Atoms/Address Card",
    component: AddressCardComponent,
};

export default meta;

export const AddressCard: Story = {
    args: {
        address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        type: "effigy",
        actionable_address: (address: string) => storyAction(address),
    },
};
