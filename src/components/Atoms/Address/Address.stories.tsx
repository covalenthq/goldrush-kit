import { type Meta, type StoryObj } from "@storybook/react";
import { Address as AddressComponent } from "./Address";
import { fn } from "@storybook/test";

const meta: Meta<typeof AddressComponent> = {
    title: "Atoms/Address",
    component: AddressComponent,
};

export default meta;

type Story = StoryObj<typeof AddressComponent>;

export const Address: Story = {
    args: {
        address: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
        show_copy_icon: true,
        actionable_address: (address: string) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(address);
                }),
                className: "hover:underline",
            },
        }),
    },
};
