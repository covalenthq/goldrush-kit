import { type Meta, type StoryObj } from "@storybook/react";
import { GasCard as GasCardComponent } from "./GasCard";

type Story = StoryObj<typeof GasCardComponent>;

const meta: Meta<typeof GasCardComponent> = {
    title: "Molecules/Gas Card",
    component: GasCardComponent,
};

export default meta;

export const GasCard: Story = {
    args: {
        address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        type: "effigy",
    },
};
