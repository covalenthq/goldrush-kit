import { type Meta, type StoryObj } from "@storybook/react";
import { AddressView } from "./AddressView";

const meta: Meta<typeof AddressView> = {
    title: "Atoms/Address",
    component: AddressView,
};

export default meta;

type Story = StoryObj<typeof AddressView>;

export const Address: Story = {
    args: {
        address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    },
};
