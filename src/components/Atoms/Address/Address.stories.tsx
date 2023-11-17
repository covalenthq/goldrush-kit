import { type Meta, type StoryObj } from "@storybook/react";
import { Address } from "./Address";

const meta: Meta<typeof Address> = {
    title: "Atoms/Address",
    component: Address,
};

export default meta;

type Story = StoryObj<typeof Address>;

export const AddressDisplay: Story = {
    args: {
        address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
    },
};
