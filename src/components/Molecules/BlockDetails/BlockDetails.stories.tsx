import { type Meta, type StoryObj } from "@storybook/react";
import { BlockDetails } from "./BlockDetails";

type Story = StoryObj<typeof BlockDetails>;

const meta: Meta<typeof BlockDetails> = {
    title: "Molecules",
    component: BlockDetails,
};

export default meta;

export const BlockCard: Story = {
    args: {
        block_id: 12345678,
        chain_name: "eth-mainnet",
        icon_url: "https://images.app.goo.gl/hhjL26ADvAZ9gKcU6"
    },
};
