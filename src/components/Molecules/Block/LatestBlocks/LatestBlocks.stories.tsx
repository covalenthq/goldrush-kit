import { type Meta, type StoryObj } from "@storybook/react";
import { LatestBlocks as LatestBlocksComponent } from "./LatestBlocks";
import { type Block } from "@covalenthq/client-sdk";
import { fn } from "@storybook/test";

type Story = StoryObj<typeof LatestBlocksComponent>;

const meta: Meta<typeof LatestBlocksComponent> = {
    title: "Molecules/Block/Latest Blocks",
    component: LatestBlocksComponent,
};

export default meta;

export const LatestBlocks: Story = {
    args: {
        chain_name: "eth-mainnet",
        actionable_block: (block: Block) => ({
            parent: "button",
            parentProps: {
                onClick: fn(() => {
                    console.log(block);
                }),
            },
        }),
    },
};
