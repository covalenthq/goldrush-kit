import { type Meta, type StoryObj } from "@storybook/react";
import BlockDetailsDisplay from "./BlockDetailsDisplay";

type Story = StoryObj<typeof BlockDetailsDisplay>;

const meta: Meta<typeof BlockDetailsDisplay> = {
    title: "Molecules",
    component: BlockDetailsDisplay,
};

export default meta;

export const BlockDetailCard: Story = {
    args: {
        block_id: 12345678,
        chain_name: "eth-mainnet",
    },
};