import { type Meta, type StoryObj } from "@storybook/react";
import { BlockCardView } from "./BlockCardView";

type Story = StoryObj<typeof BlockCardView>;

const meta: Meta<typeof BlockCardView> = {
    title: "Molecules",
    component: BlockCardView,
};

export default meta;

export const BlockCard: Story = {
    args: {
        block_id: 12345678,
        chain_name: "eth-mainnet",
    },
};
