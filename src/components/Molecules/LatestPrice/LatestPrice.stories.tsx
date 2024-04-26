import { type Meta, type StoryObj } from "@storybook/react";
import { LatestPrice as LatestPriceComponent } from "./LatestPrice";

type Story = StoryObj<typeof LatestPriceComponent>;

const meta: Meta<typeof LatestPriceComponent> = {
    title: "Molecules/Latest Price",
    component: LatestPriceComponent,
};

export default meta;

export const LatestPrice: Story = {
    args: {
        chain_name: "eth-mainnet",
    },
};
