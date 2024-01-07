import { type Meta, type StoryObj } from "@storybook/react";
import { BlockDetailsView } from "./BlockDetailsView";

type Story = StoryObj<typeof BlockDetailsView>;

const meta: Meta<typeof BlockDetailsView> = {
    title: "Molecules",
    component: BlockDetailsView,
};

export default meta;

export const BlockDetails: Story = {
    args: {
        block_id: 12345678,
        chain_name: "eth-mainnet",
    },
};
