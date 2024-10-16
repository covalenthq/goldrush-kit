import { LatestBlocks as LatestBlocksComponent } from "./LatestBlocks";
import { storyAction } from "@/utils/functions";
import { type Meta, type StoryObj } from "@storybook/react";

type Story = StoryObj<typeof LatestBlocksComponent>;

const meta: Meta<typeof LatestBlocksComponent> = {
    title: "Molecules/Block/Latest Blocks",
    component: LatestBlocksComponent,
};

export default meta;

export const LatestBlocks: Story = {
    args: {
        chain_name: "eth-mainnet",
        actionable_block: (block_height) => storyAction(block_height),
        actionable_redirect: () => ({
            parent: "a",
            parentProps: {
                href: "/?path=/story/molecules-block-blocks-list--blocks-list",
                className: "hover:underline w-fit mx-auto",
            },
        }),
    },
};
