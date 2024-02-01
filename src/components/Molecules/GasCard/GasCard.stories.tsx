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
        chain_name: "eth-mainnet",
        event_type: "erc20",
    },
};
