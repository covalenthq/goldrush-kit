import { BlockDetails as BlockDetailsComponent } from "./BlockDetails";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof BlockDetailsComponent>;

const meta: Meta<typeof BlockDetailsComponent> = {
    title: "Molecules/Block/Block Details",
    component: BlockDetailsComponent,
};

export default meta;

export const BlockDetails: Story = {
    args: {
        chain_name: "eth-mainnet",
        height: 16643179,
    },
};
