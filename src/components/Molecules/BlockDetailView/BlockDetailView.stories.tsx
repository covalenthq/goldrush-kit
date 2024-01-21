import { type Meta, type StoryObj } from "@storybook/react";
import { BlockDetailView } from "./BlockDetailView";

type Story = StoryObj<typeof BlockDetailView>;

const meta: Meta<typeof BlockDetailView> = {
    title: "Molecules",
    component: BlockDetailView,
};

export default meta;

export const BlockDetail: Story = {
    args: {
        chain_name: "eth-mainnet",
        block_height: "19056075",
    },
};
